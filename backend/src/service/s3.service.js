

const S3 = require("aws-sdk/clients/s3");
const config = require("../config/auth.config");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const _ = require("lodash");

const bucketName = config.s3.bucketName;
const region = config.s3.region;
const accessKeyId = config.s3.accessKeyId;
const secretAccessKey = config.s3.secretAccessKey;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

exports.uploadFile = (file, filePath) => {
  const fileStream = fs.createReadStream(file.path);
  const ex = "." + file.mimetype.split('/')[1];
  const bucketPath = filePath ? filePath + file.filename + ex : file.filename + ex;
   
  //console.log("bucketPath", bucketPath);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: bucketPath,
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
};

exports.uploadAndGetS3Key = async (file, filePath) => {
  try {
    if (_.isEmpty(file)) {
      console.log("No File found to upload");
      return null;
    }
    //console.log("upload to s3...");
    const result = await this.uploadFile(file, filePath);
    //delete temporary file
    console.log("result of s3 upload: ", result)
    await unlinkFile(file.path);
    return result.Key;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.getPresignedS3Url = async (fileKey)=>{
  try {
  const presigned_url = s3.getSignedUrlPromise("getObject", {
     Key: fileKey,
     Bucket: bucketName,
     Expires: 60 * 5, // 5mins
  });
  return presigned_url;
  } catch (error) {
     throw error
  }
};