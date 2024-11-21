const fs = require("fs");
const fsPromises = fs.promises;
const Handlebars = require("handlebars");
const { sendEmailViaParams } = require("./ses.service");
const config = require('../config/auth.config')
const path = require('path')

exports.sendEmail = async (toEmail, name) => {
    const emailData = {
        toEmail: toEmail,
        name: name,
    };
    const filePath = process.cwd() + "/src/templates/test.html";
    // get HTML email template
    const emailHtmlTemplate = await fsPromises.readFile(filePath);
    console.log(emailData)
    // Inject data into the template
    const templateHtml = Handlebars.compile(emailHtmlTemplate.toString());
    const bodyHtml = templateHtml(emailData);
    // Prepare SES Parameters
    let params = {
        Destination: {
            ToAddresses: [emailData.toEmail],
        },
        Message: {
            Body: {
                Html: {
                    Data: bodyHtml,
                },
            },
            Subject: {
                Data: "Sample Send",
            },
        },
        Source: config.ses.source,
    };
    await sendEmailViaParams(params);
};

exports.sendResetPasswordEmail = async (toEmail, link, name) => {
  const emailData = {
      toEmail: toEmail,
      name: name,
      url: link
  };
  const filePath = process.cwd() + "/src/templates/resetPasswordTemplate.html";
  // get HTML email template
  const emailHtmlTemplate = await fsPromises.readFile(filePath);
  // Inject data into the template
  const templateHtml = Handlebars.compile(emailHtmlTemplate.toString());
  const bodyHtml = templateHtml(emailData);
  // Prepare SES Parameters
  let params = {
      Destination: {
          ToAddresses: [emailData.toEmail],
      },
      Message: {
          Body: {
              Html: {
                  Data: bodyHtml,
              },
          },
          Subject: {
              Data: "RESET YOUR TRIPMATIC PASSWORD",
          },
      },
      Source: config.ses.source,
  };
  await sendEmailViaParams(params);
};


exports.sendEmailVerification = async (toEmail, link, name) => {
  const emailData = {
      toEmail: toEmail,
      name: name,
      url: link
  };
  const filePath = process.cwd() + "/src/templates/emailVerification.html";
  // get HTML email template
  const emailHtmlTemplate = await fsPromises.readFile(filePath);
  // Inject data into the template
  const templateHtml = Handlebars.compile(emailHtmlTemplate.toString());
  const bodyHtml = templateHtml(emailData);
  // Prepare SES Parameters
  let params = {
      Destination: {
          ToAddresses: [emailData.toEmail],
      },
      Message: {
          Body: {
              Html: {
                  Data: bodyHtml,
              },
          },
          Subject: {
              Data: "VERIFY YOUR EMAIL",
          },
      },
      Source: config.ses.source,
  };
  await sendEmailViaParams(params);
};