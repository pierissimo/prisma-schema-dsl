import { printDocumentation, printField } from '../print'
import { AUTO_INCREMENT, CUID, NOW, ScalarType, UUID } from '../types'
import { createObjectField, createScalarField } from '../builders'
import {
  EXAMPLE_DATA_SOURCE,
  EXAMPLE_DOCUMENTATION,
  EXAMPLE_FIELD_NAME,
  EXAMPLE_OBJECT_NAME,
  EXAMPLE_RELATION_FIELD_NAME,
  EXAMPLE_RELATION_NAME,
  EXAMPLE_RELATION_REFERENCE_FIELD_NAME,
  EXAMPLE_STRING_FIELD,
  EXAMPLE_STRING_FIELD_WITH_NATIVE_MAPPING,
  EXAMPLE_STRING_FIELD_WITH_NATIVE_MAPPING_WITH_ARGS,
} from './data'

describe('printField', () => {
  test('simple string field', async () => {
    const printed = printField(EXAMPLE_STRING_FIELD, EXAMPLE_DATA_SOURCE)

    expect(printed).toEqual(`${EXAMPLE_FIELD_NAME} ${ScalarType.String}`)
  })

  test('simple string field with documentation', () => {
    const fieldWithDoc = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isUpdatedAt: false,
      defaultValue: undefined,
      documentation: EXAMPLE_DOCUMENTATION,
    })
    const result = printField(fieldWithDoc, EXAMPLE_DATA_SOURCE)
    expect(result).toEqual(
      `${printDocumentation(EXAMPLE_DOCUMENTATION)}\n${EXAMPLE_FIELD_NAME} ${ScalarType.String}`,
    )
  })

  test('simple float field', () => {
    const floatField = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Float,
      isList: false,
      isRequired: true,
    })
    const result = printField(floatField, EXAMPLE_DATA_SOURCE)
    expect(result).toEqual(`${EXAMPLE_FIELD_NAME} ${ScalarType.Float}`)
  })

  test('simple optional fields', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isRequired: false,
      isUnique: false,
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String}?`,
    )
  })

  test('simple required fields: string', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isRequired: true,
      isUnique: false,
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String}`,
    )
  })

  test('simple required fields: int', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Int,
      isRequired: true,
      isUnique: false,
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(`${EXAMPLE_FIELD_NAME} ${ScalarType.Int}`)
  })

  test('simple array fields', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isList: true,
      isRequired: true,
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String}[]`,
    )
  })

  test('simple string field with native mapping', async () => {
    const printed = printField(EXAMPLE_STRING_FIELD_WITH_NATIVE_MAPPING, EXAMPLE_DATA_SOURCE)

    expect(printed).toEqual(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String} @${EXAMPLE_DATA_SOURCE.name}.Text`,
    )
  })

  test('simple string field with native mapping with args', async () => {
    const printed = printField(
      EXAMPLE_STRING_FIELD_WITH_NATIVE_MAPPING_WITH_ARGS,
      EXAMPLE_DATA_SOURCE,
    )

    expect(printed).toEqual(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String} @${EXAMPLE_DATA_SOURCE.name}.VarChar(255)`,
    )
  })

  test('datetime fields', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.DateTime,
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isUpdatedAt: false,
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.DateTime}`,
    )
  })

  test('default value: int with default', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Int,
      isRequired: true,
      defaultValue: 42,
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.Int} @default(42)`,
    )
  })

  test('default value: int with autoincrement()', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Int,
      isRequired: true,
      defaultValue: { callee: AUTO_INCREMENT },
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.Int} @default(autoincrement())`,
    )
  })

  test('default value: string with uuid()', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isRequired: true,
      defaultValue: { callee: UUID },
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String} @default(uuid())`,
    )
  })

  test('default value: string with cuid()', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isRequired: true,
      defaultValue: { callee: CUID },
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String} @default(cuid())`,
    )
  })

  test('default value: datetime with now()', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.DateTime,
      isRequired: true,
      defaultValue: { callee: NOW },
    })
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.DateTime} @default(now())`,
    )
  })

  test('boolean field with default value', () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Boolean,
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isUpdatedAt: false,
      defaultValue: true,
    })
    const expected = `${EXAMPLE_FIELD_NAME} ${ScalarType.Boolean} @default(true)`
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(expected)
  })

  test('simple object field', () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
    })
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME}`
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(expected)
  })

  test('object field with relation', () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
      relationName: EXAMPLE_RELATION_NAME,
    })
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME} @relation(name: "${EXAMPLE_RELATION_NAME}")`
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(expected)
  })

  test('object field with fields', () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
      relationName: null,
      relationFields: [EXAMPLE_RELATION_FIELD_NAME],
    })
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME} @relation(fields: [${EXAMPLE_RELATION_FIELD_NAME}])`
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(expected)
  })

  test('object field with references', () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
      relationName: null,
      relationFields: [],
      relationReferences: [EXAMPLE_RELATION_REFERENCE_FIELD_NAME],
    })
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME} @relation(references: [${EXAMPLE_RELATION_REFERENCE_FIELD_NAME}])`
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(expected)
  })

  test('object field with full relation', () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
      relationName: EXAMPLE_RELATION_NAME,
      relationFields: [EXAMPLE_RELATION_FIELD_NAME],
      relationReferences: [EXAMPLE_RELATION_REFERENCE_FIELD_NAME],
    })
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME} @relation(name: "${EXAMPLE_RELATION_NAME}", fields: [${EXAMPLE_RELATION_FIELD_NAME}], references: [${EXAMPLE_RELATION_REFERENCE_FIELD_NAME}])`
    expect(printField(field, EXAMPLE_DATA_SOURCE)).toBe(expected)
  })
})
