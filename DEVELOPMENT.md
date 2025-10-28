# Development Guide

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 9.x or higher

### Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development**
   ```bash
   npm run dev
   ```

   This will:
   - Compile the TypeScript main process
   - Start the Vite dev server for the renderer
   - Launch Electron with hot-reload

## Project Architecture

### Main Process (`src/main/`)
- **main.ts**: Electron app entry point, window management, IPC handlers
- **preload.ts**: Context bridge for secure renderer communication
- **services/**: Protocol implementation services
  - `s3-service.ts`: AWS S3 and S3-compatible storage
  - `ftp-service.ts`: FTP protocol
  - `sftp-service.ts`: SFTP over SSH
  - `smb-service.ts`: SMB/CIFS protocol (partial)

### Renderer Process (`src/renderer/`)
- **main.tsx**: React entry point
- **App.tsx**: Main application component
- **components/**: React UI components
  - `Header.tsx`: Top navigation bar
  - `Sidebar.tsx`: Connection list sidebar
  - `ConnectionModal.tsx`: New connection dialog
  - `FileBrowser.tsx`: Main file browser interface
- **store/**: Zustand state management
  - `useStore.ts`: Global application state

## Building

### Development Build
```bash
npm run build
```

### Production Package
```bash
# Current platform
npm run package

# Specific platforms
npm run package:mac
npm run package:win
npm run package:linux
```

## Adding New Protocol Support

1. **Create Service** in `src/main/services/`:
   ```typescript
   export interface YourProtocolConfig {
     // Config properties
   }

   export class YourProtocolService {
     async connect() { /* ... */ }
     async listFiles(path: string) { /* ... */ }
     async downloadFile(remotePath: string, localPath: string) { /* ... */ }
     async uploadFile(localPath: string, remotePath: string) { /* ... */ }
   }
   ```

2. **Add IPC Handlers** in `src/main/main.ts`:
   ```typescript
   ipcMain.handle('yourprotocol:connect', async (_, config) => {
     // Implementation
   });
   ```

3. **Expose API** in `src/main/preload.ts`:
   ```typescript
   yourprotocol: {
     connect: (config: any) => ipcRenderer.invoke('yourprotocol:connect', config),
   }
   ```

4. **Update UI** in `src/renderer/components/`:
   - Add to ConnectionModal.tsx
   - Update FileBrowser.tsx
   - Add icon in Sidebar.tsx

## Testing

### Manual Testing
1. Start dev server: `npm run dev`
2. Test each protocol:
   - Create connection
   - Browse files
   - Upload/download
   - Delete files

### Protocol-Specific Testing

#### S3
- Use AWS credentials or MinIO local server
- Test bucket listing
- Test object operations

#### FTP/SFTP
- Use FileZilla Server or local SSH server
- Test directory navigation
- Test file transfers

## Troubleshooting

### TypeScript Errors
The errors shown during development are expected until dependencies are installed:
```bash
npm install
```

### Electron Won't Start
- Check if port 5173 is available
- Clear dist folder: `rm -rf dist/`
- Rebuild: `npm run build:main`

### Connection Issues
- Verify credentials
- Check firewall settings
- Test connection with native client first

## Performance Tips

1. **Large File Lists**: Implement pagination or virtual scrolling
2. **Slow Uploads**: Add progress tracking
3. **Memory Usage**: Dispose of connections when not in use

## Security Considerations

- Never commit credentials
- Use environment variables for testing
- Implement credential encryption for stored connections
- Validate all user inputs
- Use context isolation (already configured)

## Code Style

- Use TypeScript strict mode
- Follow functional React patterns
- Use async/await over promises
- Comment complex logic
- Keep components small and focused

## Deployment

### Desktop Apps
Apps are built in `release/` directory and are ready to distribute.

### Docker
```bash
# Build
docker build -t yaami .

# Run
docker-compose up -d
```

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR with description

## Resources

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [AWS SDK S3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
