import {
  createDataSource,
  createModel,
  createObjectField,
  createScalarField,
  createSchema,
  createView,
  DataSource,
  Enum,
  Generator,
  Model,
  ObjectField,
  print,
  ScalarField,
  ScalarType,
  Schema,
  View,
} from '@pmaltese/prisma-schema-generator'
import { ClassType, DecoratorId, reflect, TypeValue } from '@davinci/reflector'
import {
  FieldDecoratorMeta,
  ModelDecoratorMeta,
  ObjectDecoratorOptions,
  ScalarDecoratorOptions,
} from './types'

const scalarTypes = Object.values(ScalarType)

export class PrismaGenerator {
  datasource: DataSource
  schema: Schema
  generators: Array<Generator>
  enums: Array<Enum>
  classToModelMap = new Map<ClassType, Model>()
  classToViewMap = new Map<ClassType, View>()

  public reflectModels(classTypes: Array<ClassType>) {
    classTypes.forEach((classType) => {
      this.reflectModel(classType)
    })

    return this
  }

  public reflectModel(classType: ClassType) {
    const classReflection = reflect(classType)
    const modelDecorator: ModelDecoratorMeta = classReflection.decorators.find(
      (d) => d[DecoratorId] === 'davinci.prisma.model' || d[DecoratorId] === 'davinci.prisma.view',
    )
    const isModel = modelDecorator[DecoratorId] === 'davinci.prisma.model'

    const fields = classReflection.properties.reduce(
      (acc: Array<ScalarField | ObjectField>, propReflection) => {
        const fieldDecorator: FieldDecoratorMeta = propReflection.decorators.find(
          (d) => d[DecoratorId] === 'davinci.prisma.field',
        )

        if (fieldDecorator) {
          const fieldName = fieldDecorator.data?.name ?? propReflection.name
          /* if (typeof fieldDecorator.data?.type === 'string') {
            throw new Error('Syntax not yet supported')
          } */

          const isArray = Array.isArray(fieldDecorator.data?.type)
          const prismaTypeDefinition = this.parsePrismaType(
            fieldDecorator.data?.type ?? propReflection.type,
          )

          let field: ScalarField | ObjectField

          if (prismaTypeDefinition.isScalar) {
            const fieldDecoratorData = fieldDecorator.data as ScalarDecoratorOptions
            field = createScalarField({
              name: fieldName,
              type: prismaTypeDefinition.type as ScalarType,
              nativeMapping: fieldDecoratorData?.nativeMapping,
              isList: fieldDecoratorData?.isList ?? isArray,
              isRequired: fieldDecoratorData?.required,
              isUnique: fieldDecoratorData?.isUnique,
              isId: fieldDecoratorData?.isId,
              isUpdatedAt: fieldDecoratorData?.isUpdatedAt,
              defaultValue: fieldDecoratorData?.defaultValue,
              documentation: fieldDecoratorData?.documentation,
              isForeignKey: fieldDecoratorData?.isForeignKey,
            })
          } else {
            const fieldDecoratorData = fieldDecorator.data as ObjectDecoratorOptions
            field = createObjectField({
              name: fieldName,
              type: prismaTypeDefinition.type as ScalarType,
              nativeMapping: fieldDecoratorData?.nativeMapping,
              isList: fieldDecoratorData?.isList ?? isArray,
              isRequired: fieldDecoratorData?.required,
              relationName: fieldDecoratorData?.relationName,
              relationFields: fieldDecoratorData?.relationFields,
              relationReferences: fieldDecoratorData?.relationReferences,
              relationOnDelete: fieldDecoratorData?.relationOnDelete,
              relationOnUpdate: fieldDecoratorData?.relationOnUpdate,
              documentation: fieldDecoratorData?.documentation,
            })
          }

          acc.push(field)
        }

        return acc
      },
      [],
    )

    const entity = isModel
      ? createModel({
          name: modelDecorator.data?.name ?? classReflection.name,
          fields,
          map: modelDecorator.data?.map,
          indexes: modelDecorator.data?.indexes,
          uniqueIndexes: modelDecorator.data?.uniqueIndexes,
          fullTextIndexes: modelDecorator.data?.fullTextIndexes,
        })
      : createView({
          name: modelDecorator.data?.name ?? classReflection.name,
          fields,
          map: modelDecorator.data?.map,
          uniqueIndexes: modelDecorator.data?.uniqueIndexes,
        })
    if (isModel) {
      this.classToModelMap.set(classType, entity)
    } else {
      this.classToViewMap.set(classType, entity)
    }

    return {
      type: isModel ? 'model' : 'view',
      entity,
    }
  }

  public setDatasource({ name, provider, url, shadowDatabaseUrl, relationMode }: DataSource) {
    this.datasource = createDataSource({
      name,
      provider,
      url,
      shadowDatabaseUrl,
      relationMode,
    })

    return this
  }

  public setGenerators(generators: Array<Generator>) {
    this.generators = generators

    return this
  }

  public setEnums(enums: Array<Enum>) {
    this.enums = enums

    return this
  }

  public createSchema() {
    this.schema = createSchema({
      models: Array.from(this.classToModelMap.values()),
      enums: this.enums ?? [],
      dataSource: this.datasource,
      generators: this.generators,
      views: Array.from(this.classToViewMap.values()),
    })

    return this
  }

  public async generate() {
    if (!this.schema) {
      this.createSchema()
    }
    const prismaString = await print(this.schema)

    return { schema: this.schema, prismaString }
  }

  private parsePrismaType(type: TypeValue | ScalarType) {
    let isScalar = true
    let parsedType
    if (scalarTypes.includes(type as ScalarType)) {
      parsedType = type as ScalarType
    } else if (type === Date) {
      parsedType = ScalarType.DateTime
    } else if (type === String) {
      parsedType = ScalarType.String
    } else if (type === Number) {
      parsedType = ScalarType.Float
    } else if (type === Boolean) {
      parsedType = ScalarType.Boolean
    } else if (typeof type === 'function') {
      const { entity } = this.reflectModel(type as ClassType)
      parsedType = entity.name
      isScalar = false
    } else if (typeof type === 'string') {
      parsedType = type
      isScalar = false
    } else {
      throw new Error('Unrecognized type')
    }

    return { type: parsedType, isScalar }
  }
}
