import {
  createDataSource,
  createEnum,
  createGenerator,
  createModel,
  createObjectField,
  createScalarField,
  createSchema,
  createView,
} from "./builders";
import {
  print,
  printDocumentation,
  printEnum,
  printField,
  printGenerator,
  printModel,
  printModelFullTextIndexes,
  printModelIndexes,
  printModelMap,
  printView,
} from "./print";
import {
  AUTO_INCREMENT,
  CUID,
  DataSourceProvider,
  NOW,
  ScalarType,
  UUID,
} from "@pmaltese/prisma-schema-dsl-types";

const EXAMPLE_DOCUMENTATION = "Example Documentation";
const EXAMPLE_ENUM_NAME = "ExampleEnumName";
const EXAMPLE_ENUM_VALUE = "ExampleEnumValue";
const EXAMPLE_OTHER_ENUM_VALUE = "ExampleOtherEnumValue";
const EXAMPLE_FIELD_NAME = "exampleFieldName";
const EXAMPLE_RELATION_FIELD_NAME = "exampleRelationFieldName";
const EXAMPLE_RELATION_REFERENCE_FIELD_NAME =
  "exampleRelationReferenceFieldName";
const EXAMPLE_STRING_FIELD = createScalarField({
  name: EXAMPLE_FIELD_NAME,
  type: ScalarType.String,
  isList: false,
  isRequired: true,
});
const EXAMPLE_OTHER_STRING_FIELD = createScalarField({
  name: "exampleOtherFieldName",
  type: ScalarType.String,
  isList: false,
  isRequired: true,
});
const EXAMPLE_OBJECT_NAME = "ExampleObjectName";
const EXAMPLE_MODEL_NAME = "ExampleModelName";
const EXAMPLE_MODEL = createModel({
  name: EXAMPLE_MODEL_NAME,
  fields: [EXAMPLE_STRING_FIELD],
});
const EXAMPLE_GENERATOR_NAME = "exampleGeneratorName";
const EXAMPLE_GENERATOR_PROVIDER = "exampleGeneratorProvider";
const EXAMPLE_GENERATOR_OUTPUT = "example-generator-output";
const EXAMPLE_BINARY_TARGET = "example-binary-target";
const EXAMPLE_GENERATOR_PREVIEW_FEATURE = "fullTextSearch";
const EXAMPLE_DATA_SOURCE_NAME = "exampleDataSource";
const EXAMPLE_DATA_SOURCE_PROVIDER = DataSourceProvider.MySQL;
const EXAMPLE_DATA_SOURCE_URL = "mysql://example.com";
const EXAMPLE_RELATION_NAME = "exampleRelationName";
const EXAMPLE_MODEL_MAP = "ExampleMappedName";
const EXAMPLE_MODEL_SINGLE_INDEX = "example-field-name-for-index";
const POSTGRES_SQL_PROVIDER = DataSourceProvider.PostgreSQL;

describe("printEnum", () => {
  test("single value", () => {
    const theEnum = createEnum({
      name: EXAMPLE_ENUM_NAME,
      values: [EXAMPLE_ENUM_VALUE],
    });
    const expected = `enum ${EXAMPLE_ENUM_NAME} {\n${EXAMPLE_ENUM_VALUE}\n}`;
    expect(printEnum(theEnum)).toBe(expected);
  });

  test("single value with documentation", () => {
    const theEnum = createEnum({
      name: EXAMPLE_ENUM_NAME,
      values: [EXAMPLE_ENUM_VALUE],
      documentation: EXAMPLE_DOCUMENTATION,
    });
    const expected = `${printDocumentation(
      EXAMPLE_DOCUMENTATION
    )}\nenum ${EXAMPLE_ENUM_NAME} {\n${EXAMPLE_ENUM_VALUE}\n}`;
    expect(printEnum(theEnum)).toBe(expected);
  });

  test("two values", () => {
    const theEnum = createEnum({
      name: EXAMPLE_ENUM_NAME,
      values: [EXAMPLE_ENUM_VALUE, EXAMPLE_OTHER_ENUM_VALUE],
    });
    const expected = `enum ${EXAMPLE_ENUM_NAME} {\n${EXAMPLE_ENUM_VALUE}\n${EXAMPLE_OTHER_ENUM_VALUE}\n}`;
    expect(printEnum(theEnum)).toBe(expected);
  });
});

