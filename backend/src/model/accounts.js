const BaseModel = require('./base-model');
class Accounts extends BaseModel {
  static get tableName() {
    return "accounts";
  }

  $beforeInsert() {
    this.created_at = new Date();
  }
  static async addUser (data) {
    return this.query().insert(data);
  }

  static async getUserByEmail(email) {
    return this.query().findOne({email: email});
  }
  static async emailExists (email) {
    const data = await this.query().where({email: email}).resultSize();
    return data > 0;
  }
  
  static async checkLoggedIn (email, password) {
    const numberRow = await this.query().where({email: email})
      .andWhere({password: password})
      .resultSize();
    const data = await this.query().where({email: email})
      .andWhere({password: password})
      .andWhere({isVerified: 1})
      .first();
    return {
      isExist: numberRow > 0,
      data
    };
  }

  static async getUserById(id){
    return this.query().findById(id);
  }

  static async updateUser(data, id) {
    return this.query().patch(data).findById(id);
  }

  static async updateSingleUserCustom (data, where) {
    await this.query().patch(data).findOne(where);
    return this.query().findOne(where);
  }

  static async accountExists (data) {
    const result = await this.query().where(data).resultSize();
    return result > 0;
  }
}

module.exports = Accounts;