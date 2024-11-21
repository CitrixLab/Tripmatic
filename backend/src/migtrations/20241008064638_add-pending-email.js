/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const tableName = 'pending_email';
exports.up = function(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments().primary();
    table.string("email");
    table.string("token");
    table.date("token_expiration");
    table.string("status");
    table.integer("account_id").references('id').inTable('accounts');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
