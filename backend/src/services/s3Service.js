const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client, bucket } = require('../config/s3');
const crypto = require('crypto');
const path = require('path');

const uploadFile = async (fileBuffer, originalName, folder = 'uploads') => {
  const extension = path.extname(originalName);
  const hash = crypto.randomBytes(16).toString('hex');
  const key = `${folder}/${hash}${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
  });

  await s3Client.send(command);
  return key;
};

const getPresignedUrl = async (key, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
};

module.exports = { uploadFile, getPresignedUrl };
