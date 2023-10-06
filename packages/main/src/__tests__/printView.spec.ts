import { createGenerator, createView } from '../builders'
import { print, printUniqueIndexes, printView } from '../print'
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
import { getDMMF } from '@prisma/internals'
import { View } from '../types'

const generateDMMF = async (view: View) => {
  const generator = createGenerator({
    name: 'gen',
    provider: 'prisma-client-js',
    previewFeatures: ['views'],
  })
  const printed = await print({
    models: [],
    views: [view],
    generators: [generator],
    enums: [],
    dataSource: EXAMPLE_DATA_SOURCE,
  })

  return getDMMF({ datamodel: printed })
}

describe('printView', () => {
  it('single field', async () => {
    const view = createView({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD],
    })
    const meta = await generateDMMF(view)

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
            ],
          },
        ],
      },
    })
  })

  it('single field and documentation', async () => {
    const view = createView({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD],
      documentation: EXAMPLE_DOCUMENTATION,
    })
    const meta = await generateDMMF(view)

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
            ],
            documentation: 'Example Documentation',
          },
        ],
      },
    })
  })

  it('two fields', async () => {
    const view = createView({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
    })
    const meta = await generateDMMF(view)

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

  it('single field and map', async () => {
    const view = createView({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD],
      documentation: '',
      map: EXAMPLE_MODEL_MAP,
    })
    const meta = await generateDMMF(view)

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
          },
        ],
      },
    })
  })

  it('two fields and one unique index', async () => {
    const view = createView({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_ID_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      uniqueIndexes: [{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: 'asc' }] }],
    })
    const printed = printView(view, EXAMPLE_DATA_SOURCE)
    const meta = await generateDMMF(view)

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
    const view = createView({
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
    const printed = printView(view, EXAMPLE_DATA_SOURCE)
    const meta = await generateDMMF(view)

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
})
