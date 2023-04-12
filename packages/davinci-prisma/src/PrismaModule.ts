import { App, Module } from '@davinci/core'
import { ClassType } from '@davinci/reflector'
import fs from 'fs/promises'
import pathLib from 'path'
import { DataSourceProvider, Enum, Generator, Schema } from '@pmaltese/prisma-schema-generator'
import { exec } from 'child_process'
import { Logger } from 'pino'
import { PrismaGenerator } from './PrismaGenerator'

interface PrismaModuleOptions {
  models?: Array<ClassType>
  schemaGeneration?: {
    enabled: boolean
    path: string
  }
  clientGeneration?: {
    enabled: boolean
  }
  datasource: {
    name: string
    provider: DataSourceProvider
    url?: string
    environmentVariable?: string
  }
  generators?: Array<Generator>
  enums?: Array<Enum>
}

export class PrismaModule extends Module {
  app: App
  logger: Logger
  prismaSchema?: Schema
  prismaString?: string

  constructor(private options: PrismaModuleOptions) {
    super()
  }

  getModuleId() {
    return 'prisma'
  }

  async onRegister(app: App) {
    this.app = app
    this.logger = app.logger.child({ module: this.getModuleId() })

    if (this.options.schemaGeneration?.enabled) {
      await this.generateSchemaFile()
    }

    if (this.options.clientGeneration?.enabled) {
      await this.execPrismaGenerate()
    }
  }

  async generateSchemaFile() {
    const generator = new PrismaGenerator()

    const { schema, prismaString } = await generator
      .setDatasource(this.options.datasource)
      .setGenerators(this.options.generators ?? [])
      .setEnums(this.options.enums ?? [])
      .reflectModels(this.options.models ?? [])
      .generate()

    this.prismaString = prismaString
    this.prismaSchema = schema

    const relativePath = this.options.schemaGeneration?.path as string
    const path = pathLib.join(process.cwd(), relativePath)
    await fs.writeFile(path, prismaString)
    this.logger.info(`prisma definition file generated in: ${path}`)
  }

  execPrismaGenerate() {
    return new Promise((resolve, reject) => {
      exec('npx prisma generate', (error, stdout) => {
        if (error) {
          this.logger.error({ error })
          return reject(error)
        }

        this.logger.info(stdout)
        return resolve(stdout)
      })
    })
  }
}
