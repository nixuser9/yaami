import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { S3Service } from './services/s3-service';
import { FTPService } from './services/ftp-service';
import { SFTPService } from './services/sftp-service';
import { SMBService } from './services/smb-service';
import { ConfigManager } from './config-manager';

let mainWindow: BrowserWindow | null = null;
const configManager = new ConfigManager();

function createWindow() {
  const settings = configManager.getSettings();
  const bounds = settings.windowBounds || { width: 1400, height: 900 };

  mainWindow = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    minWidth: 1000,
    minHeight: 600,
    title: 'Yaami',
    icon: path.join(__dirname, '../public/logo.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1a1a',
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Save window bounds on close
  mainWindow.on('close', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      configManager.saveSettings({ windowBounds: bounds });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  setupIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
function setupIpcHandlers() {
  // Dialog Handlers
  ipcMain.handle('dialog:showSaveDialog', async (_, options) => {
    const result = await dialog.showSaveDialog(mainWindow!, options);
    return result;
  });

  ipcMain.handle('dialog:showOpenDialog', async (_, options) => {
    const result = await dialog.showOpenDialog(mainWindow!, options);
    return result;
  });

  // Config & Settings Handlers
  ipcMain.handle('config:getSettings', async () => {
    return configManager.getSettings();
  });

  ipcMain.handle('config:saveSettings', async (_, settings) => {
    configManager.saveSettings(settings);
    return { success: true };
  });

  ipcMain.handle('config:getConnections', async () => {
    return configManager.getConnections();
  });

  ipcMain.handle('config:saveConnection', async (_, connection) => {
    configManager.saveConnection(connection);
    return { success: true };
  });

  ipcMain.handle('config:deleteConnection', async (_, id) => {
    configManager.deleteConnection(id);
    return { success: true };
  });

  ipcMain.handle('config:getMetadata', async () => {
    return configManager.getMetadata();
  });

  ipcMain.handle('config:exportData', async () => {
    return configManager.exportData();
  });

  ipcMain.handle('config:importData', async (_, data) => {
    configManager.importData(data);
    return { success: true };
  });

  ipcMain.handle('config:getConfigPath', async () => {
    return configManager.getConfigPath();
  });

  // S3 Handlers
  ipcMain.handle('s3:connect', async (_, config) => {
    try {
      const service = new S3Service(config);
      await service.testConnection();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('s3:listBuckets', async (_, config) => {
    try {
      const service = new S3Service(config);
      return await service.listBuckets();
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('s3:listObjects', async (_, config, bucket, prefix) => {
    try {
      const service = new S3Service(config);
      return await service.listObjects(bucket, prefix);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('s3:downloadFile', async (_, config, bucket, key, localPath) => {
    try {
      const service = new S3Service(config);
      return await service.downloadFile(bucket, key, localPath);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('s3:uploadFile', async (_, config, bucket, key, localPath) => {
    try {
      const service = new S3Service(config);
      return await service.uploadFile(bucket, key, localPath);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('s3:deleteFile', async (_, config, bucket, key) => {
    try {
      const service = new S3Service(config);
      return await service.deleteFile(bucket, key);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  // FTP Handlers
  ipcMain.handle('ftp:connect', async (_, config) => {
    try {
      const service = new FTPService(config);
      await service.connect();
      await service.disconnect();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('ftp:listFiles', async (_, config, path) => {
    try {
      const service = new FTPService(config);
      await service.connect();
      const files = await service.listFiles(path);
      await service.disconnect();
      return files;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('ftp:downloadFile', async (_, config, remotePath, localPath) => {
    try {
      const service = new FTPService(config);
      await service.connect();
      const result = await service.downloadFile(remotePath, localPath);
      await service.disconnect();
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('ftp:uploadFile', async (_, config, localPath, remotePath) => {
    try {
      const service = new FTPService(config);
      await service.connect();
      const result = await service.uploadFile(localPath, remotePath);
      await service.disconnect();
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  // SFTP Handlers
  ipcMain.handle('sftp:connect', async (_, config) => {
    try {
      const service = new SFTPService(config);
      await service.connect();
      await service.disconnect();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('sftp:listFiles', async (_, config, path) => {
    try {
      const service = new SFTPService(config);
      await service.connect();
      const files = await service.listFiles(path);
      await service.disconnect();
      return files;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('sftp:downloadFile', async (_, config, remotePath, localPath) => {
    try {
      const service = new SFTPService(config);
      await service.connect();
      const result = await service.downloadFile(remotePath, localPath);
      await service.disconnect();
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('sftp:uploadFile', async (_, config, localPath, remotePath) => {
    try {
      const service = new SFTPService(config);
      await service.connect();
      const result = await service.uploadFile(localPath, remotePath);
      await service.disconnect();
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  // SMB Handlers
  ipcMain.handle('smb:connect', async (_, config) => {
    try {
      const service = new SMBService(config);
      const result = await service.connect();
      await service.disconnect();
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('smb:listFiles', async (_, config, path) => {
    try {
      const service = new SMBService(config);
      const files = await service.listFiles(path);
      await service.disconnect();
      return files;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('smb:downloadFile', async (_, config, remotePath, localPath) => {
    try {
      const service = new SMBService(config);
      const result = await service.downloadFile(remotePath, localPath);
      await service.disconnect();
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('smb:uploadFile', async (_, config, localPath, remotePath) => {
    try {
      const service = new SMBService(config);
      const result = await service.uploadFile(localPath, remotePath);
      await service.disconnect();
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });
}
