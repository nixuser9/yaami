declare module '@marsaud/smb2' {
  export interface SMB2Options {
    share: string;
    domain?: string;
    username: string;
    password: string;
    port?: number;
    autoCloseTimeout?: number;
  }

  export interface SMB2File {
    name: string;
    type: 'file' | 'directory';
    size?: number;
    mtime?: Date;
  }

  export default class SMB2 {
    constructor(options: SMB2Options);
    
    readdir(path: string, callback: (err: Error | null, files: SMB2File[]) => void): void;
    readFile(path: string, callback: (err: Error | null, data: Buffer) => void): void;
    writeFile(path: string, data: Buffer, callback: (err: Error | null) => void): void;
    unlink(path: string, callback: (err: Error | null) => void): void;
    mkdir(path: string, callback: (err: Error | null) => void): void;
    disconnect(): Promise<void>;
  }
}
