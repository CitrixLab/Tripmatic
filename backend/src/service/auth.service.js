const Accounts = require("../model/accounts");
const PendingEmail = require("../model/pending-email");
const config = require("../config/auth.config");
const encryptionService = require("./encryption.service");
const emailService = require("./email.service");


exports.processEmailVerification = async (user) => {
  const token = await encryptionService.generateSecureRandomToken();
  
  try {
    const inputData = {
      ...user,
      verify_token: token,
      isVerified: 0
    }
    await Accounts.addUser(inputData);
    const link = `${config.CLIENT_URL}/recommendation/${token}`;
    return link;
  } catch (error) {
    return null;
  }
}
