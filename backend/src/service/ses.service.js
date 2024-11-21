const SES = require("aws-sdk/clients/ses");
const config = require("../config/auth.config");
const region = config.ses.region;
const accessKeyId = config.ses.accessKeyId;
const secretAccessKey = config.ses.secretAccessKey;
const ses = new SES({ region, accessKeyId, secretAccessKey });

exports.sendEmailViaSES = (
    emailTo,
    emailFrom,
    name,
    subject,
    message,
    source
) => {
    const params = {
        Destination: {
            ToAddresses: emailTo,
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: "Name: " + name + "\nFrom: " + emailFrom + "\n" + message,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: source.toISOString(),
    };
    return ses.sendEmail(params).promise();
};

exports.sendEmailViaParams = (params) => ses.sendEmail(params).promise();

exports.sendRawEmailViaParams = (params) => {
    ses.sendRawEmail(params, (error, data) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", data.MessageId);
        }
    });
}