describe("printField", () => {
  test("simple string field", () => {
    const result = printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER);
    expect(result).toEqual(`${EXAMPLE_FIELD_NAME} ${ScalarType.String}`);
  });

  test("simple string field with documentation", () => {
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
    });
    const result = printField(fieldWithDoc, POSTGRES_SQL_PROVIDER);
    expect(result).toEqual(
      `${printDocumentation(EXAMPLE_DOCUMENTATION)}\n${EXAMPLE_FIELD_NAME} ${
        ScalarType.String
      }`
    );
  });

  test("simple float field", () => {
    const floatField = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Float,
      isList: false,
      isRequired: true,
    });
    const result = printField(floatField, POSTGRES_SQL_PROVIDER);
    expect(result).toEqual(`${EXAMPLE_FIELD_NAME} ${ScalarType.Float}`);
  });

  test("simple optional fields", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isRequired: false,
      isUnique: false,
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String}?`
    );
  });

  test("simple required fields: string", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isRequired: true,
      isUnique: false,
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String}`
    );
  });

  test("simple required fields: int", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Int,
      isRequired: true,
      isUnique: false,
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.Int}`
    );
  });

  test("simple array fields", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isList: true,
      isRequired: true,
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String}[]`
    );
  });

  test("datetime fields", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.DateTime,
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isUpdatedAt: false,
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.DateTime}`
    );
  });

  test("default value: int with default", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Int,
      isRequired: true,
      defaultValue: 42,
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.Int} @default(42)`
    );
  });

  test("default value: int with autoincrement()", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Int,
      isRequired: true,
      defaultValue: { callee: AUTO_INCREMENT },
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.Int} @default(autoincrement())`
    );
  });

  test("default value: string with uuid()", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isRequired: true,
      defaultValue: { callee: UUID },
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String} @default(uuid())`
    );
  });

  test("default value: string with cuid()", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.String,
      isRequired: true,
      defaultValue: { callee: CUID },
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.String} @default(cuid())`
    );
  });

  test("default value: datetime with now()", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.DateTime,
      isRequired: true,
      defaultValue: { callee: NOW },
    });
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(
      `${EXAMPLE_FIELD_NAME} ${ScalarType.DateTime} @default(now())`
    );
  });

  test("boolean field with default value", () => {
    const field = createScalarField({
      name: EXAMPLE_FIELD_NAME,
      type: ScalarType.Boolean,
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isUpdatedAt: false,
      defaultValue: true,
    });
    const expected = `${EXAMPLE_FIELD_NAME} ${ScalarType.Boolean} @default(true)`;
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(expected);
  });

  test("simple object field", () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
    });
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME}`;
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(expected);
  });

  test("object field with relation", () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
      relationName: EXAMPLE_RELATION_NAME,
    });
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME} @relation(name: "${EXAMPLE_RELATION_NAME}")`;
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(expected);
  });

  test("object field with fields", () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
      relationName: null,
      relationFields: [EXAMPLE_RELATION_FIELD_NAME],
    });
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME} @relation(fields: [${EXAMPLE_RELATION_FIELD_NAME}])`;
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(expected);
  });

  test("object field with references", () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
      relationName: null,
      relationFields: [],
      relationReferences: [EXAMPLE_RELATION_REFERENCE_FIELD_NAME],
    });
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME} @relation(references: [${EXAMPLE_RELATION_REFERENCE_FIELD_NAME}])`;
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(expected);
  });

  test("object field with full relation", () => {
    const field = createObjectField({
      name: EXAMPLE_FIELD_NAME,
      type: EXAMPLE_OBJECT_NAME,
      isList: false,
      isRequired: true,
      relationName: EXAMPLE_RELATION_NAME,
      relationFields: [EXAMPLE_RELATION_FIELD_NAME],
      relationReferences: [EXAMPLE_RELATION_REFERENCE_FIELD_NAME],
    });
    const expected = `${EXAMPLE_FIELD_NAME} ${EXAMPLE_OBJECT_NAME} @relation(name: "${EXAMPLE_RELATION_NAME}", fields: [${EXAMPLE_RELATION_FIELD_NAME}], references: [${EXAMPLE_RELATION_REFERENCE_FIELD_NAME}])`;
    expect(printField(field, POSTGRES_SQL_PROVIDER)).toBe(expected);
  });
});

describe("printModel", () => {
  it("single field", () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD],
    });
    const expected = `model ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
}`;
    expect(printModel(model, POSTGRES_SQL_PROVIDER)).toEqual(expected);
  });

  it("single field and documentation", () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD],
      documentation: EXAMPLE_DOCUMENTATION,
    });
    const expected = `${printDocumentation(EXAMPLE_DOCUMENTATION)}
model ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
}`;
    expect(printModel(model, POSTGRES_SQL_PROVIDER)).toEqual(expected);
  });

  it("two fields", () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD, EXAMPLE_OTHER_STRING_FIELD],
    });
    const expected = `model ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
${printField(EXAMPLE_OTHER_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
}`;
    expect(printModel(model, POSTGRES_SQL_PROVIDER)).toEqual(expected);
  });

  it("Single field and map", () => {
    const EXAMPLE_MODEL = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD],
      documentation: "",
      map: EXAMPLE_MODEL_MAP,
    });

    const expected = `model ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}

${printModelMap(EXAMPLE_MODEL_MAP)}
}`;
    expect(printModel(EXAMPLE_MODEL)).toEqual(expected);
  });

  it("Two fields and one index", () => {
    const EXAMPLE_MODEL = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: "",
      indexes: [{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: "asc" }] }],
    });
    const expected = `model ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
${printField(EXAMPLE_OTHER_STRING_FIELD, POSTGRES_SQL_PROVIDER)}

${printModelIndexes([{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: "asc" }] }])}
}`;
    expect(printModel(EXAMPLE_MODEL)).toEqual(expected);
  });

  it("two fields and two indexes", () => {
    const EXAMPLE_MODEL = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: "",
      indexes: [
        {
          fields: [
            { name: EXAMPLE_FIELD_NAME, sort: "desc" },
            { name: EXAMPLE_FIELD_NAME, sort: "asc" },
          ],
        },
      ],
    });
    const expected = `model ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
${printField(EXAMPLE_OTHER_STRING_FIELD, POSTGRES_SQL_PROVIDER)}

${printModelIndexes([
  {
    fields: [
      { name: EXAMPLE_FIELD_NAME, sort: "desc" },
      { name: EXAMPLE_FIELD_NAME, sort: "asc" },
    ],
  },
])}
}`;
    expect(printModel(EXAMPLE_MODEL)).toEqual(expected);
  });

  test("two fields and one full text index", () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: "",
      fullTextIndexes: [{ fields: [{ name: EXAMPLE_FIELD_NAME }] }],
    });
    const expected = `model ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
${printField(EXAMPLE_OTHER_STRING_FIELD, POSTGRES_SQL_PROVIDER)}

${printModelFullTextIndexes([{ fields: [{ name: EXAMPLE_FIELD_NAME }] }])}
}`;
    expect(printModel(model, POSTGRES_SQL_PROVIDER)).toBe(expected);
  });

  test("two fields and two full text indexes", () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: "",
      fullTextIndexes: [
        {
          fields: [{ name: EXAMPLE_FIELD_NAME }, { name: EXAMPLE_FIELD_NAME }],
        },
      ],
    });
    const expected = `model ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
${printField(EXAMPLE_OTHER_STRING_FIELD, POSTGRES_SQL_PROVIDER)}

