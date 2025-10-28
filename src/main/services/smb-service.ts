import SMB2 from '@marsaud/smb2';
import * as fs from 'fs';
import * as path from 'path';

export interface SMBConfig {
  host: string;
  share: string;
  username: string;
  password: string;
  domain?: string;
  port?: number;
}

export interface SMBFile {
  name: string;
  path: string;
  size: number;
  modifiedAt: Date;
  isDirectory: boolean;
}

export class SMBService {
  private client: SMB2;

  constructor(private config: SMBConfig) {
    // Strip smb:// prefix if present
    const cleanHost = config.host.replace(/^smb:\/\//i, '');
    
    this.client = new SMB2({
      share: `\\\\${cleanHost}\\${config.share}`,
      domain: config.domain || 'WORKGROUP',
      username: config.username,
      password: config.password,
      port: config.port || 445,
      autoCloseTimeout: 0,
    });
  }

  async connect(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test connection by listing root directory
      await this.listFiles('/');
      return { success: true };
    } catch (error: any) {
      console.error('SMB connection failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to connect to SMB share' 
      };
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting from SMB:', error);
    }
  }

  async listFiles(dirPath: string = '/'): Promise<SMBFile[]> {
    return new Promise((resolve, reject) => {
      this.client.readdir(dirPath, (err: any, files: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const fileList: SMBFile[] = files.map((file: any) => ({
          name: file.name,
          path: path.posix.join(dirPath, file.name),
          size: file.size || 0,
          modifiedAt: file.mtime || new Date(),
          isDirectory: file.type === 'directory',
        }));

        resolve(fileList);
      });
    });
  }

  async downloadFile(remotePath: string, localPath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(localPath);
      
      this.client.readFile(remotePath, (err: any, data: Buffer) => {
        if (err) {
          reject(err);
          return;
        }

        writeStream.write(data);
        writeStream.end();
        writeStream.on('finish', () => resolve(true));
        writeStream.on('error', (error) => reject(error));
      });
    });
  }

  async uploadFile(localPath: string, remotePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(localPath);
      const chunks: Buffer[] = [];

      readStream.on('data', (chunk: string | Buffer) => {
        const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
        chunks.push(buffer);
      });
      readStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        this.client.writeFile(remotePath, buffer, (err: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        });
      });
      readStream.on('error', (error) => reject(error));
    });
  }

  async deleteFile(remotePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.unlink(remotePath, (err: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }

  async createDirectory(dirPath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.mkdir(dirPath, (err: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }
}
