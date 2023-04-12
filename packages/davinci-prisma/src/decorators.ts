import { decorate, DecoratorId, TypeValue } from '@davinci/reflector'
import {
  AUTO_INCREMENT,
  CUID,
  DB_GENERATED,
  FullTextIndex,
  Index,
  NOW,
  ReferentialActions,
  ScalarType,
  UUID,
} from '@pmaltese/prisma-schema-generator'

export const DefaultValueFunctions = {
  AUTO_INCREMENT: { callee: AUTO_INCREMENT },
  NOW: { callee: NOW },
  CUID: { callee: CUID },
  UUID: { callee: UUID },
  DB_GENERATED: { callee: DB_GENERATED },
}

type DefaultValue =
  | null
  | boolean
  | number
  | string
  | typeof DefaultValueFunctions[keyof typeof DefaultValueFunctions]

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

type FieldDecoratorOptions = ScalarDecoratorOptions | ObjectDecoratorOptions

export interface FieldDecoratorMeta {
  [DecoratorId]: 'davinci.prisma.field'
  data?: FieldDecoratorOptions
}

export const field = (data?: FieldDecoratorOptions) =>
  decorate(<FieldDecoratorMeta>{ [DecoratorId]: 'davinci.prisma.field', data }, ['Property'], {
    allowMultiple: false,
    inherit: true,
  })

export interface ModelDecoratorMeta {
  [DecoratorId]: 'davinci.prisma.model'
  data?: {
    name?: string
    map?: string
    indexes?: Array<Index>
    fullTextIndexes?: Array<FullTextIndex>
  }
}

export const model = (data?: {
  name?: string
  map?: string
  indexes?: Array<Index>
  fullTextIndexes?: Array<FullTextIndex>
}) =>
  decorate({ [DecoratorId]: 'davinci.prisma.model', data }, ['Class'], {
    allowMultiple: true,
    inherit: true,
  })

export interface ViewDecoratorMeta {
  [DecoratorId]: 'davinci.prisma.view'
  data?: {
    name?: string
    map?: string
  }
}

export const view = (data?: { name?: string; map?: string }) =>
  decorate({ [DecoratorId]: 'davinci.prisma.view', data }, ['Class'], {
    allowMultiple: true,
    inherit: true,
  })
