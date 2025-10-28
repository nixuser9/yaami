declare module 'ssh2-sftp-client' {
  export default class SftpClient {
    connect(options: {
      host: string;
      port?: number;
      username: string;
      password?: string;
      privateKey?: string;
    }): Promise<void>;
    
    end(): Promise<void>;
    
    list(path: string): Promise<any[]>;
    
    fastGet(remotePath: string, localPath: string): Promise<void>;
    
    fastPut(localPath: string, remotePath: string): Promise<void>;
    
    delete(remotePath: string): Promise<void>;
    
    mkdir(remotePath: string, recursive?: boolean): Promise<void>;
  }
}
