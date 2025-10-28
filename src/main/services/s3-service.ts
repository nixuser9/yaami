import { S3Client, ListBucketsCommand, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint?: string;
}

export interface S3Object {
  key: string;
  size: number;
  lastModified: Date;
  isDirectory: boolean;
}

export class S3Service {
  private client: S3Client;

  constructor(private config: S3Config) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
      ...(config.endpoint && { endpoint: config.endpoint }),
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.send(new ListBucketsCommand({}));
      return true;
    } catch (error) {
      throw new Error(`Failed to connect to S3: ${error}`);
    }
  }

  async listBuckets(): Promise<string[]> {
    const command = new ListBucketsCommand({});
    const response = await this.client.send(command);
    return response.Buckets?.map((bucket: any) => bucket.Name || '') || [];
  }

  async listObjects(bucket: string, prefix: string = ''): Promise<S3Object[]> {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      Delimiter: '/',
    });

    const response = await this.client.send(command);
    const objects: S3Object[] = [];

    // Add directories
    if (response.CommonPrefixes) {
      for (const prefix of response.CommonPrefixes) {
        if (prefix.Prefix) {
          objects.push({
            key: prefix.Prefix,
            size: 0,
            lastModified: new Date(),
            isDirectory: true,
          });
        }
      }
    }

    // Add files
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key && obj.Key !== prefix) {
          objects.push({
            key: obj.Key,
            size: obj.Size || 0,
            lastModified: obj.LastModified || new Date(),
            isDirectory: false,
          });
        }
      }
    }

    return objects;
  }

  async downloadFile(bucket: string, key: string, localPath: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const response = await this.client.send(command);
      
      if (response.Body instanceof Readable) {
        const writeStream = fs.createWriteStream(localPath);
        await pipeline(response.Body as Readable, writeStream);
        return true;
      }
      
      throw new Error('Invalid response body');
    } catch (error) {
      throw new Error(`Failed to download file: ${error}`);
    }
  }

  async uploadFile(bucket: string, key: string, localPath: string): Promise<boolean> {
    try {
      const fileStream = fs.createReadStream(localPath);
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileStream,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  async deleteFile(bucket: string, key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }
}
