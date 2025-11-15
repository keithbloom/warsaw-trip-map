# Quick Start Guide - Warsaw Trip Map

## 🚀 Immediate Use (No Setup Required)

1. Download the `warsaw-trip-map` folder
2. Open `index.html` in your web browser
3. Enter access key: **warsaw2026family**
4. Start planning your trip!

## 🌐 To Share with Family via GitHub

### Step 1: Create Private GitHub Repository

1. Go to https://github.com/new
2. Repository name: `warsaw-trip-map` (or any name you prefer)
3. **IMPORTANT**: Select "Private" (not Public)
4. Do NOT initialize with README
5. Click "Create repository"

### Step 2: Upload Your Files

In your terminal/command prompt, navigate to the downloaded folder and run:

```bash
cd warsaw-trip-map
git remote add origin https://github.com/YOUR-USERNAME/warsaw-trip-map.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in the left sidebar
4. Under "Source": select "main" branch
5. Click "Save"
6. Wait 1-2 minutes for deployment

### Step 4: Share the Link

Your map will be available at:
```
https://YOUR-USERNAME.github.io/warsaw-trip-map/?key=warsaw2026family
```

Send this link to your family. The `?key=warsaw2026family` part logs them in automatically!

## 🔒 Security Note

- The repository is PRIVATE - only you can see the code
- The GitHub Pages site is PUBLIC but protected by the access key
- To make it more secure, change the access key in `index.html`:
  - Open `index.html` in a text editor
  - Find: `const TRIP_KEY = 'warsaw2026family';`
  - Change to: `const TRIP_KEY = 'your-secret-key-here';`
  - Update the URL you share accordingly

## 💡 Features to Try

✅ **Click two locations** to see walking/driving routes  
✅ **Add visit times** by clicking "+ Add Visit" on any location  
✅ **Click map markers** to see details and website links  
✅ **Zoom and pan** the map to explore Warsaw  
✅ **View on mobile** - it's fully responsive!  

## 🆘 Need Help?

**Map won't load?**
- Make sure you're opening `index.html` (not `map.html` directly)
- Try a different browser (Chrome, Firefox, Safari, Edge all work)

**Routes not calculating?**
- Make sure you have internet connection (needed for routing service)
- Try clicking on two locations that are closer together first

**Changes not saving?**
- Visit times are saved in your browser's localStorage
- Don't clear browser cache if you want to keep your schedule
- To share your schedule, you'd need to export/import (future feature)

## 📝 Customization Tips

**Change the access key** (recommended for better privacy):
- Edit `index.html`, line ~61
- Change `'warsaw2026family'` to your own secret phrase

**Add more locations**:
- Edit `locations.js`
- Copy an existing location entry and modify the details
- Get coordinates from Google Maps (right-click → coordinates)

**Change colors/styling**:
- Edit the `<style>` section in `map.html`
- Modify colors, fonts, spacing as you prefer

---

**Enjoy planning your Warsaw trip! 🇵🇱 ✈️**
