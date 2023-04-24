import { decorate, DecoratorId } from '@davinci/reflector'
import {
  FieldDecoratorMeta,
  FieldDecoratorOptions,
  ModelDecoratorMeta,
  ViewDecoratorMeta,
} from './types'

export const field = (data?: FieldDecoratorOptions) =>
  decorate(<FieldDecoratorMeta>{ [DecoratorId]: 'davinci.prisma.field', data }, ['Property'], {
    allowMultiple: false,
    inherit: true,
  })

export const model = (data?: ModelDecoratorMeta['data']) =>
  decorate({ [DecoratorId]: 'davinci.prisma.model', data }, ['Class'], {
    allowMultiple: true,
    inherit: true,
  })

export const view = (data?: ViewDecoratorMeta['data']) =>
  decorate({ [DecoratorId]: 'davinci.prisma.view', data }, ['Class'], {
    allowMultiple: true,
    inherit: true,
  })
