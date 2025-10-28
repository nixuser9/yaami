import SftpClient from 'ssh2-sftp-client';
import * as fs from 'fs';

export interface SFTPConfig {
  host: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
}

export interface SFTPFile {
  name: string;
  path: string;
  size: number;
  modifiedAt: number;
  isDirectory: boolean;
}

export class SFTPService {
  private client: SftpClient;

  constructor(private config: SFTPConfig) {
    this.client = new SftpClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect({
        host: this.config.host,
        port: this.config.port || 22,
        username: this.config.username,
        password: this.config.password,
        privateKey: this.config.privateKey,
      });
    } catch (error) {
      throw new Error(`Failed to connect to SFTP: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.end();
  }

  async listFiles(path: string = '/'): Promise<SFTPFile[]> {
    try {
      const files = await this.client.list(path);
      return files.map((file: any) => ({
        name: file.name,
        path: `${path}/${file.name}`.replace('//', '/'),
        size: file.size,
        modifiedAt: file.modifyTime,
        isDirectory: file.type === 'd',
      }));
    } catch (error) {
      throw new Error(`Failed to list files: ${error}`);
    }
  }

  async downloadFile(remotePath: string, localPath: string): Promise<boolean> {
    try {
      await this.client.fastGet(remotePath, localPath);
      return true;
    } catch (error) {
      throw new Error(`Failed to download file: ${error}`);
    }
  }

  async uploadFile(localPath: string, remotePath: string): Promise<boolean> {
    try {
      await this.client.fastPut(localPath, remotePath);
      return true;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  async deleteFile(remotePath: string): Promise<boolean> {
    try {
      await this.client.delete(remotePath);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  async createDirectory(remotePath: string): Promise<boolean> {
    try {
      await this.client.mkdir(remotePath, true);
      return true;
    } catch (error) {
      throw new Error(`Failed to create directory: ${error}`);
    }
  }
}
