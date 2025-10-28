# Yaami 🗂️

**Universal Cloud Storage Browser - One Tool for All Your Storage Needs**

A powerful, cross-platform desktop application that provides a unified interface for managing multiple cloud storage protocols. Connect to S3, FTP, SFTP, SSH, SCP, SMB and more - all from one beautiful, modern interface.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)
![Electron](https://img.shields.io/badge/electron-33-47848F.svg)
![React](https://img.shields.io/badge/react-18-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-5-3178C6.svg)

## ✨ Features

- 🌐 **Multi-Protocol Support**: S3, FTP, SFTP, SSH, SCP, SMB - all in one place
- 🎨 **Modern UI**: Clean, dark-themed interface built with React and Tailwind CSS
- 🚀 **Cross-Platform**: Native apps for macOS, Windows, and Linux
- 🐳 **Docker Support**: Run in containerized environments
- 🔒 **Secure**: Context isolation, encrypted credential storage
- ⚡ **Fast**: Built on Electron with native performance
- 📦 **Lightweight**: Minimal resource footprint
- 🔄 **Multi-Select Downloads**: Select and download multiple files at once
- ✏️ **Connection Management**: Edit, delete, test connections with visual feedback
- 💾 **Persistent Storage**: Auto-saves connections and settings

## 🖼️ Screenshots

*(Add screenshots here once the UI is ready)*

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- (For Docker) Docker and Docker Compose

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/nixuser9/yaami.git
cd yaami

# Install dependencies
npm install
```

### Development

```bash
# Run in development mode
npm run dev
```

This will start both the Electron main process and the Vite development server.

### Build

```bash
# Build for your current platform
npm run package

# Build for specific platforms
npm run package:mac     # macOS
npm run package:win     # Windows
npm run package:linux   # Linux
```

Built applications will be in the `release/` directory.

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Using Docker directly

```bash
# Build the image
docker build -t yaami .

# Run the container
docker run -d \
  --name yaami \
  -p 3000:3000 \
  -v yaami-config:/app/config \
  -v yaami-downloads:/app/downloads \
  yaami
```

## 🔌 Supported Protocols

### Amazon S3 / S3-Compatible Storage
- ✅ List buckets and objects
- ✅ Upload/download files
- ✅ Delete files and directories
- ✅ Support for S3-compatible services (MinIO, DigitalOcean Spaces, Wasabi, etc.)

### FTP (File Transfer Protocol)
- ✅ Connect to FTP servers
- ✅ Browse directories
- ✅ Upload/download files (single and batch)
- ✅ Create and delete directories
- ✅ Passive mode support

### SFTP (SSH File Transfer Protocol)
- ✅ SSH key authentication
- ✅ Password authentication
- ✅ Secure file transfer
- ✅ Directory management
- ✅ Custom port support

### SSH/SCP (Secure Shell/Secure Copy)
- ✅ Remote command execution
- ✅ Secure file transfer via SCP
- ✅ Key-based authentication
- ✅ Password authentication

### SMB (Server Message Block)
- ✅ Windows network shares
- ✅ Samba/CIFS support
- ✅ Domain authentication
- ✅ Browse and manage files
- ✅ Upload/download operations

## 📖 Usage

### Adding a New Connection

1. Click the "New Connection" button in the sidebar
2. Choose your protocol (S3, FTP, SFTP, SSH, SCP, SMB)
3. Enter connection details:
   - **S3**: Access Key, Secret Key, Region, (Optional) Endpoint for S3-compatible services
   - **FTP/SFTP**: Host, Port, Username, Password
   - **SSH/SCP**: Host, Port, Username, Password or SSH Key
   - **SMB**: Host, Share Name, Username, Password, (Optional) Domain
4. Click "Test Connection" to verify your credentials
5. Click "Save" to store the connection

### Managing Connections

- **Edit**: Click the blue pencil icon to modify connection settings
- **Test**: Verify connection status with visual feedback (success/error indicators)
- **Delete**: Click the red trash icon to remove a connection (with confirmation)
- **Disconnect**: Click the yellow X to disconnect from active connection

### Managing Files

- Click on folders to navigate through directories
- Select multiple files using checkboxes
- Download single files or batch download to a folder
- Upload files to remote servers
- Create new directories
- Delete files and folders
- Navigate breadcrumb trail to move up directory levels

## 🛠️ Tech Stack

- **Electron 33**: Cross-platform desktop framework
- **React 18**: UI library with hooks
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 3**: Modern utility-first CSS
- **Vite 5**: Lightning-fast build tool
- **Zustand**: Lightweight state management
- **AWS SDK v3**: S3 integration
- **ssh2-sftp-client**: SFTP support
- **ssh2**: SSH and SCP support
- **basic-ftp**: FTP client
- **@marsaud/smb2**: SMB/CIFS protocol support

## 📁 Project Structure

```
yaami/
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.ts        # App entry point
│   │   ├── preload.ts     # Preload script
│   │   └── services/      # Protocol services
│   │       ├── s3-service.ts
│   │       ├── ftp-service.ts
│   │       ├── sftp-service.ts
│   │       └── smb-service.ts
│   └── renderer/          # React UI
│       ├── components/    # React components
│       ├── store/         # State management
│       ├── App.tsx        # Main app component
│       └── main.tsx       # React entry point
├── dist/                  # Build output
├── release/               # Packaged apps
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose config
└── package.json          # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Roadmap

- [x] Multi-protocol support (S3, FTP, SFTP, SSH, SCP, SMB)
- [x] Connection management (add, edit, delete, test)
- [x] Multi-select and batch downloads
- [x] Persistent configuration storage
- [x] Docker support
- [ ] WebDAV support
- [ ] Google Drive integration
- [ ] Dropbox integration
- [ ] OneDrive integration
- [ ] File transfer queue with progress tracking
- [ ] Bookmarks and favorites
- [ ] File preview (images, text, PDF)
- [ ] Drag and drop upload
- [ ] File search functionality
- [ ] Sync capabilities
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts
- [ ] Transfer speed limiting
- [ ] Resume interrupted transfers

## 🐛 Known Issues

- Large file uploads may need progress indicators
- SMB connections with `smb://` prefix in hostname should use IP/hostname only

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI components inspired by modern file managers
- Icons from [React Icons](https://react-icons.github.io/react-icons/)

## 💬 Support

For support, please open an issue in the [GitHub repository](https://github.com/nixuser9/yaami/issues).

## 🌟 Star History

If you find Yaami useful, please consider giving it a star ⭐

---

**Made with ❤️ by [Kishan Kumar](https://github.com/nixuser9)**
