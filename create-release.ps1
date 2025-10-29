# GitHub Release Upload Script for Yaami v1.0.0
# This script creates a GitHub release and uploads the Windows executables

param(
    [string]$GitHubToken = $env:GITHUB_TOKEN
)

if (-not $GitHubToken) {
    Write-Host "Error: GitHub token not provided. Please set GITHUB_TOKEN environment variable or pass as parameter." -ForegroundColor Red
    Write-Host "Get your token from: https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "Required scopes: repo" -ForegroundColor Yellow
    exit 1
}

$owner = "nixuser9"
$repo = "yaami"
$tag = "v1.0.0"
$releaseName = "Yaami v1.0.0 - Universal Cloud Storage Browser"

# Read release notes
$releaseBody = Get-Content -Path "RELEASE_NOTES.md" -Raw

# Create release
Write-Host "Creating GitHub release..." -ForegroundColor Cyan

$releaseData = @{
    tag_name = $tag
    target_commitish = "main"
    name = $releaseName
    body = $releaseBody
    draft = $false
    prerelease = $false
} | ConvertTo-Json

$headers = @{
    "Authorization" = "token $GitHubToken"
    "Accept" = "application/vnd.github.v3+json"
    "Content-Type" = "application/json"
}

try {
    $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/releases" `
        -Method Post `
        -Headers $headers `
        -Body $releaseData
    
    Write-Host "✓ Release created successfully!" -ForegroundColor Green
    Write-Host "Release URL: $($release.html_url)" -ForegroundColor Green
    
    # Upload assets
    $uploadUrl = $release.upload_url -replace '\{\?.*\}', ''
    
    $files = @(
        "release\Yaami Setup 1.0.0.exe",
        "release\Yaami 1.0.0.exe"
    )
    
    foreach ($file in $files) {
        if (Test-Path $file) {
            $fileName = Split-Path $file -Leaf
            Write-Host "Uploading $fileName..." -ForegroundColor Cyan
            
            $fileBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $file))
            $uploadHeaders = @{
                "Authorization" = "token $GitHubToken"
                "Accept" = "application/vnd.github.v3+json"
                "Content-Type" = "application/octet-stream"
            }
            
            $uploadUri = "$uploadUrl?name=$([System.Web.HttpUtility]::UrlEncode($fileName))"
            
            Invoke-RestMethod -Uri $uploadUri `
                -Method Post `
                -Headers $uploadHeaders `
                -Body $fileBytes | Out-Null
            
            Write-Host "✓ Uploaded $fileName" -ForegroundColor Green
        } else {
            Write-Host "✗ File not found: $file" -ForegroundColor Red
        }
    }
    
    Write-Host "`n✓ Release complete!" -ForegroundColor Green
    Write-Host "View release at: $($release.html_url)" -ForegroundColor Yellow
    
} catch {
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "Release already exists. Trying to get existing release..." -ForegroundColor Yellow
        
        try {
            $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/releases/tags/$tag" `
                -Method Get `
                -Headers $headers
            
            Write-Host "Release found at: $($release.html_url)" -ForegroundColor Green
            
            # Check if we need to upload missing assets
            $uploadUrl = $release.upload_url -replace '\{\?.*\}', ''
            $existingAssets = $release.assets | ForEach-Object { $_.name }
            
            $files = @(
                "release\Yaami Setup 1.0.0.exe",
                "release\Yaami 1.0.0.exe"
            )
            
            foreach ($file in $files) {
                $fileName = Split-Path $file -Leaf
                
                if ($fileName -notin $existingAssets) {
                    if (Test-Path $file) {
                        Write-Host "Uploading $fileName..." -ForegroundColor Cyan
                        
                        $fileBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $file))
                        $uploadHeaders = @{
                            "Authorization" = "token $GitHubToken"
                            "Accept" = "application/vnd.github.v3+json"
                            "Content-Type" = "application/octet-stream"
                        }
                        
                        $uploadUri = "$uploadUrl?name=$([System.Web.HttpUtility]::UrlEncode($fileName))"
                        
                        Invoke-RestMethod -Uri $uploadUri `
                            -Method Post `
                            -Headers $uploadHeaders `
                            -Body $fileBytes | Out-Null
                        
                        Write-Host "✓ Uploaded $fileName" -ForegroundColor Green
                    }
                } else {
                    Write-Host "✓ $fileName already uploaded" -ForegroundColor Yellow
                }
            }
            
        } catch {
            Write-Host "Error: $_" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Error creating release: $_" -ForegroundColor Red
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        exit 1
    }
}
