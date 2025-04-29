import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

// Get AWS credentials from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;

// Create S3 client instance
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Upload file to S3
export async function uploadToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> {
  // Generate unique key for S3 object
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const key = `uploads/${uniqueSuffix}-${fileName}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    // ACL 設定已移除，因為此儲存桶不支援 ACLs
  };

  // Upload file to S3
  await s3Client.send(new PutObjectCommand(params));

  // Return URL of uploaded file
  return `https://${bucketName}.s3-${region}.amazonaws.com/${key}`;
}

// Generate presigned URL for direct frontend uploads
export async function generatePresignedUrl(
  fileName: string,
  contentType: string,
): Promise<string> {
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const key = `uploads/${uniqueSuffix}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    // ACL 設定已移除，因為此儲存桶不支援 ACLs
  });

  // Generate presigned URL that expires in 5 minutes
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });
  return presignedUrl;
}
