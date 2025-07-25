const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const uuid = require("uuid");

const AWS_ACCESS_KEY_ID = process.env.AWS_S3_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY;
const AWS_S3_REGION = process.env.AWS_S3_REGION;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_S3_REGION,
});

const sendImage = async (req) => {
  const imageName = `${uuid.v1()}.${req.file.mimetype.split("/")[1]}`;

  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
  } catch (err) {
    throw err;
  }

  req.file.s3key = imageName;
};

const deleteImage = async (key) => {
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);

  try {
    await s3.send(command);
  } catch (err) {
    throw err;
  }
};

module.exports = { sendImage, deleteImage };
