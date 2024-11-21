/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const tableName = 'accounts';
exports.up = function(knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.text("bio");
    table.text("location");
    table.text("website");
    table.string("profile_url");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumns("bio", "location", "website", "profile_url", "created_at", "updated_at");
  });
};
