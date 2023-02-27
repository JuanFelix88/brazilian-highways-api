import { Highway } from '@/src/application/entities/highway'
import fs from 'fs/promises'
import path, { resolve } from 'path'

const dataPath = path.resolve(process.cwd(), 'src', 'data')

export class DataMappingService {
  public async getCacheDataByFile(filename: string) {
    const storePath = path.resolve(dataPath, filename)

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

      const filepath = resolve(dataPath, filename)

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
