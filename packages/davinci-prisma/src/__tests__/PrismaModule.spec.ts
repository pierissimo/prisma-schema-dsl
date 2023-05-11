import { DataSourceProvider } from '@pmaltese/prisma-schema-generator'
import { createApp } from '@davinci/core'
import fs from 'fs/promises'
import { PrismaModule } from '../PrismaModule'
import { prisma } from '../index'

describe('PrismaModule', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should correctly register and perform the prisma schema generation for a model', async () => {
    @prisma.model()
    class Customer {
      @prisma.field({ isId: true, required: true })
      id: string

      @prisma.field({ required: true })
      name: string

      @prisma.field({ defaultValue: true })
      isAdult?: boolean
    }

    const prismaModule = new PrismaModule({
      datasource: {
        name: 'postgres',
        url: 'postgresql://',
        provider: DataSourceProvider.PostgreSQL,
      },
      models: [Customer],
      generators: [
        {
          name: 'client',
          provider: 'prisma-client-js',
          previewFeatures: ['fullTextSearch', 'fullTextIndex', 'clientExtensions'],
        },
      ],
      schemaGeneration: {
        enabled: true,
        path: '/path/to/prisma.schema',
      },
      clientGeneration: {
        enabled: true,
      },
    })

    const writeFileMock = jest.spyOn(fs, 'writeFile').mockImplementation()
    const execPrismaGenerateMock = jest
      .spyOn(prismaModule, 'execPrismaGenerate')
      .mockImplementation()

    const app = createApp()
    await app.registerModule(prismaModule)

    expect(writeFileMock).toHaveBeenCalled()
    const mockCallArguments = writeFileMock.mock.calls[0]
    expect(mockCallArguments[0]).toContain('/path/to/prisma.schema')
    expect(mockCallArguments[1]).toMatchSnapshot()

    expect(execPrismaGenerateMock).toHaveBeenCalled()
  })

  test('should correctly register and perform the prisma schema generation for a view', async () => {
    @prisma.view({
      name: 'CustomerView',
      map: 'customer_view',
      uniqueIndexes: [{ fields: [{ name: 'firstname' }, { name: 'lastname' }] }],
    })
    class Customer {
      @prisma.field({ required: true })
      firstname: string

      @prisma.field({ required: true })
      lastname: string
    }

    const prismaModule = new PrismaModule({
      datasource: {
        name: 'postgres',
        url: 'postgresql://',
        provider: DataSourceProvider.PostgreSQL,
      },
      models: [Customer],
      generators: [
        {
          name: 'client',
          provider: 'prisma-client-js',
          previewFeatures: ['fullTextSearch', 'fullTextIndex', 'clientExtensions'],
        },
      ],
      schemaGeneration: {
        enabled: true,
        path: '/path/to/prisma.schema',
      },
      clientGeneration: {
        enabled: true,
      },
    })

    const writeFileMock = jest.spyOn(fs, 'writeFile').mockImplementation()
    const execPrismaGenerateMock = jest
      .spyOn(prismaModule, 'execPrismaGenerate')
      .mockImplementation()

    const app = createApp()
    await app.registerModule(prismaModule)

    expect(writeFileMock).toHaveBeenCalled()
    const mockCallArguments = writeFileMock.mock.calls[0]
    expect(mockCallArguments[0]).toContain('/path/to/prisma.schema')
    expect(mockCallArguments[1]).toMatchSnapshot()

    expect(execPrismaGenerateMock).toHaveBeenCalled()
  })
})
