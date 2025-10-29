# GitHub Release Instructions for Yaami v1.0.0

## Option 1: Automated Release (Recommended - Using GitHub Actions)

The GitHub Actions workflow has been set up and will automatically build for all platforms and create releases when you push a tag.

### To trigger the automated release:

```bash
# The tag v1.0.0 is already pushed
# To trigger the workflow manually:
# Go to: https://github.com/nixuser9/yaami/actions/workflows/release.yml
# Click "Run workflow" button
```

The workflow will:
1. Build for Windows, macOS, and Linux
2. Create installers for all platforms
3. Automatically create a GitHub release
4. Upload all build artifacts

## Option 2: Manual Release Using GitHub Web Interface

Since you already have the Windows builds ready:

### Steps:

1. **Go to Releases Page**
   ```
   https://github.com/nixuser9/yaami/releases
   ```

2. **Click "Draft a new release"**

3. **Fill in the details:**
   - **Tag**: `v1.0.0` (select existing tag)
   - **Release title**: `Yaami v1.0.0 - Universal Cloud Storage Browser`
   - **Description**: Copy content from `RELEASE_NOTES.md`

4. **Upload Files:**
   - Drag and drop these files from `C:\Users\maver\yaami\release\`:
     - `Yaami Setup 1.0.0.exe` (100 MB - Installer)
     - `Yaami 1.0.0.exe` (100 MB - Portable)

5. **Click "Publish release"**

## Option 3: Using PowerShell Script

### Prerequisites:
1. Get a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (all repo permissions)
   - Copy the token

2. Set the token as environment variable:
   ```powershell
   $env:GITHUB_TOKEN = "your_token_here"
   ```

3. Run the script:
   ```powershell
   cd C:\Users\maver\yaami
   .\create-release.ps1
   ```

## Option 4: Using GitHub CLI (gh)

### Prerequisites:
GitHub CLI is already installed. You need to authenticate:

```powershell
# Start a new PowerShell window (to get updated PATH)
# Then authenticate:
gh auth login

# Follow the prompts:
# - Choose: GitHub.com
# - Choose: HTTPS
# - Authenticate with: Login with a web browser
# - Follow the browser flow
```

### Create the release:

```powershell
cd C:\Users\maver\yaami

# Create release with files
gh release create v1.0.0 `
  "release/Yaami Setup 1.0.0.exe#Windows Installer (Recommended)" `
  "release/Yaami 1.0.0.exe#Windows Portable" `
  --title "Yaami v1.0.0 - Universal Cloud Storage Browser" `
  --notes-file RELEASE_NOTES.md
```

## Current Status

✅ Tag v1.0.0 created and pushed to GitHub
✅ Windows builds ready:
   - `Yaami Setup 1.0.0.exe` (100 MB)
   - `Yaami 1.0.0.exe` (100 MB)
✅ GitHub Actions workflow configured
✅ Release notes prepared (RELEASE_NOTES.md)

## Building for Other Platforms

### macOS (requires Mac):
```bash
npm run package:mac
# Creates: release/*.dmg and release/*.zip
```

### Linux (requires Linux):
```bash
npm run package:linux
# Creates: release/*.AppImage, release/*.deb, release/*.rpm
```

Or use the GitHub Actions workflow to build for all platforms automatically!

## Next Steps

Choose one of the options above to create your release. I recommend:

**For immediate release with Windows builds only**: Use Option 2 (Web Interface)

**For full cross-platform release**: Use Option 1 (GitHub Actions) - just trigger the workflow manually

## Release URL

Once created, your release will be available at:
```
https://github.com/nixuser9/yaami/releases/tag/v1.0.0
```

Users can then download the installers directly from GitHub!
