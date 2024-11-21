/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('accounts' , (table) => {
    table.string('verify_token');
    table.integer('isVerified');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('accounts', (table) => {
    table.dropColumns(['verify_token', 'isVerfied']);
  });
};
