#!/usr/bin/env pwsh

Write-Host "🚀 Vercel Deployment Setup" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Vercel CLI is not installed" -ForegroundColor Yellow
    Write-Host "Installing Vercel CLI globally...`n" -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed`n" -ForegroundColor Green
}

# Check if user is logged in
Write-Host "Checking Vercel login status..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in to Vercel" -ForegroundColor Yellow
    Write-Host "Please login to Vercel:`n" -ForegroundColor Yellow
    vercel login
}
else {
    Write-Host "✅ Logged in as: $loginCheck`n" -ForegroundColor Green
}

# Ask deployment choice
Write-Host "What would you like to deploy?" -ForegroundColor Cyan
Write-Host "1) Frontend only (Vercel) - Recommended for free hosting" -ForegroundColor White
Write-Host "2) Full setup guide (show instructions)" -ForegroundColor White
Write-Host "3) Cancel" -ForegroundColor White

$choice = Read-Host "`nEnter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n📦 Deploying Frontend to Vercel...`n" -ForegroundColor Yellow
        
        # Navigate to frontend
        Set-Location frontend
        
        Write-Host "Building frontend..." -ForegroundColor Yellow
        npm install
        npm run build
        
        Write-Host "`n🚀 Starting Vercel deployment..." -ForegroundColor Yellow
        Write-Host "Follow the prompts:`n" -ForegroundColor Yellow
        
        vercel
        
        Write-Host "`n✅ Deployment initiated!" -ForegroundColor Green
        Write-Host "`nFor production deployment, run:" -ForegroundColor Cyan
        Write-Host "  vercel --prod`n" -ForegroundColor White
        
        Write-Host "⚠️  Don't forget to:" -ForegroundColor Yellow
        Write-Host "1. Add environment variables in Vercel Dashboard" -ForegroundColor White
        Write-Host "2. Deploy backend to Railway/Render" -ForegroundColor White
        Write-Host "3. Setup MongoDB Atlas & Redis Cloud" -ForegroundColor White
        Write-Host "`nSee DEPLOYMENT.md for full instructions`n" -ForegroundColor White
        
        Set-Location ..
    }
    "2" {
        Write-Host "`n📖 Full Deployment Guide`n" -ForegroundColor Cyan
        Write-Host "Please follow these steps:`n" -ForegroundColor White
        
        Write-Host "1️⃣  Setup Databases:" -ForegroundColor Yellow
        Write-Host "   MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
        Write-Host "   Redis Cloud: https://redis.com/try-free/`n" -ForegroundColor White
        
        Write-Host "2️⃣  Deploy Backend:" -ForegroundColor Yellow
        Write-Host "   Railway: https://railway.app/ (Recommended)" -ForegroundColor White
        Write-Host "   Render: https://render.com/ (Completely Free)`n" -ForegroundColor White
        
        Write-Host "3️⃣  Deploy Frontend:" -ForegroundColor Yellow
        Write-Host "   Run this script again and choose option 1" -ForegroundColor White
        Write-Host "   OR push to GitHub and connect to Vercel`n" -ForegroundColor White
        
        Write-Host "4️⃣  Configure Environment Variables:" -ForegroundColor Yellow
        Write-Host "   Vercel Dashboard > Your Project > Settings > Environment Variables`n" -ForegroundColor White
        
        Write-Host "📚 For detailed instructions, see:" -ForegroundColor Cyan
        Write-Host "   DEPLOYMENT.md in the project root`n" -ForegroundColor White
        
        Write-Host "Would you like to open DEPLOYMENT.md? (y/n)" -ForegroundColor Yellow
        $openDoc = Read-Host
        if ($openDoc -eq "y") {
            Start-Process "DEPLOYMENT.md"
        }
    }
    "3" {
        Write-Host "`n👋 Deployment cancelled.`n" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "`n❌ Invalid choice. Exiting.`n" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✨ Setup complete!`n" -ForegroundColor Green
