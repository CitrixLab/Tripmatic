const Accounts = require("../model/accounts");
const jwt = require("jsonwebtoken");
const auth = require("../config/auth.config");
const emailService = require("../service/email.service");
const authService = require("../service/auth.service");
const passwordService = require("../service/password.service");
const s3Service = require("../service/s3.service");

async function registerUser (req, res) {
  const{cpassword, ...body} = req.body;

  try {
    const {isExist} = await Accounts.emailExists(body.email);
    
    if(isExist) {
      return res.status(200).send({
        message: "Email Exists"
      });
    }
    const verify_link = await authService.processEmailVerification(body);
    const nomalizedEmail = body.email;
    const fullName = `${body.firstname} ${body.lastname}`;
    await emailService.sendEmailVerification(nomalizedEmail, verify_link, fullName);
    
    res.status(201).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error"
    })
  }
}

async function login (req, res) {
  const { email, password } = req.body;
  try {
    const { isExist, data } = await Accounts.checkLoggedIn(email, password);
    
    if (isExist) {
      if(data) {
        req.user = data;
        const token = jwt.sign({
            id: data.id, first_name: data.firstName, last_name: data.lastName, email: data.email
          },
          auth.JWT_SECRET,
          { expiresIn: '12H' }
        );
        return res.status(200).send({
          message: "Logged in",
          token
        });
      } else {
        return res.status(200).send({
          message: "Account Not Verified",
        });
      }
    } else {
      return res.status(201).send({
        message: "Invalid Username or Password"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error"
    })
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
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error"
    });
  }
}


async function updateUser (req, res) {
  const body = req.body;
  const { id } = req.user;

  try {
    if(!body) return res.status(401).send({ message: "Bad Request"});

    await Accounts.updateUser(body, id);

    return res.status(200).send({
      message: "Update Successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error"
    });
  }
}

async function forgotPassword (req, res) {
  const { email } = req.body;
  try {
    if(!email) {
      return res.status(401).send({
        message: "Invalid Request"
      });
    }
    const reset = await passwordService.processForgotPasswordRequest(email);
    if(reset) {
      return res.status(200).send({
        message: "Request Sent"
      });
    } else {
      return res.status(200).send({
        message: "Invalid Email"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to send out a password request. If the problem continues, please contact the administrator.",
    });
  }
}

async function changePassword (req, res) {

  try {
    const { token, hash, password} = req.body;
    
    if (!token || !hash) {
      return res.status(401).send({
        message: "Reset password token is invalid",
      });
    }
    try {
      // Process the resetPassword request.
      const validToken = await passwordService.processResetPasswordRequest({
        token: token,
        hash: hash,
        newPassword: password,
      });
  
      // No user matching the token, return a 404
      if (!validToken) {
        return res.status(400).send({
          message: "Reset password token is invalid",
          statusCode: -1
        });
      }
  
      return res.status(200).send({
        message: "Your password was reset successfully, please use the new password to login again.",
        statusCode: 1
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        message: "Something went wrong while processing the request!",
        statusCode: -10
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error"
    })
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
          id: user.id, first_name: user.firstName, last_name: user.lastName, email: user.email
        },
        auth.JWT_SECRET,
        { expiresIn: '12H' }
      );
      return res.status(200).send({
        message: "Account Verified",
        token: jwttoken
      })
    } else {
      return res.status(201).send();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error"
    })
  }
}

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

async function uploadProfile (req, res) {
  const { id } = req.params;
  try {
    const file = req.file;
    const s3_path = `profile/${id}/`;
    const s3key = await s3Service.uploadAndGetS3Key(file, s3_path);
    await Accounts.query().patch({profile_url: s3key}).findById(id);
    return res.status(200).send({
      message: "Upload Successfully"
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error"
    })
  }
}
module.exports = {
  registerUser,
  login,
  getUser,
  updateUser,
  sendEmail,
  forgotPassword,
  changePassword,
  verifyEmail,
  uploadProfile
}
