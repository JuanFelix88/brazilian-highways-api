import { Knex } from 'knex'
import { PostgresKnexConstructError } from './errors/postgres-knex-construct-error'

/**
 * @throws {PostgresKnexConstructError}
 */
export class PostgresKnexService {
  public readonly knex: Knex.Client
  constructor() {
    if (
      [
        process.env.POSTGRES_DB,
        process.env.POSTGRES_USER,
        process.env.POSTGRES_PASSWORD
      ].some(env => !env)
    ) {
      throw new PostgresKnexConstructError(
        'Could not load environment variables'
      )
    }

    this.knex = new Knex.Client({
      client: 'postgresql',
      connection: {
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    })
  }
}
