import { prisma } from '../index'
import { PrismaGenerator } from '../PrismaGenerator'
import { DataSourceProvider, Enum, Generator } from '@pmaltese/prisma-schema-generator'

describe('PrismaGenerator', () => {
  test('Models - should correctly generate the schema for primitive field types', async () => {
    @prisma.model()
    class Customer {
      @prisma.field({ required: true, isId: true })
      id: string

      @prisma.field({ required: true })
      firstname: string

      @prisma.field({ required: true })
      lastname: string

      @prisma.field()
      age: number

      @prisma.field()
      isAdult: boolean

      @prisma.field()
      createdAt: Date

      @prisma.field({ isUpdatedAt: true })
      updatedAt: Date
    }
    const prismaGenerator = new PrismaGenerator()

    const { schema } = await prismaGenerator.reflectModels([Customer]).generate()
    expect(schema).toMatchObject({
      models: [
        {
          name: 'Customer',
          fields: [
            {
              name: 'id',
              isList: false,
              isRequired: true,
              isUnique: false,
              kind: 'scalar',
              type: 'String',
              isId: true,
              isUpdatedAt: false,
              default: null,
              isForeignKey: false,
            },
            {
              name: 'firstname',
              isList: false,
              isRequired: true,
              isUnique: false,
              kind: 'scalar',
              type: 'String',
              isId: false,
              isUpdatedAt: false,
              default: null,
              isForeignKey: false,
            },
            {
              name: 'lastname',
              isList: false,
              isRequired: true,
              isUnique: false,
              kind: 'scalar',
              type: 'String',
              isId: false,
              isUpdatedAt: false,
              default: null,
              isForeignKey: false,
            },
            {
              name: 'age',
              isList: false,
              isRequired: false,
              isUnique: false,
              kind: 'scalar',
              type: 'Float',
              isId: false,
              isUpdatedAt: false,
              default: null,
              isForeignKey: false,
            },
            {
              name: 'isAdult',
              isList: false,
              isRequired: false,
              isUnique: false,
              kind: 'scalar',
              type: 'Boolean',
              isId: false,
              isUpdatedAt: false,
              default: null,
              isForeignKey: false,
            },
            {
              name: 'createdAt',
              isList: false,
              isRequired: false,
              isUnique: false,
              kind: 'scalar',
              type: 'DateTime',
              isId: false,
              isUpdatedAt: false,
              default: null,
              isForeignKey: false,
            },
            {
              name: 'updatedAt',
              isList: false,
              isRequired: false,
              isUnique: false,
              kind: 'scalar',
              type: 'DateTime',
              isId: false,
              isUpdatedAt: true,
              default: null,
              isForeignKey: false,
            },
          ],
        },
      ],
      views: [],
    })
  })

  test('Models - should correctly generate the relations and indexes', async () => {
    @prisma.model({
      indexes: [{ fields: [{ name: 'id', sort: 'asc' }] }],
      uniqueIndexes: [{ fields: [{ name: 'id' }] }],
      fullTextIndexes: [{ fields: [{ name: 'firstname' }, { name: 'lastname' }] }],
    })
    class Customer {
      @prisma.field({ required: true, isId: true })
      id: string

      @prisma.field({ required: true })
      firstname: string

      @prisma.field({ required: true })
      lastname: string

      @prisma.field({
        type: 'CustomerToken',
        isList: true,
        required: true,
      })
      tokens: Array<CustomerToken>
    }

    @prisma.model()
    class CustomerToken {
      @prisma.field()
      customerId: string

      @prisma.field({
        type: 'Customer',
        relationFields: ['customerId'],
        relationReferences: ['id'],
      })
      customer: Customer
    }
    const prismaGenerator = new PrismaGenerator()

    const { schema } = await prismaGenerator.reflectModels([Customer, CustomerToken]).generate()
    expect(schema).toMatchObject({
      models: [
        {
          name: 'Customer',
          fields: [
            {
              name: 'id',
              // [...]
            },
            {
              name: 'firstname',
              // [...]
            },
            {
              name: 'lastname',
              // [...]
            },
            {
              name: 'tokens',
              isList: true,
              isRequired: true,
              kind: 'object',
              type: 'CustomerToken',
              relationName: null,
              relationToFields: [],
              relationToReferences: [],
              relationOnDelete: 'NONE',
              relationOnUpdate: 'NONE',
            },
          ],
          indexes: [
            {
              fields: [
                {
                  name: 'id',
                  sort: 'asc',
                },
              ],
            },
          ],
          fullTextIndexes: [
            {
              fields: [
                {
                  name: 'firstname',
                },
                {
                  name: 'lastname',
                },
              ],
            },
          ],
          uniqueIndexes: [
            {
              fields: [
                {
                  name: 'id',
                },
              ],
            },
          ],
        },
        {
          name: 'CustomerToken',
          fields: [
            {
              name: 'customerId',
              // [...]
            },
            {
              name: 'customer',
              isList: false,
              isRequired: false,
              kind: 'object',
              type: 'Customer',
              relationName: null,
              relationToFields: ['customerId'],
              relationToReferences: ['id'],
              relationOnDelete: 'NONE',
              relationOnUpdate: 'NONE',
            },
          ],
        },
      ],
    })
  })

  test('DataSource - should correctly set up the data source', async () => {
    const prismaGenerator = new PrismaGenerator()
    const { schema } = await prismaGenerator
      .setDatasource({
        name: 'myDatasource',
        environmentVariable: 'DB_URL',
        provider: DataSourceProvider.PostgreSQL,
      })
      .generate()

    expect(schema).toMatchObject({
      dataSource: {
        name: 'myDatasource',
        provider: 'postgresql',
        url: {
          name: 'DB_URL',
        },
      },
    })
  })

  test('Generator - should correctly set up the generators', async () => {
    const prismaGenerator = new PrismaGenerator()
    const generatorsConfig: Array<Generator> = [
      {
        name: 'client1',
        provider: 'prisma-client-js',
        // output: './src/generated/prisma-client-js',
        previewFeatures: ['fullTextSearch', 'fullTextIndex', 'clientExtensions'],
      },
      {
        name: 'client2',
        provider: 'prisma-client-js',
        output: './src/generated/prisma-client-js',
        previewFeatures: ['fullTextSearch', 'fullTextIndex', 'clientExtensions'],
        binaryTargets: ['linux-musl'],
      },
    ]
    const { schema } = await prismaGenerator.setGenerators(generatorsConfig).generate()

    expect(schema).toMatchObject({
      generators: generatorsConfig,
    })
  })

  test('Enums - should correctly set up the enums', async () => {
    const prismaGenerator = new PrismaGenerator()
    const enumsConfig: Array<Enum> = [{ name: 'myEnum', values: ['ONE', 'TWO'] }]
    const { schema } = await prismaGenerator.setEnums(enumsConfig).generate()

    expect(schema).toMatchObject({
      enums: enumsConfig,
    })
  })

  test('Schema - should correctly generate a prisma string', async () => {
    @prisma.model()
    class Customer {
      @prisma.field({ required: true, isId: true })
      id: string

      @prisma.field({ required: true })
      firstname: string

      @prisma.field({ required: true })
      lastname: string

      @prisma.field({
        type: 'CustomerToken',
        isList: true,
        required: true,
      })
      tokens: Array<CustomerToken>
    }

    @prisma.model()
    class CustomerToken {
      @prisma.field()
      customerId: string

      @prisma.field({
        type: 'Customer',
        relationFields: ['customerId'],
        relationReferences: ['id'],
      })
      customer: Customer
    }

    const prismaGenerator = new PrismaGenerator()
      .setGenerators([
        {
          name: 'client1',
          provider: 'prisma-client-js',
          previewFeatures: ['fullTextSearch', 'fullTextIndex', 'clientExtensions'],
        },
      ])
      .setDatasource({
        name: 'myDatasource',
        environmentVariable: 'DB_URL',
        provider: DataSourceProvider.PostgreSQL,
      })
      .reflectModels([Customer, CustomerToken])

    const { prismaString } = await prismaGenerator
      .reflectModels([Customer, CustomerToken])
      .generate()

    expect(prismaString).toMatchSnapshot()
  })
})
