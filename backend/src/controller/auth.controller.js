//auth.controler.js
const Accounts = require("../model/accounts");
const jwt = require("jsonwebtoken");
const auth = require("../config/auth.config");
const emailService = require("../service/email.service");
const authService = require("../service/auth.service");
const passwordService = require("../service/password.service");
const encryptionService = require("../service/encryption.service");
const s3Service = require("../service/s3.service");

const axios = require('axios');
const { S3Client } = require('@aws-sdk/client-s3');

// Utility function for logging and handling errors
const handleError = (res, error, message = "Internal Server Error") => {
  console.error(error);  // Log the detailed error for debugging purposes
  return res.status(500).send({ message });
};

async function registerUser(req, res) {
  
  console.log("Register User Request");
  const { cpassword, ...body } = req.body;

  try {
    const { isExist } = await Accounts.emailExists(body.email);

    if (isExist) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const verify_link = await authService.processEmailVerification(body);
    const normalizedEmail = body.email;
    const fullName = `${body.firstname} ${body.lastname}`;
    await emailService.sendEmailVerification(normalizedEmail, verify_link, fullName);

    return res.status(201).send({ message: "Registration successful, please check your email to verify your account." });
  } catch (error) {
    return handleError(res, error, "Failed to register user");
  }
}

async function updateUser(req, res) {
  
  console.log("Update User Request");
  const body = req.body;
  const { id } = req.user;
  const captchaToken = req.body.captchaToken;

  if (!captchaToken) {
    return res.status(400).send({ message: 'ReCaptcha token is missing' });
  }

  try {
    const captchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: auth.recaptcha.siteKey,
        response: captchaToken
      }
    });

    if (!captchaResponse.data.success) {
      console.error('ReCAPTCHA verification failed for token:', captchaToken);
      return res.status(400).send({ message: 'ReCaptcha verification failed' });
    }

    if (!body) {
      return res.status(400).send({ message: "Bad Request" });
    }

    await Accounts.updateUser(body, id);
    return res.status(200).send({ message: "Update successful" });
  } catch (error) {
    return handleError(res, error, "Failed to update user");
  }
}

// Verify reCAPTCHA
async function verifyRecaptcha(token) { 
  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error('Recaptcha verification error:', error.response ? error.response.data : error.message);
    return false;  // Return false in case of error
  }
};

// Login endpoint with reCAPTCHA verification
async function login(req, res) {
  
  console.log("Login Request");
  const { email, password, token } = req.body; // Destructure email, password, and reCAPTCHA token

  if (!token) {
    return res.status(400).json({ message: 'Missing reCAPTCHA token' });
  }

  try {
    // Verify reCAPTCHA token first
    const recaptchaVerified = await verifyRecaptcha(token);
    if (!recaptchaVerified) {
      return res.status(401).json({ message: 'Invalid reCAPTCHA token' });
    }

    // Check user existence and credentials
    const { isExist, data } = await Accounts.checkLoggedIn(email, password);

    // If user exists, proceed with login logic
    if (isExist) {
      if (data) {
        req.user = data; // Store user data in request object

        // Generate JWT token
        const authToken = jwt.sign({
          id: data.id,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
        }, auth.JWT_SECRET, { expiresIn: '12H' });

        return res.status(200).json({
          message: 'Logged in successfully',
          token: authToken,
        });
      } else {
        return res.status(200).json({
          message: 'Account not verified',
        });
      }
    } else {
      return res.status(400).json({
        message: 'Invalid username or password',
      });
    }
  } catch (error) {
    return handleError(res, error, "Failed to login");
  }
}

async function getUser (req, res) {
  const { id } = req.user;
  try {

    const {
      password,
      verify_token,
      isVerified,
      profile_url,
      ...data} = await Accounts.getUserById(id);
    let return_data = {}
    if(profile_url){
      const profileUrl = await s3Service.getPresignedS3Url(profile_url)
      return_data = {
        ...data,
        profile_url: profileUrl,
      }
    } else {
      return_data = {
        ...data,
        profile_url
      }
    }
    return res.status(200).send(return_data);
  } catch (error) {
    return handleError(res, error, "Failed to retrieve user data");
  }
}