${printModelFullTextIndexes([
  {
    fields: [{ name: EXAMPLE_FIELD_NAME }, { name: EXAMPLE_FIELD_NAME }],
  },
])}
}`;
    expect(printModel(model, POSTGRES_SQL_PROVIDER)).toBe(expected);
  });

  test("two fields, one index and one full text index", () => {
    const model = createModel({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD, EXAMPLE_OTHER_STRING_FIELD],
      documentation: "",
      indexes: [{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: "asc" }] }],
      fullTextIndexes: [{ fields: [{ name: EXAMPLE_FIELD_NAME }] }],
    });
    const expected = `model ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
${printField(EXAMPLE_OTHER_STRING_FIELD, POSTGRES_SQL_PROVIDER)}

${printModelIndexes([{ fields: [{ name: EXAMPLE_FIELD_NAME, sort: "asc" }] }])}

${printModelFullTextIndexes([{ fields: [{ name: EXAMPLE_FIELD_NAME }] }])}
}`;
    expect(printModel(model, POSTGRES_SQL_PROVIDER)).toBe(expected);
  });
});

describe("printView", () => {
  it("single field", () => {
    const view = createView({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD],
    });
    const expected = `view ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
}`;
    expect(printView(view, POSTGRES_SQL_PROVIDER)).toEqual(expected);
  });

  it("single field and documentation", () => {
    const view = createView({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD],
      documentation: EXAMPLE_DOCUMENTATION,
    });
    const expected = `${printDocumentation(EXAMPLE_DOCUMENTATION)}
view ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
}`;
    expect(printView(view, POSTGRES_SQL_PROVIDER)).toEqual(expected);
  });

  it("two fields", () => {
    const view = createView({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD, EXAMPLE_OTHER_STRING_FIELD],
    });
    const expected = `view ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
