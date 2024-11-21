
// ***ATTENTION FOR UST STUDENTS ONLY***
//
// FOR CYBER SECURITY COMPLIANCE
// HTTPS AND SSL CERTIFICATE IS A MUST
// COMPLY SHA256/512 ENCRYPTION
//   ASSEMBLY LOW PROGRAMMING LANGUAGE FOR BACKEND SERVER
//   SYTANX CODE FOR SECURING SECRET ACCESS KEYS & JWT TOKEN
//   (FOR ENTERPRISE SECURED ENCRIPTION METHOD)
//
// Author: Jason "Soo Ji" Dano(citrixlabph@gmail.com)

module.exports = {
  ses: {
    emailTo: "no-reply@tripmatic.online",
    source: "no-reply@tripmatic.online",
    region: "us-east-1",
    accessKeyId: "YOUR_ACCESS_KEY_ID", // data security compromised
    secretAccessKey: "YOUR_SECRET_ACCESS_KEY_ID", // data security compromised
  },
  s3: {
    bucketName: "tripmatic-bucket",
    region: "us-east-1",
    accessKeyId: "YOUR_ACCESS_KEY_ID", // data security compromised
    secretAccessKey: "YOUR_SECRET_ACCESS_KEY_ID", // data security compromised
  },
  environtment: "development",
  db_name: "tripmatic",
  db_host: "127.0.0.1",
  db_password: "", // no database password setting // data security compromised
  db_user: "root",
  JWT_SECRET: "YOUR_JWT_SECRET_TOKEN", // data security compromised
  CLIENT_URL: "http://localhost:3000"
}
