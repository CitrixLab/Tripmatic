const BaseModel = require('./base-model');
class PendingEmail extends BaseModel {
  static get tableName() {
    return "pending_email";
  }

  $beforeInsert() {
    this.created_at = new Date();
  }

  static async checkExistingResetAccount(email) {
    const formattedEmail = email.toLowerCase();
    return this.query().select()
        .whereRaw('LOWER(email) = ?', `${formattedEmail}`)
        .andWhere('status', 'pending')
        .resultSize();
  }
  
  static async getPendingDetailsByToken(token, status = "pending") {
    return this.query().findOne({
      token: token,
      status: status
    });
  }
  
  static async getAccountViaEmail(email) {
    const formattedEmail = email.toLowerCase();
    return this.query().select().whereRaw('LOWER(email) = ?',`${formattedEmail}`).andWhere('status', 'pending').first();
  }

  static async updatePedingDetailsByEmail(email,data) {
    return this.query().patch(data).findOne({
      email: email,
      status: 'pending'
    })
  }

  static async updateStatusViaToken(data) {
    const {token, status} = data;
    return this.query()
        .where({token: token})
        .patch({status: status});
  }
}

module.exports = PendingEmail;