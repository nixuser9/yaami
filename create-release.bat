@echo off
REM Quick GitHub Release Script for Yaami
echo.
echo ========================================
echo   Yaami v1.0.0 GitHub Release Creator
echo ========================================
echo.

REM Check if gh is available
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: GitHub CLI (gh) not found in PATH
    echo Please restart your terminal or run: refreshenv
    echo Or install from: https://cli.github.com/
    pause
    exit /b 1
)

echo Checking GitHub authentication...
gh auth status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo You need to authenticate with GitHub first.
    echo Starting authentication process...
    echo.
    gh auth login
    if %ERRORLEVEL% NEQ 0 (
        echo Authentication failed!
        pause
        exit /b 1
    )
)

echo.
echo ✓ GitHub authentication successful
echo.
echo Creating release v1.0.0...
echo.

gh release create v1.0.0 ^
  "release\Yaami Setup 1.0.0.exe#Windows Installer (Recommended)" ^
  "release\Yaami 1.0.0.exe#Windows Portable Version" ^
  --title "Yaami v1.0.0 - Universal Cloud Storage Browser" ^
  --notes-file RELEASE_NOTES.md

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✓ Release created successfully!
    echo ========================================
    echo.
    echo View your release at:
    echo https://github.com/nixuser9/yaami/releases/tag/v1.0.0
    echo.
) else (
    echo.
    echo ========================================
    echo   ✗ Release creation failed
    echo ========================================
    echo.
    echo The release may already exist.
    echo Check: https://github.com/nixuser9/yaami/releases
    echo.
)

pause
