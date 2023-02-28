import { Highway } from '@/src/application/entities/highway'
import fs from 'fs/promises'
import path, { resolve } from 'path'

/**
 * This will only be used for developing use due to data
 * be stored in the repository
 * This will be ignored in production time!
 */
const dataPathForEnvProccess = path.resolve(process.cwd(), 'src', 'data')

export enum Filenames {
  Highways = 'highways.json',
  KeyPointers = 'key-pointers.json'
}

export namespace DataMappingService {}

export class DataMappingService {
  public async loadFromName(filename: Filenames): Promise<any> {
    if (filename === Filenames.Highways) {
      const { default: highwaysList } = await import('@/src/data/highways.json')
      return highwaysList
    }

    if (filename === Filenames.KeyPointers) {
      const { default: keyPointersList } = await import(
        '@/src/data/key-pointers.json'
      )
      return keyPointersList
    }
  }

  public async getCacheDataByFile(filename: string) {
    const storePath = path.resolve(dataPathForEnvProccess, filename)

    const raw = await fs.readFile(storePath, 'utf-8')

    const data = JSON.parse(raw)

    return data as Highway[]
  }

  public async saveCacheData(data: any, filename: string) {
    try {
      const dataStr = JSON.stringify(data, null, 2)

      if (!filename.endsWith('.json')) {
        throw new Error(
          'The file is invalid because are missing file extension'
        )
      }

      const filepath = resolve(dataPathForEnvProccess, filename)

      const pathStat = await fs.stat(filepath)

      if (!pathStat.isFile()) {
        throw new Error(
          `It was not possible to find the file ${filename}, check the spelling and try again`
        )
      }

      await fs.writeFile(filepath, dataStr)
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error in ${DataMappingService.name} that abstract the use of cache json #%d`,
          error.message
        )
      }

      throw error
    }
  }
}
