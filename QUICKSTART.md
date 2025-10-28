# Quick Start Guide

## Installation (2 minutes)

### Option 1: Automated Setup (Recommended)
```bash
./setup.sh
```

### Option 2: Manual Setup
```bash
npm install
```

## Running Yaami

### Development Mode
```bash
npm run dev
```
The app will open automatically with hot-reload enabled.

### Production Build
```bash
# Build
npm run build

# Package for your OS
npm run package
```

## First Time Usage

### 1. Launch the Application
When you first open Yaami, you'll see a welcome screen.

### 2. Create Your First Connection

Click **"New Connection"** and choose a protocol:

#### For AWS S3:
```
Connection Name: My S3 Bucket
Type: S3
Access Key ID: YOUR_ACCESS_KEY
Secret Access Key: YOUR_SECRET_KEY
Region: us-east-1
Endpoint: (leave empty for AWS, or enter for S3-compatible)
```

#### For FTP:
```
Connection Name: My FTP Server
Type: FTP
Host: ftp.example.com
Port: 21
User: username
Password: password
```

#### For SFTP:
```
Connection Name: My SSH Server
Type: SFTP
Host: ssh.example.com
Port: 22
Username: username
Password: password
```

### 3. Browse Files
- Click on your connection in the sidebar
- Navigate folders by clicking them
- Use the toolbar to refresh, upload, or download files

## Docker Quick Start

### Using Docker Compose
```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f yaami

# Stop
docker-compose down
```

### Using Docker
```bash
# Build
docker build -t yaami .

# Run
docker run -d --name yaami -p 3000:3000 yaami
```

## Common Tasks

### Download a File
1. Navigate to the file
2. Click the download icon
3. Choose destination (coming soon - currently downloads to default location)

### Upload a File
1. Navigate to destination folder
2. Click upload button
3. Select file (coming soon - currently use file picker)

### Delete a File
1. Right-click on file
2. Select "Delete" (coming soon)

## Keyboard Shortcuts (Coming Soon)

- `Cmd/Ctrl + N` - New Connection
- `Cmd/Ctrl + R` - Refresh
- `Cmd/Ctrl + O` - Open File
- `Enter` - Open Folder
- `Backspace` - Go Up
- `Cmd/Ctrl + D` - Download
- `Cmd/Ctrl + U` - Upload

## Troubleshooting

### "Cannot connect to server"
- Check your credentials
- Verify the host/endpoint is correct
- Check your internet connection
- Verify firewall settings

### "Module not found" errors
Run:
```bash
npm install
```

### App won't start
1. Delete `dist/` and `node_modules/`
2. Run `npm install`
3. Run `npm run dev`

### Performance issues
- Close unused connections
- Limit number of simultaneous transfers
- Check available memory

## Tips & Tricks

1. **Multiple Connections**: You can have multiple connections open at once
2. **S3 Compatible Services**: Use the Endpoint field for MinIO, DigitalOcean Spaces, etc.
3. **Save Time**: Connections are saved automatically
4. **Secure**: Credentials are stored locally on your machine

## Next Steps

- Read the full [README.md](README.md)
- Check out [DEVELOPMENT.md](DEVELOPMENT.md) for development
- Report issues on GitHub

## Need Help?

- GitHub Issues: [Report a bug or request a feature]
- Documentation: See README.md and DEVELOPMENT.md
- Examples: Check the examples/ folder (coming soon)

---

🎉 **You're all set!** Start managing your cloud storage with Yaami.
