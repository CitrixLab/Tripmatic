const auth = require("./auth.config");
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const { knexSnakeCaseMappers } = require('objection');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: auth.db_host,
      database: auth.db_name,
      port: 3306,
      user: auth.db_user,
      password: auth.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../migrations',
    }
  },
  seeds: {
    directory: './seeds',
  },
  ...knexSnakeCaseMappers,

};
