import { decorate, DecoratorId } from '@davinci/reflector'
import { FullTextIndex, Index, UniqueIndex } from '@pmaltese/prisma-schema-generator'
import { FieldDecoratorMeta, FieldDecoratorOptions } from './types'

export const field = (data?: FieldDecoratorOptions) =>
  decorate(<FieldDecoratorMeta>{ [DecoratorId]: 'davinci.prisma.field', data }, ['Property'], {
    allowMultiple: false,
    inherit: true,
  })

export const model = (data?: {
  name?: string
  map?: string
  indexes?: Array<Index>
  uniqueIndexes?: Array<UniqueIndex>
  fullTextIndexes?: Array<FullTextIndex>
}) =>
  decorate({ [DecoratorId]: 'davinci.prisma.model', data }, ['Class'], {
    allowMultiple: true,
    inherit: true,
  })

export const view = (data?: { name?: string; map?: string }) =>
  decorate({ [DecoratorId]: 'davinci.prisma.view', data }, ['Class'], {
    allowMultiple: true,
    inherit: true,
  })
