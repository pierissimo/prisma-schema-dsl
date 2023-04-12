import { DataSourceProvider } from '@pmaltese/prisma-schema-generator'
import { createApp } from '@davinci/core'
import fs from 'fs/promises'
import { PrismaModule } from '../PrismaModule'
import { prisma } from '../index'

describe('PrismaModule', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should a', async () => {
    @prisma.model()
    class Customer {
      @prisma.field({ isId: true, required: true })
      id: string

      @prisma.field({ required: true })
      name: string
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
