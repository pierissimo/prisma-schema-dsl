import { DecoratorId, TypeValue } from '@davinci/reflector'
import { DefaultValueFunctions } from './helpers'
import {
  FullTextIndex,
  Index,
  ReferentialActions,
  ScalarType,
  UniqueIndex,
} from '@pmaltese/prisma-schema-generator'

type DefaultValue =
  | null
  | boolean
  | number
  | string
  | (typeof DefaultValueFunctions)[keyof typeof DefaultValueFunctions]

export interface ScalarDecoratorOptions {
  name?: string
  type?: TypeValue | ScalarType
  isList?: boolean
  required?: boolean
  isUnique?: boolean
  isId?: boolean
  isUpdatedAt?: boolean
  defaultValue?: DefaultValue
  documentation?: string
  isForeignKey?: boolean
}

export interface ObjectDecoratorOptions {
  name?: string
  type?: string
  isList?: boolean
  required?: boolean
  relationName?: string | null
  relationFields?: string[]
  relationReferences?: string[]
  relationOnDelete?: ReferentialActions
  relationOnUpdate?: ReferentialActions
  documentation?: string
}

export type FieldDecoratorOptions = ScalarDecoratorOptions | ObjectDecoratorOptions

export interface FieldDecoratorMeta {
  [DecoratorId]: 'davinci.prisma.field'
  data?: FieldDecoratorOptions
}

export interface ModelDecoratorMeta {
  [DecoratorId]: 'davinci.prisma.model'
  data?: {
    name?: string
    map?: string
    indexes?: Array<Index>
    uniqueIndexes?: Array<UniqueIndex>
    fullTextIndexes?: Array<FullTextIndex>
  }
}

export interface ViewDecoratorMeta {
  [DecoratorId]: 'davinci.prisma.view'
  data?: {
    name?: string
    map?: string
    uniqueIndexes?: Array<UniqueIndex>
  }
}
