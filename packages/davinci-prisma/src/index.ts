import * as decorators from './decorators'

export const prisma = {
  ...decorators,
}

export * from './PrismaGenerator'
export * from './PrismaModule'
export * from './helpers'
export * from './types'
