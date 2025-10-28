import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Dialog API
  dialog: {
    showSaveDialog: (options: any) => ipcRenderer.invoke('dialog:showSaveDialog', options),
    showOpenDialog: (options: any) => ipcRenderer.invoke('dialog:showOpenDialog', options),
  },
  // Config & Settings API
  config: {
    getSettings: () => ipcRenderer.invoke('config:getSettings'),
    saveSettings: (settings: any) => ipcRenderer.invoke('config:saveSettings', settings),
    getConnections: () => ipcRenderer.invoke('config:getConnections'),
    saveConnection: (connection: any) => ipcRenderer.invoke('config:saveConnection', connection),
    deleteConnection: (id: string) => ipcRenderer.invoke('config:deleteConnection', id),
    getMetadata: () => ipcRenderer.invoke('config:getMetadata'),
    exportData: () => ipcRenderer.invoke('config:exportData'),
    importData: (data: any) => ipcRenderer.invoke('config:importData', data),
    getConfigPath: () => ipcRenderer.invoke('config:getConfigPath'),
  },
  // S3 API
  s3: {
    connect: (config: any) => ipcRenderer.invoke('s3:connect', config),
    listBuckets: (config: any) => ipcRenderer.invoke('s3:listBuckets', config),
    listObjects: (config: any, bucket: string, prefix: string) =>
      ipcRenderer.invoke('s3:listObjects', config, bucket, prefix),
    downloadFile: (config: any, bucket: string, key: string, localPath: string) =>
      ipcRenderer.invoke('s3:downloadFile', config, bucket, key, localPath),
    uploadFile: (config: any, bucket: string, key: string, localPath: string) =>
      ipcRenderer.invoke('s3:uploadFile', config, bucket, key, localPath),
    deleteFile: (config: any, bucket: string, key: string) =>
      ipcRenderer.invoke('s3:deleteFile', config, bucket, key),
  },
  // FTP API
  ftp: {
    connect: (config: any) => ipcRenderer.invoke('ftp:connect', config),
    listFiles: (config: any, path: string) => ipcRenderer.invoke('ftp:listFiles', config, path),
    downloadFile: (config: any, remotePath: string, localPath: string) =>
      ipcRenderer.invoke('ftp:downloadFile', config, remotePath, localPath),
    uploadFile: (config: any, localPath: string, remotePath: string) =>
      ipcRenderer.invoke('ftp:uploadFile', config, localPath, remotePath),
  },
  // SFTP API
  sftp: {
    connect: (config: any) => ipcRenderer.invoke('sftp:connect', config),
    listFiles: (config: any, path: string) => ipcRenderer.invoke('sftp:listFiles', config, path),
    downloadFile: (config: any, remotePath: string, localPath: string) =>
      ipcRenderer.invoke('sftp:downloadFile', config, remotePath, localPath),
    uploadFile: (config: any, localPath: string, remotePath: string) =>
      ipcRenderer.invoke('sftp:uploadFile', config, localPath, remotePath),
  },
  // SMB API
  smb: {
    connect: (config: any) => ipcRenderer.invoke('smb:connect', config),
    listFiles: (config: any, path: string) => ipcRenderer.invoke('smb:listFiles', config, path),
    downloadFile: (config: any, remotePath: string, localPath: string) =>
      ipcRenderer.invoke('smb:downloadFile', config, remotePath, localPath),
    uploadFile: (config: any, localPath: string, remotePath: string) =>
      ipcRenderer.invoke('smb:uploadFile', config, localPath, remotePath),
  },
});
