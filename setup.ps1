#!/usr/bin/env pwsh

Write-Host "🚀 Discord Bot Dashboard - Quick Start Setup" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
Write-Host "`nChecking Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker compose version
    Write-Host "✅ Docker Compose is available: $composeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker Compose is not available" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
Write-Host "`nChecking environment configuration..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Please edit .env and add your Discord Bot credentials!" -ForegroundColor Red
    Write-Host "You need to set at least:" -ForegroundColor Red
    Write-Host "  - DISCORD_TOKEN" -ForegroundColor Red
    Write-Host "  - DISCORD_CLIENT_ID" -ForegroundColor Red
    Write-Host "  - DISCORD_CLIENT_SECRET`n" -ForegroundColor Red
    
    $continue = Read-Host "Have you configured your .env file? (y/n)"
    if ($continue -ne "y") {
        Write-Host "`nPlease configure your .env file and run this script again." -ForegroundColor Yellow
        exit 0
    }
}
else {
    Write-Host "✅ .env file found" -ForegroundColor Green
}

# Install root dependencies
Write-Host "`nInstalling root dependencies..." -ForegroundColor Yellow
npm install

# Ask user what they want to do
Write-Host "`nWhat would you like to do?" -ForegroundColor Cyan
Write-Host "1) Start all services with Docker (Recommended)" -ForegroundColor White
Write-Host "2) Install dependencies for local development" -ForegroundColor White
Write-Host "3) Both" -ForegroundColor White

$choice = Read-Host "`nEnter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n🐳 Starting Docker services..." -ForegroundColor Yellow
        docker compose up -d
        
        Write-Host "`n✅ Services are starting!" -ForegroundColor Green
        Write-Host "`nAccess your services at:" -ForegroundColor Cyan
        Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor White
        Write-Host "  - API:      http://localhost:5000" -ForegroundColor White
        Write-Host "  - MongoDB:  localhost:27017" -ForegroundColor White
        Write-Host "  - Redis:    localhost:6379" -ForegroundColor White
        
        Write-Host "`nView logs with: docker compose logs -f" -ForegroundColor Yellow
        Write-Host "Stop services with: docker compose down`n" -ForegroundColor Yellow
    }
    "2" {
        Write-Host "`n📦 Installing workspace dependencies..." -ForegroundColor Yellow
        npm install --workspaces
        
        Write-Host "`n✅ Dependencies installed!" -ForegroundColor Green
        Write-Host "`nYou can now run:" -ForegroundColor Cyan
        Write-Host "  npm run dev:bot      - Start the bot" -ForegroundColor White
        Write-Host "  npm run dev:api      - Start the API" -ForegroundColor White
        Write-Host "  npm run dev:frontend - Start the frontend" -ForegroundColor White
        Write-Host "  npm run dev          - Start all (requires MongoDB & Redis running)`n" -ForegroundColor White
    }
    "3" {
        Write-Host "`n📦 Installing workspace dependencies..." -ForegroundColor Yellow
        npm install --workspaces
        
        Write-Host "`n🐳 Starting Docker services..." -ForegroundColor Yellow
        docker compose up -d
        
        Write-Host "`n✅ All set up!" -ForegroundColor Green
        Write-Host "`nAccess your services at:" -ForegroundColor Cyan
        Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor White
        Write-Host "  - API:      http://localhost:5000" -ForegroundColor White
        
        Write-Host "`nView logs with: docker compose logs -f" -ForegroundColor Yellow
        Write-Host "Stop services with: docker compose down`n" -ForegroundColor Yellow
    }
    default {
        Write-Host "`n❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "Check the README.md for more information.`n" -ForegroundColor Cyan
