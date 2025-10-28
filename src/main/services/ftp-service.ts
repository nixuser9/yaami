import { Client } from 'basic-ftp';
import * as fs from 'fs';

export interface FTPConfig {
  host: string;
  port?: number;
  user: string;
  password: string;
  secure?: boolean;
}

export interface FTPFile {
  name: string;
  path: string;
  size: number;
  modifiedAt: Date;
  isDirectory: boolean;
}

export class FTPService {
  private client: Client;

  constructor(private config: FTPConfig) {
    this.client = new Client();
    this.client.ftp.verbose = false;
  }

  async connect(): Promise<void> {
    try {
      await this.client.access({
        host: this.config.host,
        port: this.config.port || 21,
        user: this.config.user,
        password: this.config.password,
        secure: this.config.secure || false,
      });
    } catch (error) {
      throw new Error(`Failed to connect to FTP: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    this.client.close();
  }

  async listFiles(path: string = '/'): Promise<FTPFile[]> {
    try {
      const files = await this.client.list(path);
      return files.map((file: any) => ({
        name: file.name,
        path: `${path}/${file.name}`.replace('//', '/'),
        size: file.size,
        modifiedAt: file.modifiedAt || new Date(),
        isDirectory: file.isDirectory,
      }));
    } catch (error) {
      throw new Error(`Failed to list files: ${error}`);
    }
  }

  async downloadFile(remotePath: string, localPath: string): Promise<boolean> {
    try {
      const writeStream = fs.createWriteStream(localPath);
      await this.client.downloadTo(writeStream, remotePath);
      return true;
    } catch (error) {
      throw new Error(`Failed to download file: ${error}`);
    }
  }

  async uploadFile(localPath: string, remotePath: string): Promise<boolean> {
    try {
      const readStream = fs.createReadStream(localPath);
      await this.client.uploadFrom(readStream, remotePath);
      return true;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  async deleteFile(remotePath: string): Promise<boolean> {
    try {
      await this.client.remove(remotePath);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  async createDirectory(remotePath: string): Promise<boolean> {
    try {
      await this.client.ensureDir(remotePath);
      return true;
    } catch (error) {
      throw new Error(`Failed to create directory: ${error}`);
    }
  }
}
