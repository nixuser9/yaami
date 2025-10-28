export {}

declare global {
  interface Window {
    electronAPI: {
      dialog: {
        showSaveDialog: (options: any) => Promise<{ canceled: boolean; filePath?: string }>;
        showOpenDialog: (options: any) => Promise<{ canceled: boolean; filePaths?: string[] }>;
      };
      config: {
        getSettings: () => Promise<any>;
        saveSettings: (settings: any) => Promise<{ success: boolean }>;
        getConnections: () => Promise<any[]>;
        saveConnection: (connection: any) => Promise<{ success: boolean }>;
        deleteConnection: (id: string) => Promise<{ success: boolean }>;
        getMetadata: () => Promise<any>;
        exportData: () => Promise<any>;
        importData: (data: any) => Promise<{ success: boolean }>;
        getConfigPath: () => Promise<string>;
      };
      s3: {
        connect: (config: any) => Promise<{ success: boolean; error?: string }>;
        listBuckets: (config: any) => Promise<string[]>;
        listObjects: (config: any, bucket: string, prefix: string) => Promise<any[]>;
        downloadFile: (config: any, bucket: string, key: string, localPath: string) => Promise<boolean>;
        uploadFile: (config: any, bucket: string, key: string, localPath: string) => Promise<boolean>;
        deleteFile: (config: any, bucket: string, key: string) => Promise<boolean>;
      };
      ftp: {
        connect: (config: any) => Promise<{ success: boolean; error?: string }>;
        listFiles: (config: any, path: string) => Promise<any[]>;
        downloadFile: (config: any, remotePath: string, localPath: string) => Promise<boolean>;
        uploadFile: (config: any, localPath: string, remotePath: string) => Promise<boolean>;
      };
      sftp: {
        connect: (config: any) => Promise<{ success: boolean; error?: string }>;
        listFiles: (config: any, path: string) => Promise<any[]>;
        downloadFile: (config: any, remotePath: string, localPath: string) => Promise<boolean>;
        uploadFile: (config: any, localPath: string, remotePath: string) => Promise<boolean>;
      };
      smb: {
        connect: (config: any) => Promise<{ success: boolean; error?: string }>;
        listFiles: (config: any, path: string) => Promise<any[]>;
        downloadFile: (config: any, remotePath: string, localPath: string) => Promise<boolean>;
        uploadFile: (config: any, localPath: string, remotePath: string) => Promise<boolean>;
      };
    };
  }
}