${printField(EXAMPLE_OTHER_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
}`;
    expect(printView(view, POSTGRES_SQL_PROVIDER)).toEqual(expected);
  });

  it("single field and map", () => {
    const view = createView({
      name: EXAMPLE_MODEL_NAME,
      fields: [EXAMPLE_STRING_FIELD],
      documentation: "",
      map: EXAMPLE_MODEL_MAP,
    });

    const expected = `view ${EXAMPLE_MODEL_NAME} {
${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}

${printModelMap(EXAMPLE_MODEL_MAP)}
}`;
    expect(printView(view)).toEqual(expected);
  });
});

describe("printGenerator", () => {
  test("name and provider only", () => {
    const generator = createGenerator({
      name: EXAMPLE_GENERATOR_NAME,
      provider: EXAMPLE_GENERATOR_PROVIDER,
    });
    const expected = `generator ${EXAMPLE_GENERATOR_NAME} {
  provider = "${EXAMPLE_GENERATOR_PROVIDER}"
}`;
    expect(printGenerator(generator)).toBe(expected);
  });

  test("output", () => {
    const generator = createGenerator({
      name: EXAMPLE_GENERATOR_NAME,
      provider: EXAMPLE_GENERATOR_PROVIDER,
      output: EXAMPLE_GENERATOR_OUTPUT,
    });
    const expected = `generator ${EXAMPLE_GENERATOR_NAME} {
  provider = "${EXAMPLE_GENERATOR_PROVIDER}"
  output = "${EXAMPLE_GENERATOR_OUTPUT}"
}`;
    expect(printGenerator(generator)).toBe(expected);
  });

  test("binary targets", () => {
    const generator = createGenerator({
      name: EXAMPLE_GENERATOR_NAME,
      provider: EXAMPLE_GENERATOR_PROVIDER,
      output: null,
      binaryTargets: [EXAMPLE_BINARY_TARGET],
    });
    const expected = `generator ${EXAMPLE_GENERATOR_NAME} {
  provider = "${EXAMPLE_GENERATOR_PROVIDER}"
  binaryTargets = ["${EXAMPLE_BINARY_TARGET}"]
}`;
    expect(printGenerator(generator)).toBe(expected);
  });

  test("preview features", () => {
    const generator = createGenerator({
      name: EXAMPLE_GENERATOR_NAME,
      provider: EXAMPLE_GENERATOR_PROVIDER,
      previewFeatures: [EXAMPLE_GENERATOR_PREVIEW_FEATURE],
    });
    const expected = `generator ${EXAMPLE_GENERATOR_NAME} {
  provider = "${EXAMPLE_GENERATOR_PROVIDER}"
  previewFeatures = ["${EXAMPLE_GENERATOR_PREVIEW_FEATURE}"]
}`;
    expect(printGenerator(generator)).toBe(expected);
  });
});

describe("print", () => {
  test("simple model", async () => {
    const schema = createSchema({ models: [EXAMPLE_MODEL], enums: [] });
    const expected = `model ${EXAMPLE_MODEL.name} {
  ${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
}`;
    expect(await print(schema)).toBe(expected + "\n");
  });

  test("two models", async () => {
    const schema = createSchema({
      models: [
        EXAMPLE_MODEL,
        createModel({
          name: "Order",
          fields: [EXAMPLE_STRING_FIELD],
        }),
      ],
      enums: [],
    });
    const expected = `model ${EXAMPLE_MODEL.name} {
  ${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
}

model Order {
  ${printField(EXAMPLE_STRING_FIELD, POSTGRES_SQL_PROVIDER)}
}`;
    expect(await print(schema)).toBe(expected + "\n");
  });

  test("single datasource", async () => {
    const schema = createSchema({
      models: [],
      enums: [],
      dataSource: createDataSource({
        name: EXAMPLE_DATA_SOURCE_NAME,
        provider: EXAMPLE_DATA_SOURCE_PROVIDER,
        url: EXAMPLE_DATA_SOURCE_URL,
      }),
    });
    const expected = `datasource ${EXAMPLE_DATA_SOURCE_NAME} {
  provider = "${EXAMPLE_DATA_SOURCE_PROVIDER}"
  url      = "${EXAMPLE_DATA_SOURCE_URL}"
}`;
    expect(await print(schema)).toBe(expected + "\n");
  });

  test("single datasource with relationMode", async () => {
    const schema = createSchema({
      models: [],
      enums: [],
      dataSource: createDataSource({
        name: EXAMPLE_DATA_SOURCE_NAME,
        provider: EXAMPLE_DATA_SOURCE_PROVIDER,
        url: EXAMPLE_DATA_SOURCE_URL,
        relationMode: "prisma",
      }),
    });
    const expected = `datasource ${EXAMPLE_DATA_SOURCE_NAME} {
  provider     = "${EXAMPLE_DATA_SOURCE_PROVIDER}"
  url          = "${EXAMPLE_DATA_SOURCE_URL}"
  relationMode = "prisma"
}`;
    expect(await print(schema)).toBe(expected + "\n");
  });

  test("single generator", async () => {
    const schema = createSchema({
      models: [],
      enums: [],
      dataSource: undefined,
      generators: [
        createGenerator({
          name: EXAMPLE_GENERATOR_NAME,
          provider: EXAMPLE_GENERATOR_PROVIDER,
        }),
      ],
    });
    const expected = `${printGenerator(
      createGenerator({
        name: EXAMPLE_GENERATOR_NAME,
        provider: EXAMPLE_GENERATOR_PROVIDER,
      })
    )}`;
    expect(await print(schema)).toBe(expected + "\n");
  });

  test("single enum", async () => {
    const schema = createSchema({
      models: [],
      enums: [
        createEnum({
          name: EXAMPLE_ENUM_NAME,
          values: [EXAMPLE_ENUM_VALUE],
        }),
      ],
    });
    const expected = `enum ${EXAMPLE_ENUM_NAME} {
  ${EXAMPLE_ENUM_VALUE}
}`;
    expect(await print(schema)).toBe(expected + "\n");
  });
});
