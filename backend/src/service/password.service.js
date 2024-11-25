const Accounts = require("../model/accounts");
const PendingEmail = require("../model/pending-email");
const config = require("../config/auth.config");
const encryptionService = require("./encryption.service");
const emailService = require("./email.service");
const TOKEN_EXPIRATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days 

const Knex = require("knex");
const knexfile = require("../config/knexFile");
const knex = Knex(knexfile.development);

exports.processForgotPasswordRequest = async (email) => {
  const nomalizedEmail = email.toLowerCase();

  const user = await Accounts.getUserByEmail(nomalizedEmail);
  console.log(user);
  if(!user || !user.id) {
    return false;
  }

  const resetPasswordLink = await this.generatePasswordResetLink(user);
  const { firstName, lastName } = user;
  const fullName = `${firstName} ${lastName}`;

  await emailService.sendResetPasswordEmail(nomalizedEmail, resetPasswordLink, fullName);

  return true;
}

exports.generatePasswordResetLink = async (user) => {

  const token = await encryptionService.generateSecureRandomToken();
  const hash = await this.generateHashForUser(user);

  let currentDateMs = new Date().getTime();
  let tokenExpiration = new Date(currentDateMs + TOKEN_EXPIRATION_MS);

  try {
    const existing_request = await PendingEmail.checkExistingResetAccount(user.email);
    if(existing_request > 0) {
      const existingPending = await PendingEmail.getAccountViaEmail(user.email);
      await PendingEmail.updatePedingDetailsByEmail(user.email,
        {
          token_expiration: tokenExpiration,
          account_id: user.id
        });
      const resetPasswordLink = `${config.CLIENT_URL}/reset-password/${hash}/${existingPending.token}`;
      return resetPasswordLink;
    } else {
      await PendingEmail.query().insert({
        email: user.email,
        token: token,
        token_expiration: tokenExpiration,
        account_id: user.id,
        status: 'pending'
      });
      const resetPasswordLink = `${config.CLIENT_URL}/reset-password/${hash}/${token}`;
      return resetPasswordLink;
    }
  } catch (err) {
      console.error(err)
      return null;
  }
}

exports.generateHashForUser = async (loginUser) => {
  return encryptionService.hashValue(loginUser.email + loginUser.id, "base64");
};

exports.getUserFromResetTokenAndHash = async (token) => {
  return await PendingEmail.getPendingDetailsByToken(token);
};

exports.processResetPasswordRequest = async (inputs) => {
  const { token, newPassword } = inputs;
  try {
    let loginuser = await this.getUserFromResetTokenAndHash(token);
    // No user matching the token, return early
    if (!loginuser) {
        return false;
    }
    const { account_id } = loginuser;
    // Update the user's password.
    const retVal = await Accounts.updateUser({password: newPassword}, account_id);
    await PendingEmail.updateStatusViaToken({token: token, status: 'finished'});
    if(retVal) {
      return retVal;
    }
  } catch(error) {
    return false
  }
};


/**
 * Processes a password change request when a user provides their old password and a new password.
 * 
 * @param {Object} inputs - Contains oldPassword, newPassword, and userEmail.
 * @returns {Object} - Returns a success flag and a message.
 */
exports.processPasswordChange = async ({ oldPassword, newPassword, userEmail }) => {
  try {
    // Step 1: Fetch the user based on their email
    const user = await Accounts.getUserByEmail(userEmail);

    // Check if user exists
    if (!user || !user.id) {
      return { success: false, message: "User not found." };
    }

    // Step 2: Verify that the old password matches the user's current password
    const isOldPasswordValid = await encryptionService.comparePasswords(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return { success: false, message: "Old password is incorrect." };
    }

    // Step 3: Hash the new password
    const hashedNewPassword = await encryptionService.hashPassword(newPassword);

    // Step 4: Update the password in the database
    const updateResult = await Accounts.updateUser({ password: hashedNewPassword }, user.id);

    // Check if the update was successful
    if (updateResult) {
      return { success: true, message: "Password changed successfully." };
    } else {
      return { success: false, message: "Failed to update password." };
    }
  } catch (error) {
    console.error("Error in processPasswordChange:", error);
    return { success: false, message: "Internal server error occurred." };
  }
};
