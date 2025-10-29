# Yaami v1.0.0 - Universal Cloud Storage Browser

## 🎉 First Official Release

We're excited to announce the first official release of **Yaami** - a powerful, cross-platform desktop application that provides a unified interface for managing multiple cloud storage protocols!

## ✨ Features

### Multi-Protocol Support
- **Amazon S3** - Full S3 and S3-compatible storage support (MinIO, DigitalOcean Spaces, Wasabi, etc.)
- **FTP** - Traditional File Transfer Protocol with passive mode support
- **SFTP** - Secure SSH File Transfer Protocol with key and password authentication
- **SSH/SCP** - Remote command execution and secure file copying
- **SMB** - Windows network shares and Samba/CIFS support

### User Experience
- 🎨 **Modern UI** - Clean, dark-themed interface built with React and Tailwind CSS
- ⚡ **Fast Performance** - Built on Electron with native performance
- 🔒 **Secure** - Context isolation and encrypted credential storage
- 💾 **Persistent Storage** - Auto-saves connections and settings
- 📦 **Multi-Select Downloads** - Select and download multiple files at once
- ✏️ **Connection Management** - Edit, delete, and test connections with visual feedback

### Cross-Platform
- ✅ Windows (NSIS Installer & Portable)
- ✅ macOS (DMG - build on macOS)
- ✅ Linux (AppImage, DEB, RPM - build on Linux)

## 📥 Downloads

### Windows
- **[Yaami Setup 1.0.0.exe](https://github.com/nixuser9/yaami/releases/download/v1.0.0/Yaami%20Setup%201.0.0.exe)** - Recommended installer (100 MB)
- **[Yaami 1.0.0.exe](https://github.com/nixuser9/yaami/releases/download/v1.0.0/Yaami%201.0.0.exe)** - Portable version (100 MB)

### macOS & Linux
To build for macOS and Linux, clone the repository and run:
```bash
# For macOS (on a Mac)
npm run package:mac

# For Linux (on Linux)
npm run package:linux
```

## 🚀 Getting Started

1. Download the appropriate installer for your platform
2. Install and launch Yaami
3. Click "New Connection" to add your first storage connection
4. Choose your protocol (S3, FTP, SFTP, SSH, SCP, or SMB)
5. Enter your credentials and test the connection
6. Start browsing and managing your files!

## 📖 Documentation

- [README.md](https://github.com/nixuser9/yaami/blob/main/README.md) - Full documentation
- [QUICKSTART.md](https://github.com/nixuser9/yaami/blob/main/QUICKSTART.md) - Quick start guide
- [DEVELOPMENT.md](https://github.com/nixuser9/yaami/blob/main/DEVELOPMENT.md) - Development guide
- [CONFIG.md](https://github.com/nixuser9/yaami/blob/main/CONFIG.md) - Configuration options

## 🛠️ Tech Stack

- **Electron 33** - Cross-platform desktop framework
- **React 18** - UI library with hooks
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 3** - Modern utility-first CSS
- **Vite 5** - Lightning-fast build tool
- **Zustand** - Lightweight state management

## 🔧 System Requirements

- **Windows**: Windows 10 or later
- **macOS**: macOS 10.15 (Catalina) or later
- **Linux**: Most modern distributions
- **RAM**: 4 GB minimum, 8 GB recommended
- **Disk Space**: 200 MB for installation

## 🐛 Known Issues

- Large file uploads may need progress indicators (coming soon)
- SMB connections should use IP/hostname only (not `smb://` prefix)
- Build icons use Electron defaults (custom icons coming in next release)

## 🗺️ Roadmap

Coming in future releases:
- [ ] WebDAV support
- [ ] Google Drive integration
- [ ] Dropbox integration
- [ ] OneDrive integration
- [ ] File transfer queue with progress tracking
- [ ] File preview (images, text, PDF)
- [ ] Drag and drop upload
- [ ] File search functionality
- [ ] Custom application icons
- [ ] Code signing for installers

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](https://github.com/nixuser9/yaami/blob/main/CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](https://github.com/nixuser9/yaami/blob/main/LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ using:
- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

## 💬 Support

- 🐛 [Report a bug](https://github.com/nixuser9/yaami/issues)
- 💡 [Request a feature](https://github.com/nixuser9/yaami/issues)
- 📖 [Read the docs](https://github.com/nixuser9/yaami)

---

**Made with ❤️ by [Kishan Kumar](https://github.com/nixuser9)**

If you find Yaami useful, please give it a ⭐ on GitHub!
