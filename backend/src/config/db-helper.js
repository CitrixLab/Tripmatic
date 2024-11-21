const knex = require('knex');
const auth = require('./auth.config');
const knexfile = require('./knexFile');
const {Model} = require('objection');

const environment = auth.environtment || 'development';


function setupDb() {
    const db = knex(knexfile[environment]);
    Model.knex(db);
}

module.exports = setupDb;