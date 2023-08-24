/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("highways", table => {
    table.increments("id")
    table.string("name", 255)
    table.string("description")
    table.string("code", 7)
  })

  await knex.schema.createTable("parts_highways", table => {
    table.increments("id")
    table.bigint("highway_id")
      .references("id")
      .inTable("highways")
    table.string("name", 255)
  })

  await knex.schema.createTable("states", table => {
    table.increments("id")
    table.string("name")
  })

  await knex.schema.createTable("cities", table => {
    table.increments("id")
    table.string("name")
    table.bigint("uf_id")
      .references("id")
      .inTable("states")
  })

  await knex.schema.createTable("parts_highways_pointers", table => {
    table.increments("id")
    table.float("km", 2)
    table.float("lat", 6)
    table.float("long", 6)
    table.boolean("majority")
    table.bigint("city_id")
      .references("id")
      .inTable("cities")
    table.bigint("part_highway_id")
      .references("id")
      .inTable("parts_highways")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {  
  await knex.schema.dropTable("highways")
  await knex.schema.dropTable("parts_highways")
  await knex.schema.dropTable("states")
  await knex.schema.dropTable("cities")
  await knex.schema.dropTable("parts_highways_pointers")
};
