#!/bin/bash

# GitHub Setup Script for Warsaw Trip Map
# This script helps you set up your private GitHub repository

echo "🗺️  Warsaw Trip Map - GitHub Setup"
echo "===================================="
echo ""

# Check if git is configured
if ! git config user.name > /dev/null; then
    echo "⚠️  Git is not configured. Please set up your Git identity first:"
    echo ""
    echo "git config --global user.name \"Your Name\""
    echo "git config --global user.email \"your.email@example.com\""
    echo ""
    exit 1
fi

echo "Current Git user: $(git config user.name) <$(git config user.email)>"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "map.html" ]; then
    echo "❌ Error: Please run this script from the warsaw-trip-map directory"
    exit 1
fi

# Check if remote already exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists:"
    git remote get-url origin
    echo ""
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub username: " username
        read -p "Enter repository name [warsaw-trip-map]: " reponame
        reponame=${reponame:-warsaw-trip-map}
        git remote set-url origin "https://github.com/$username/$reponame.git"
    else
        exit 0
    fi
else
    echo "📝 Let's set up your GitHub repository!"
    echo ""
    read -p "Enter your GitHub username: " username
    read -p "Enter repository name [warsaw-trip-map]: " reponame
    reponame=${reponame:-warsaw-trip-map}
    
    echo ""
    echo "🔗 Your repository URL will be:"
    echo "   https://github.com/$username/$reponame"
    echo ""
    read -p "Is this correct? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
    
    git remote add origin "https://github.com/$username/$reponame.git"
fi

# Prepare for push
echo ""
echo "✅ Git remote configured!"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Create a PRIVATE repository on GitHub:"
echo "   https://github.com/new"
echo "   - Repository name: $reponame"
echo "   - Make it PRIVATE"
echo "   - Do NOT initialize with README"
echo ""
echo "2. Then run these commands:"
echo ""
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   - Go to repository Settings → Pages"
echo "   - Source: main branch"
echo "   - Save"
echo ""
echo "4. Share this link with your family:"
echo "   https://$username.github.io/$reponame/?key=warsaw2026family"
echo ""
echo "📋 These instructions have been saved to GITHUB_SETUP_COMMANDS.txt"

# Save instructions to file
cat > GITHUB_SETUP_COMMANDS.txt << EOF
GitHub Setup Commands for Warsaw Trip Map
==========================================

1. Create Private Repository
   Go to: https://github.com/new
   - Name: $reponame
   - Privacy: PRIVATE ✓
   - Do NOT initialize with README

2. Push Your Code
   Run these commands in the terminal:

   git branch -M main
   git push -u origin main

3. Enable GitHub Pages
   In your repository:
   - Click "Settings" tab
   - Click "Pages" in sidebar
   - Under "Source": select "main" branch
   - Click "Save"
   - Wait 1-2 minutes

4. Share With Family
   Your map URL (copy and share):

   https://$username.github.io/$reponame/?key=warsaw2026family

   The ?key= parameter logs them in automatically!

5. Optional: Change Access Key
   For better security, edit index.html:
   - Find: const TRIP_KEY = 'warsaw2026family';
   - Change to your own secret key
   - Update the shared URL with new key

Need Help?
- Check README.md for detailed instructions
- See QUICK_START.md for troubleshooting
EOF

echo "✅ Setup complete!"
