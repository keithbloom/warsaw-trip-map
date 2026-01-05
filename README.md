# Warsaw Trip Map - January 2026

An [interactive map](https://keithbloom.github.io/warsaw-trip-map/) for planning your Warsaw city break from **Thursday 8 to Sunday 11 January 2026**.

## 🌟 Features

- **Interactive Map**: All tourist destinations, restaurants, museums, and activities marked with custom icons
- **Route Planning**: Select any two locations to see:
  - Walking distance and estimated time
  - Driving distance and estimated time
  - Visual route on the map
- **Visit Scheduling**: Add date/time for when you plan to visit each location
- **Clean Interface**: Organized by category with minimal clutter
- **Private Access**: Protected with a simple access key system
- **Mobile Friendly**: Works on desktop, tablet, and mobile devices

## 🔐 Access

The map is protected with an access key for privacy.

**Access Key**: `warsaw2026family`

### Ways to Access:

1. **Direct URL with key**: 
   ```
   https://yourusername.github.io/warsaw-trip-map/?key=warsaw2026family
   ```
   This automatically logs you in.

2. **Manual entry**:
   Visit the main URL and enter the access key when prompted.

### Changing the Access Key

To change the access key, edit `index.html` and modify this line:
```javascript
const TRIP_KEY = 'warsaw2026family';
```

Replace `'warsaw2026family'` with your preferred key.

## 🚀 Setup & Deployment

### Option 1: GitHub Pages (Recommended for Sharing)

1. **Create a Private GitHub Repository**:
   ```bash
   # In the project directory
   git add .
   git commit -m "Initial commit: Warsaw trip map"
   git remote add origin https://github.com/YOUR-USERNAME/warsaw-trip-map.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Your map will be available at: `https://YOUR-USERNAME.github.io/warsaw-trip-map/`

3. **Share with Family**:
   Send them the link with the key parameter:
   ```
   https://YOUR-USERNAME.github.io/warsaw-trip-map/?key=warsaw2026family
   ```

### Option 2: Local Use

Simply open `index.html` in your web browser. No server required!

## 📍 Included Locations

### 🏨 Accommodation
- **Puro Hotel Warsaw Old Town** - Your hotel option in the Old Town

### 🏛️ Museums & Attractions
- Royal Palace
- Museum of Warsaw Uprising
- Polish Vodka Museum (with tasting)
- POLIN Museum of History of Polish Jews
- Museum of Life Under Communism
- Neon Museum
- Wilanów Palace (10km from centre)

### 🍽️ Restaurants & Food
- Hala Koszyki Food Hall
- Restauracja Zapiecek (Best pierogi in Old Town)
- Nobu Restaurant (High-end dining)
- Ramenownia (Recommended ramen)

### ☕ Cafés & Drinks
- E.Wedel Flagship Store (Best hot chocolate, 8 Szpitalna Street)

### 🎭 Activities
- Black Cat Escape Room (Warsaw Uprising theme)
- Communist Tour
- Nowy Świat Street (Main boulevard for coffee and food)

## 💡 How to Use

1. **Browse Locations**: Scroll through the sidebar to see all destinations organized by category
2. **View on Map**: Click on any marker to see details and website link
3. **Calculate Routes**:
   - Click on two locations in the sidebar
   - See walking/driving distances automatically calculated
   - View the route drawn on the map
4. **Schedule Visits**:
   - Click "+ Add Visit" on any location
   - Enter date and time
   - Your schedule is saved in your browser
5. **Navigate**: Click on website links to open booking/information pages

## 🛠️ Admin Mode - Managing Locations

**Admin mode** allows you to add, edit, and delete locations through the UI without touching code.

### Accessing Admin Mode

1. Open the map (you must be logged in with the access key)
2. Click the **"Edit Mode"** button in the sidebar header
3. The interface changes to show editing controls

### Adding a New Location

1. Enter admin mode
2. Click **"+ Add Location"** at the top of the locations list
3. **Search for the address**:
   - Type the location name or address (e.g., "Copernicus Science Centre, Warsaw")
   - Click "Search" or press Enter
   - Select the correct result from the dropdown
4. **Fill in details**:
   - Name (pre-filled from search, but editable)
   - Category (hotel, museum, restaurant, cafe, activity, poi)
   - Icon (emoji like 🏛️ or 🍽️)
   - Coordinates (auto-filled from search, but editable)
   - Website URL (optional)
   - Notes (optional)
5. Watch the preview marker appear on the map as you type coordinates
6. Click **"Save Location"**

### Editing an Existing Location

1. Enter admin mode
2. Click the **✏️ Edit** button on any location
3. Modify any fields in the modal
4. Click **"Save Location"**

### Deleting a Location

1. Enter admin mode
2. Click the **🗑️ Delete** button on any location
3. Confirm the deletion in the dialog
4. The location is removed from the map and sidebar

**Note:** You cannot delete a location that's currently selected for routing. Clear the selection first.

### Saving Your Changes

**Important:** Changes are only in memory until you download and deploy the JSON file.

1. After making changes, notice the **"• Unsaved changes"** indicator
2. Click **"⬇️ Download locations.json"** (the button will pulse if there are unsaved changes)
3. The file downloads to your browser's download folder
4. **Deploy the changes**:
   ```bash
   # Move the downloaded file to your project
   mv ~/Downloads/locations.json public/locations.json

   # Commit and push
   git add public/locations.json
   git commit -m "Update locations from admin UI"
   git push origin main
   ```
5. GitHub Actions will automatically deploy the changes

### Tips

- **Address search** uses OpenStreetMap's Nominatim service - be specific with addresses
- **Icon field** accepts any emoji - copy from your system's emoji picker or websites like [Emojipedia](https://emojipedia.org/)
- **Preview markers** (orange, pulsing) show where locations will appear while editing
- **Changes are local** until you download and deploy - you can safely experiment
- **Exit edit mode** to return to the clean trip-planning interface

## 🛠️ Technical Details

- **Map Provider**: OpenStreetMap via Leaflet.js
- **Routing**: Leaflet Routing Machine (using OSRM)
- **Data Storage**: Browser localStorage (your visit times are saved locally) + JSON file (location data)
- **No Server Required**: Pure client-side application
- **Privacy**: All data stays in your browser

## 🔧 Customization

### Adding New Locations

Edit `locations.js` and add a new entry:

```javascript
{
    id: 'unique-id',
    name: 'Location Name',
    category: 'museum', // hotel, museum, restaurant, cafe, activity, poi
    icon: '🏛️', // Choose an appropriate emoji
    lat: 52.2330,
    lng: 21.0106,
    url: 'https://website.com',
    notes: 'Additional notes',
    visit: null
}
```

### Customizing Appearance

Edit the `<style>` section in `map.html` to change colors, fonts, or layout.

## 📱 Mobile Tips

- Pinch to zoom on the map
- Tap markers to see details
- Route information scrolls in the sidebar
- Works offline after first load (cached in browser)

## 🗓️ Trip Details

- **Dates**: Thursday 8 January - Sunday 11 January 2026
- **Location**: Warsaw, Poland
- **Hotel**: Puro Hotel Warsaw Old Town (if affordable)
- **Key Experiences**: 
  - Historical museums (Uprising, Communist era, Jewish history)
  - Traditional Polish food (especially pierogi)
  - Best hot chocolate at E.Wedel
  - Escape room experience
  - Palace visits

## 📝 Notes

- Wilanów Palace is 10km outside the city centre - plan extra travel time
- Restauracja Zapiecek can be touristy but is highly recommended for pierogi
- Nowy Świat Street is great for casual coffee and meals
- Several museums may have reduced hours in January - check websites before visiting
- Book the Vodka Museum tour and Escape Room in advance

## 🤝 Contributing

Family members can suggest new locations by:
1. Finding the place on Google Maps
2. Sharing the coordinates or address
3. Suggesting the category and any notes

## 📄 License

Private family use only.

---

**Enjoy your Warsaw adventure! 🇵🇱**
