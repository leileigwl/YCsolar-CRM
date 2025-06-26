# PowerShell Script: Update Version

# Check if version number is provided
param (
    [Parameter(Position=0, Mandatory=$true)]
    [string]$NewVersion
)

# Set output encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Read current version
$versionFile = "config/version.json"
$versionContent = Get-Content $versionFile -Raw | ConvertFrom-Json
$CurrentVersion = $versionContent.version

Write-Host "Current version: $CurrentVersion"
Write-Host "New version: $NewVersion"

# Update version config file
$versionContent.version = $NewVersion
$versionContent | ConvertTo-Json | Set-Content $versionFile -Encoding UTF8

Write-Host "Version updated to $NewVersion"

# Show git commit commands
Write-Host ""
Write-Host "Suggested Git commands:"
Write-Host "git add config/version.json"
Write-Host "git commit -m ""Version update: $CurrentVersion -> $NewVersion"""
Write-Host "git tag v$NewVersion"
Write-Host "git push && git push --tags" 