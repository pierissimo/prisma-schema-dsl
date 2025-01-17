import { createModel, createScalarField } from '../builders'
import { DataSource, DataSourceProvider, ScalarType } from '../types'

export const EXAMPLE_DOCUMENTATION = 'Example Documentation'
export const EXAMPLE_ENUM_NAME = 'ExampleEnumName'
export const EXAMPLE_ENUM_VALUE = 'ExampleEnumValue'
export const EXAMPLE_OTHER_ENUM_VALUE = 'ExampleOtherEnumValue'
export const EXAMPLE_FIELD_NAME = 'exampleFieldName'
export const EXAMPLE_OTHER_FIELD_NAME = 'exampleOtherFieldName'
export const EXAMPLE_RELATION_FIELD_NAME = 'exampleRelationFieldName'
export const EXAMPLE_RELATION_REFERENCE_FIELD_NAME = 'exampleRelationReferenceFieldName'
export const EXAMPLE_STRING_FIELD = createScalarField({
  name: EXAMPLE_FIELD_NAME,
  type: ScalarType.String,
  isList: false,
  isRequired: true,
})
export const EXAMPLE_STRING_FIELD_WITH_NATIVE_MAPPING = createScalarField({
  name: EXAMPLE_FIELD_NAME,
  type: ScalarType.String,
  nativeMapping: { name: 'Text' },
  isList: false,
  isRequired: true,
})
export const EXAMPLE_STRING_FIELD_WITH_NATIVE_MAPPING_WITH_ARGS = createScalarField({
  name: EXAMPLE_FIELD_NAME,
  type: ScalarType.String,
  nativeMapping: { name: 'VarChar', arguments: [255] },
  isList: false,
  isRequired: true,
})
export const EXAMPLE_STRING_ID_FIELD = createScalarField({
  name: EXAMPLE_FIELD_NAME,
  type: ScalarType.String,
  isList: false,
  isRequired: true,
  isId: true,
})
export const EXAMPLE_OTHER_STRING_FIELD = createScalarField({
  name: 'exampleOtherFieldName',
  type: ScalarType.String,
  isList: false,
  isRequired: true,
})
export const EXAMPLE_OBJECT_NAME = 'ExampleObjectName'
export const EXAMPLE_MODEL_NAME = 'ExampleModelName'
export const EXAMPLE_MODEL = createModel({
  name: EXAMPLE_MODEL_NAME,
  fields: [EXAMPLE_STRING_ID_FIELD],
})
export const EXAMPLE_GENERATOR_NAME = 'exampleGeneratorName'
export const EXAMPLE_GENERATOR_PROVIDER = 'exampleGeneratorProvider'
export const EXAMPLE_GENERATOR_OUTPUT = 'example-generator-output'
export const EXAMPLE_BINARY_TARGET = 'example-binary-target'
export const EXAMPLE_GENERATOR_PREVIEW_FEATURE = 'fullTextSearch'
export const EXAMPLE_DATA_SOURCE_NAME = 'exampleDataSource'
export const EXAMPLE_DATA_SOURCE_PROVIDER = DataSourceProvider.MySQL
export const EXAMPLE_DATA_SOURCE_URL = 'mysql://example.com'
export const EXAMPLE_DATA_SOURCE: DataSource = {
  name: EXAMPLE_DATA_SOURCE_NAME,
  provider: EXAMPLE_DATA_SOURCE_PROVIDER,
  url: EXAMPLE_DATA_SOURCE_NAME,
}
export const EXAMPLE_RELATION_NAME = 'exampleRelationName'
export const EXAMPLE_MODEL_MAP = 'ExampleMappedName'
export const EXAMPLE_MODEL_SINGLE_INDEX = 'example-field-name-for-index'
export const POSTGRES_SQL_PROVIDER = DataSourceProvider.PostgreSQL
