Introduction:

`prisma-schema-generator` is a package that provides a set of functions to programmatically generate a Prisma Schema file. With this package, you can easily generate the `schema.prisma` file that define your database schema, without manually writing it.

**Disclaimer**: This package is a fork of the original [prisma-schema-dsl](https://github.com/amplication/prisma-schema-dsl.) repository, which was developed by the Amplication team. The code present in this repository was modified and amended to my needs.

API:

The following functions are available in the `prisma-schema-generator` package:

### Print

```typescript
function print(options: { schema: Schema }): Promise<string>;
```

Prints Prisma schema file from AST. The schema is formatted using prisma-format.

### Builders

#### Create a schema AST object.

```typescript
function createSchema(options: {
  models: Model[];
  enums: Enum[];
  dataSource?: DataSource;
  generators?: Generator[];
  views?: View[];
}): Schema;
```

#### Create an enum AST object and validates the given name argument.

```typescript
function createEnum(options: {
  name: string;
  values: string[];
  documentation?: string;
}): Enum;
```

#### Create a model AST object and validates the given name argument.

```typescript
function createModel(options: {
  name: string;
  fields: Array<ScalarField | ObjectField>;
  documentation?: string;
  map?: string;
  indexes?: Array<Index>;
  fullTextIndexes?: Array<FullTextIndex>;
}): Model;
```

#### Create a scalar field AST object and validates the given name argument.

```typescript
function createScalarField(options: {
  name: string;
  type: ScalarType;
  isList?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  isId?: boolean;
  isUpdatedAt?: boolean;
  defaultValue?: ScalarFieldDefault;
  documentation?: string;
  isForeignKey?: boolean;
}): ScalarField;
```

#### Create an object field AST object and validates the given name argument.

```typescript
function createObjectField(options: {
  name: string;
  type: string;
  isList?: boolean;
  isRequired?: boolean;
  relationName?: string | null;
  relationFields?: string[];
  relationReferences?: string[];
  relationOnDelete?: ReferentialActions;
  relationOnUpdate?: ReferentialActions;
  documentation?: string;
}): ObjectField;
```

#### Create a data source AST object.

```typescript
function createDataSource(options: {
  name: string;
  provider: DataSourceProvider;
  url: string | DataSourceURLEnv;
  relationMode?: DataSource["relationMode"];
}): DataSource;
```

#### Create a generator AST object

```typescript
function createGenerator(options: {
  name: string;
  provider: string;
  output?: string | null;
  binaryTargets?: string[];
  previewFeatures?: Array<PreviewFeature>;
}): Generator;
```
