import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

interface AppSettings {
  theme: 'dark' | 'light';
  defaultDownloadPath: string;
  autoConnect: boolean;
  lastActiveConnection?: string;
  windowBounds?: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
}

interface ConnectionConfig {
  id: string;
  name: string;
  type: string;
  config: any;
  createdAt: string;
  lastUsed?: string;
}

interface AppMetadata {
  version: string;
  lastOpened: string;
  totalConnections: number;
  firstInstall: string;
}

export class ConfigManager {
  private configDir: string;
  private settingsPath: string;
  private connectionsPath: string;
  private metadataPath: string;

  constructor() {
    // Use userData directory which works across all platforms including Docker
    this.configDir = app.getPath('userData');
    this.settingsPath = path.join(this.configDir, 'settings.json');
    this.connectionsPath = path.join(this.configDir, 'connections.json');
    this.metadataPath = path.join(this.configDir, 'metadata.json');
    
    this.ensureConfigDir();
    this.initializeFiles();
  }

  private ensureConfigDir(): void {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  private initializeFiles(): void {
    // Initialize settings
    if (!fs.existsSync(this.settingsPath)) {
      this.saveSettings(this.getDefaultSettings());
    }

    // Initialize connections
    if (!fs.existsSync(this.connectionsPath)) {
      fs.writeFileSync(this.connectionsPath, JSON.stringify([], null, 2));
    }

    // Initialize metadata
    if (!fs.existsSync(this.metadataPath)) {
      const metadata: AppMetadata = {
        version: app.getVersion(),
        firstInstall: new Date().toISOString(),
        lastOpened: new Date().toISOString(),
        totalConnections: 0,
      };
      fs.writeFileSync(this.metadataPath, JSON.stringify(metadata, null, 2));
    }
  }

  private getDefaultSettings(): AppSettings {
    return {
      theme: 'dark',
      defaultDownloadPath: app.getPath('downloads'),
      autoConnect: false,
      windowBounds: {
        width: 1400,
        height: 900,
      },
    };
  }

  // Settings methods
  getSettings(): AppSettings {
    try {
      const data = fs.readFileSync(this.settingsPath, 'utf-8');
      return { ...this.getDefaultSettings(), ...JSON.parse(data) };
    } catch (error) {
      return this.getDefaultSettings();
    }
  }

  saveSettings(settings: Partial<AppSettings>): void {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    fs.writeFileSync(this.settingsPath, JSON.stringify(updated, null, 2));
  }

  // Connection methods
  getConnections(): ConnectionConfig[] {
    try {
      const data = fs.readFileSync(this.connectionsPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveConnection(connection: ConnectionConfig): void {
    const connections = this.getConnections();
    const index = connections.findIndex((c) => c.id === connection.id);
    
    if (index >= 0) {
      connections[index] = { ...connection, lastUsed: new Date().toISOString() };
    } else {
      connections.push({ ...connection, createdAt: new Date().toISOString() });
    }
    
    fs.writeFileSync(this.connectionsPath, JSON.stringify(connections, null, 2));
    this.updateMetadata({ totalConnections: connections.length });
  }

  deleteConnection(id: string): void {
    const connections = this.getConnections().filter((c) => c.id !== id);
    fs.writeFileSync(this.connectionsPath, JSON.stringify(connections, null, 2));
    this.updateMetadata({ totalConnections: connections.length });
  }

  // Metadata methods
  getMetadata(): AppMetadata {
    try {
      const data = fs.readFileSync(this.metadataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return {
        version: app.getVersion(),
        firstInstall: new Date().toISOString(),
        lastOpened: new Date().toISOString(),
        totalConnections: 0,
      };
    }
  }

  updateMetadata(updates: Partial<AppMetadata>): void {
    const current = this.getMetadata();
    const updated = { ...current, ...updates, lastOpened: new Date().toISOString() };
    fs.writeFileSync(this.metadataPath, JSON.stringify(updated, null, 2));
  }

  // Export/Import for backup
  exportData(): { settings: AppSettings; connections: ConnectionConfig[]; metadata: AppMetadata } {
    return {
      settings: this.getSettings(),
      connections: this.getConnections(),
      metadata: this.getMetadata(),
    };
  }

  importData(data: { settings?: AppSettings; connections?: ConnectionConfig[] }): void {
    if (data.settings) {
      this.saveSettings(data.settings);
    }
    if (data.connections) {
      fs.writeFileSync(this.connectionsPath, JSON.stringify(data.connections, null, 2));
    }
  }

  // Get config directory path
  getConfigPath(): string {
    return this.configDir;
  }
}