async function forgotPassword (req, res) {
    
  console.log("Forgot Password Request");
  const { email } = req.body;
    
  try {
    if(!email) {
      return res.status(401).send({message: "Invalid Request"});
    }

    const reset = await passwordService.processForgotPasswordRequest(email);
    if(reset) {
      return res.status(200).send({message: "Request Sent"});
    } else {
      return res.status(200).send({message: "Invalid Email"});
    }
  } catch (error) {
    return handleError(res, error, "Failed to process forgot password request");
  }
}

/*
async function changePassword(req, res) {

  console.log("Change Password Request");
  const { oldPassword, newPassword, recaptchaToken } = req.body;
  const { userEmail } = req.user;  // Extract userId from req.user

  if (!recaptchaToken) {
    return res.status(400).send({ message: "reCAPTCHA token is required" });
  }

  try {
    
    const recaptchaVerified = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaVerified) {
      return res.status(400).send({ message: "reCAPTCHA verification failed" });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).send({ message: "Both old and new passwords are required" });
    }

    // Pass userId to the passwordService instead of 'id'
    const result = await passwordService.processPasswordChange({
      oldPassword,
      newPassword,
      userEmail
    });

    if (result.success) {
      return res.status(200).send({ message: result.message });
    } else {
      return res.status(400).send({ message: result.message });
    }
  } catch (error) {
    return handleError(res, error, "Failed to change password");
  }
}
*/
async function changePassword(req, res) {
  console.log("Change Password Request");

  const { oldPassword, newPassword, recaptchaToken } = req.body;
  const { userEmail } = req.user;

  console.log('Request body:', req.body);

  if (!recaptchaToken) {
    return res.status(400).send({ message: "reCAPTCHA token is required" });
  }

  try {
    const recaptchaVerified = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaVerified) {
      return res.status(400).send({ message: "reCAPTCHA verification failed" });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).send({ message: "Both old and new passwords are required" });
    }

    const user = await Accounts.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isOldPasswordValid = await encryptionService.comparePasswords(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).send({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedNewPassword = await encryptionService.hashPassword(newPassword);
    
    // Pass the user email to the changePassword method
    const updateResult = await Accounts.changePassword(userEmail, hashedNewPassword);

    if (updateResult) {
      return res.status(200).send({ message: "Password changed successfully." });
    } else {
      return res.status(500).send({ message: "Failed to update password." });
    }
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).send({ message: "Failed to change password due to server error" });
  }
}

async function verifyEmail (req, res) {

  try {
    const { token } = req.body;

    const checkTokenExist = await Accounts.accountExists({verify_token: token, isVerified: 0});
    if(checkTokenExist) {
      const user = await Accounts.updateSingleUserCustom({isVerified: 1}, {verify_token: token});
      req.user = user;

      const jwttoken = jwt.sign({
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email
        },
        auth.JWT_SECRET,{ expiresIn: '12H' });

      return res.status(200).send({ message: "Account Verified", token: jwttoken });
    } else {
      return res.status(400).send({ message: "Invalid or expired token" });
    }
  } catch (error) {
    return handleError(res, error, "Failed to verify email");
  }
}

async function uploadProfile(req, res) {
  const { id } = req.params;
  const file = req.file;

  try {
    const s3_path = `profile/${id}/`;
    const s3key = await s3Service.uploadAndGetS3Key(file, s3_path);
    await Accounts.query().patch({ profile_url: s3key }).findById(id);
    return res.status(200).send({ message: "Upload successful" });
  } catch (error) {
    return handleError(res, error, "Failed to upload profile picture");
  }
}

async function deleteUser(req, res) {
  const { email } = req.user;  // Get the email from the authenticated request

  try {
    // Attempt to find and delete the user by their email
    const deletedUser = await Accounts.query().findOne({ email }).del();  

    // If no user was found, return a 404 Not Found response
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return a success response when the user is deleted
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    // Log and handle the error properly
    console.error("Error deleting user:", error);  // Log the error for debugging
    return res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

async function sendEmail (req, res) {
  try {
    await emailService.sendEmail('tsuyoshic2@gmail.com', 'yoshi');
    return res.status(200).send({
      message: "Success"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error"
    })
  }
}

// Test function
const testFunction = (req, res) => {
  console.log('Test function called');
  res.send('Test function works');
};


module.exports = {
    testFunction,
  registerUser,
  verifyRecaptcha,
  login,
  getUser,
  updateUser,
  sendEmail,
  forgotPassword,
  changePassword,  // Ensure this is exported
  verifyEmail,
  uploadProfile,
  deleteUser
};