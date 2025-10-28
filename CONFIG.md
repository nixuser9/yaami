# Yaami Configuration & Storage

## 📁 Config Storage Location

Yaami stores all settings, connections, and metadata in platform-specific locations:

- **macOS**: `~/Library/Application Support/yaami/`
- **Windows**: `%APPDATA%\yaami\`
- **Linux**: `~/.config/yaami/`
- **Docker**: `/root/.config/Electron/` (persisted via volume)

## 📄 Configuration Files

### 1. `settings.json` - Application Settings
```json
{
  "theme": "dark",
  "defaultDownloadPath": "/Users/username/Downloads",
  "autoConnect": false,
  "windowBounds": {
    "width": 1400,
    "height": 900,
    "x": 100,
    "y": 100
  }
}
```

### 2. `connections.json` - Saved Connections
```json
[
  {
    "id": "1234567890",
    "name": "My S3 Bucket",
    "type": "s3",
    "config": {
      "accessKeyId": "...",
      "secretAccessKey": "...",
      "region": "us-east-1"
    },
    "createdAt": "2025-10-28T20:00:00.000Z",
    "lastUsed": "2025-10-28T20:30:00.000Z"
  }
]
```

### 3. `metadata.json` - App Metadata
```json
{
  "version": "1.0.0",
  "firstInstall": "2025-10-28T20:00:00.000Z",
  "lastOpened": "2025-10-28T20:30:00.000Z",
  "totalConnections": 5
}
```

## 🎨 Logo

The Yaami logo is a custom SVG that represents:
- 📁 **Folder**: Cloud storage management
- ☁️ **Cloud**: Cloud connectivity
- 🔗 **Connection dots**: Multiple protocol support

Located at: `/public/logo.svg`

## 🔧 Features Implemented

### ✅ Persistent Storage
- Connections are automatically saved when created
- Window size and position are remembered
- Settings persist across app restarts

### ✅ Auto-load Connections
- Previously saved connections load on app startup
- Ready to reconnect immediately

### ✅ Config Manager API
Available through `window.electronAPI.config`:

```typescript
// Get settings
const settings = await window.electronAPI.config.getSettings();

// Save settings
await window.electronAPI.config.saveSettings({ theme: 'dark' });

// Get all connections
const connections = await window.electronAPI.config.getConnections();

// Save a connection
await window.electronAPI.config.saveConnection(connection);

// Delete a connection
await window.electronAPI.config.deleteConnection(id);

// Export all data (backup)
const backup = await window.electronAPI.config.exportData();

// Import data (restore)
await window.electronAPI.config.importData(backup);

// Get config directory path
const configPath = await window.electronAPI.config.getConfigPath();
```

## 🐳 Docker Support

### Running with Docker Compose
```bash
docker-compose up -d
```

### Persistent Volumes
- **yaami-config**: Stores settings and connections
- **yaami-downloads**: Stores downloaded files

### Environment Variables
- `NODE_ENV=production`
- `DISPLAY=:99` (for headless Electron)
- `ELECTRON_ENABLE_LOGGING=1` (for debugging)

### Volume Mounting (Optional)
```yaml
volumes:
  - ./my-config:/root/.config/Electron
  - ./downloads:/app/downloads
```

## 🔒 Security

- Credentials are stored locally (not encrypted by default)
- Config files have user-only permissions
- No telemetry or external data transmission

## 🚀 Usage Examples

### Backup Your Connections
```javascript
// In the app console
const backup = await window.electronAPI.config.exportData();
console.log(JSON.stringify(backup, null, 2));
// Copy and save this JSON
```

### Restore from Backup
```javascript
const backup = { /* your backup data */ };
await window.electronAPI.config.importData(backup);
```

### Find Config Location
```javascript
const path = await window.electronAPI.config.getConfigPath();
console.log('Config stored at:', path);
```

## 📋 TODO: Future Enhancements

- [ ] Credential encryption
- [ ] Cloud sync for settings
- [ ] Import/Export UI
- [ ] Connection templates
- [ ] Backup scheduling
