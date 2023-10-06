import { createDataSource, createGenerator, createModel } from '../builders'
import {
  print,
  printModel,
  printModelFullTextIndexes,
  printModelIndexes,
  printUniqueIndexes,
} from '../print'
import { DataSourceProvider } from '../types'
import { getDMMF } from '@prisma/internals'
import {
  EXAMPLE_DATA_SOURCE,
  EXAMPLE_DOCUMENTATION,
  EXAMPLE_FIELD_NAME,
  EXAMPLE_MODEL_MAP,
  EXAMPLE_MODEL_NAME,
  EXAMPLE_OTHER_FIELD_NAME,
  EXAMPLE_OTHER_STRING_FIELD,
  EXAMPLE_STRING_ID_FIELD,
} from './data'

describe('printModel', () => {
  it('single field', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD],
    })
    const printed = printModel(model, EXAMPLE_DATA_SOURCE)
    const meta = await getDMMF({ datamodel: printed })

    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            primaryKey: null,
            isGenerated: false,
          },
        ],
      },
    })
  })

  it('single field and documentation', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD],
      documentation: EXAMPLE_DOCUMENTATION,
    })
    const printed = printModel(model, EXAMPLE_DATA_SOURCE)
    const meta = await getDMMF({ datamodel: printed })

    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            isGenerated: false,
            documentation: EXAMPLE_DOCUMENTATION,
          },
        ],
      },
    })
  })

  it('two fields', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
    })
    const printed = printModel(model, EXAMPLE_DATA_SOURCE)
    const meta = await getDMMF({ datamodel: printed })

    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: EXAMPLE_OTHER_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            isGenerated: false,
          },
        ],
      },
    })
  })

  it('single field and map', async () => {
    const EXAMPLE_MODEL = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD],
      documentation: '',
      map: EXAMPLE_MODEL_MAP,
    })
    const printed = printModel(EXAMPLE_MODEL, EXAMPLE_DATA_SOURCE)
    const meta = await getDMMF({ datamodel: printed })

    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            dbName: EXAMPLE_MODEL_MAP,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            isGenerated: false,
          },
        ],
      },
    })
  })

  it('two fields and one index', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      indexes: [{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: 'asc' }] }],
    })
    const printed = printModel(model, EXAMPLE_DATA_SOURCE)
    const meta = await getDMMF({ datamodel: printed })

    expect(printed).toContain(
      printModelIndexes([{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: 'asc' }] }]),
    )
    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: EXAMPLE_OTHER_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            isGenerated: false,
          },
        ],
      },
    })
  })

  it('two fields and two indexes', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: '',
      indexes: [
        {
          fields: [
            { name: EXAMPLE_FIELD_NAME, sort: 'desc' },
            { name: EXAMPLE_OTHER_FIELD_NAME, sort: 'asc' },
          ],
        },
      ],
    })
    const printed = printModel(model, EXAMPLE_DATA_SOURCE)
    const meta = await getDMMF({ datamodel: printed })

    expect(printed).toContain(
      printModelIndexes([
        {
          fields: [
            { name: EXAMPLE_FIELD_NAME, sort: 'desc' },
            { name: EXAMPLE_OTHER_FIELD_NAME, sort: 'asc' },
          ],
        },
      ]),
    )
    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            dbName: null,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: EXAMPLE_OTHER_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
          },
        ],
      },
    })
  })

  it('two fields and one unique index', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      uniqueIndexes: [{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: 'asc' }] }],
    })
    const printed = printModel(model, EXAMPLE_DATA_SOURCE)
    const meta = await getDMMF({ datamodel: printed })

    expect(printed).toContain(
      printUniqueIndexes([{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: 'asc' }] }]),
    )
    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            dbName: null,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isUnique: false,
              },
              {
                name: EXAMPLE_OTHER_FIELD_NAME,
                kind: 'scalar',
                isUnique: false,
              },
            ],
            uniqueFields: [[EXAMPLE_FIELD_NAME]],
            uniqueIndexes: [
              {
                name: null,
                fields: [EXAMPLE_FIELD_NAME],
              },
            ],
          },
        ],
      },
    })
  })

  it('two fields and two unique indexes', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: '',
      uniqueIndexes: [
        {
          name: 'customUniqueIndexName',
          fields: [
            { name: EXAMPLE_FIELD_NAME, sort: 'desc' },
            { name: EXAMPLE_OTHER_FIELD_NAME, sort: 'asc' },
          ],
        },
      ],
    })
    const printed = printModel(model, EXAMPLE_DATA_SOURCE)
    const meta = await getDMMF({ datamodel: printed })

    expect(printed).toContain(
      printUniqueIndexes([
        {
          name: 'customUniqueIndexName',
          fields: [
            { name: EXAMPLE_FIELD_NAME, sort: 'desc' },
            { name: EXAMPLE_OTHER_FIELD_NAME, sort: 'asc' },
          ],
        },
      ]),
    )
    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            dbName: null,
            fields: [
              {
                name: 'exampleFieldName',
                kind: 'scalar',
                isUnique: false,
              },
              {
                name: 'exampleOtherFieldName',
                kind: 'scalar',
                isUnique: false,
              },
            ],
            uniqueFields: [['exampleFieldName', 'exampleOtherFieldName']],
            uniqueIndexes: [
              {
                name: 'customUniqueIndexName',
                fields: ['exampleFieldName', 'exampleOtherFieldName'],
              },
            ],
          },
        ],
      },
    })
  })

  test('two fields and one full text index', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: '',
      fullTextIndexes: [{ fields: [{ name: EXAMPLE_FIELD_NAME }] }],
    })
    const generator = createGenerator({
      name: 'gen',
      provider: 'prisma-client-js',
      previewFeatures: ['fullTextIndex'],
    })
    const dataSource = createDataSource({
      name: 'datasource',
      provider: DataSourceProvider.MySQL,
      url: '',
    })
    const printed = await print({
      dataSource,
      models: [model],
      generators: [generator],
      enums: [],
    })
    const meta = await getDMMF({ datamodel: printed })

    expect(printed).toContain(
      printModelFullTextIndexes([{ fields: [{ name: EXAMPLE_FIELD_NAME }] }]),
    )
    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: EXAMPLE_OTHER_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            isGenerated: false,
          },
        ],
      },
    })
  })

  test('two fields and two full text indexes', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: '',
      fullTextIndexes: [
        {
          fields: [{ name: EXAMPLE_FIELD_NAME }, { name: EXAMPLE_OTHER_FIELD_NAME }],
        },
      ],
    })
    const generator = createGenerator({
      name: 'gen',
      provider: 'prisma-client-js',
      previewFeatures: ['fullTextIndex'],
    })
    const dataSource = createDataSource({
      name: 'datasource',
      provider: DataSourceProvider.MySQL,
      url: '',
    })
    const printed = await print({
      dataSource,
      models: [model],
      generators: [generator],
      enums: [],
    })
    const meta = await getDMMF({ datamodel: printed })

    expect(printed).toContain(
      printModelFullTextIndexes([
        {
          fields: [{ name: EXAMPLE_FIELD_NAME }, { name: EXAMPLE_OTHER_FIELD_NAME }],
        },
      ]),
    )
    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: EXAMPLE_OTHER_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            isGenerated: false,
          },
        ],
      },
    })
  })

  test('two fields, one index and one full text index', async () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: '',
      indexes: [{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: 'asc' }] }],
      fullTextIndexes: [{ fields: [{ name: EXAMPLE_OTHER_FIELD_NAME }] }],
    })

    const generator = createGenerator({
      name: 'gen',
      provider: 'prisma-client-js',
      previewFeatures: ['fullTextIndex'],
    })
    const dataSource = createDataSource({
      name: 'datasource',
      provider: DataSourceProvider.MySQL,
      url: '',
    })
    const printed = await print({
      dataSource,
      models: [model],
      generators: [generator],
      enums: [],
    })
    const meta = await getDMMF({ datamodel: printed })

    expect(printed).toContain(
      printModelIndexes([{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: 'asc' }] }]),
    )
    expect(printed).toContain(
      printModelFullTextIndexes([{ fields: [{ name: EXAMPLE_OTHER_FIELD_NAME }] }]),
    )
    expect(meta).toMatchObject({
      datamodel: {
        models: [
          {
            name: EXAMPLE_MODEL_NAME,
            fields: [
              {
                name: EXAMPLE_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: EXAMPLE_OTHER_FIELD_NAME,
                kind: 'scalar',
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: 'String',
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            isGenerated: false,
          },
        ],
      },
    })
  })
})
