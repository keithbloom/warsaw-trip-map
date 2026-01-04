# Location Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add admin UI to dynamically add, edit, and delete locations with JSON export capability

**Architecture:** Migrate from JS module to JSON data file, add edit mode toggle in UI, implement modal-based CRUD operations with Nominatim geocoding, export changes as downloadable JSON for manual deployment

**Tech Stack:** Vanilla JavaScript, Leaflet.js, Nominatim geocoding API, Blob API for downloads

---

## Task 1: Migrate Location Data to JSON

**Files:**
- Create: `public/locations.json`
- Modify: `src/main.js:5-6` (change import to fetch)
- Delete: `src/locations.js` (after migration complete)

**Step 1: Create locations.json with existing data**

Create `public/locations.json`:

```json
[
  {
    "id": "hotel",
    "name": "Puro Hotel Warsaw Old Town",
    "category": "hotel",
    "icon": "🏨",
    "lat": 52.2496,
    "lng": 21.0082,
    "url": "https://purohotel.pl/en/warsaw-city/warsaw-old-town/rooms/",
    "notes": "Our hotel if we can afford it"
  },
  {
    "id": "royal-palace",
    "name": "Royal Palace",
    "category": "museum",
    "icon": "🏛️",
    "lat": 52.2477,
    "lng": 21.0145,
    "url": "https://www.zamek-krolewski.pl/en/godziny-otwarcia-i-ceny-biletow",
    "notes": "Historic royal residence"
  },
  {
    "id": "warsaw-uprising",
    "name": "Museum of Warsaw Uprising",
    "category": "museum",
    "icon": "🏛️",
    "lat": 52.232,
    "lng": 20.9802,
    "url": "https://www.1944.pl/en/article/visit-us,4993.html",
    "notes": "WWII history museum"
  },
  {
    "id": "vodka-museum",
    "name": "Polish Vodka Museum",
    "category": "museum",
    "icon": "🏛️",
    "lat": 52.2526,
    "lng": 21.0417,
    "url": "https://muzeumpolskiejwodki.pl/en/tours-and-tasting/standard/",
    "notes": "Tours and tasting available"
  },
  {
    "id": "polin",
    "name": "POLIN Museum of History of Polish Jews",
    "category": "museum",
    "icon": "🏛️",
    "lat": 52.2496,
    "lng": 20.9933,
    "url": "https://bilety.polin.pl/index.html?lang=en",
    "notes": "Jewish history and culture"
  },
  {
    "id": "communist-museum",
    "name": "Museum of Life Under Communism",
    "category": "museum",
    "icon": "🏛️",
    "lat": 52.2318,
    "lng": 21.0065,
    "url": "https://mzprl.pl/wizyta/?lang=en",
    "notes": "Communist era exhibition"
  },
  {
    "id": "neon-museum",
    "name": "Neon Museum",
    "category": "museum",
    "icon": "🏛️",
    "lat": 52.2443,
    "lng": 20.9819,
    "url": "https://www.neonmuzeum.org/visit-museum",
    "notes": "Vintage neon signs"
  },
  {
    "id": "wilanow-palace",
    "name": "Wilanów Palace",
    "category": "museum",
    "icon": "🏛️",
    "lat": 52.1654,
    "lng": 21.091,
    "url": "https://wilanow-palac.pl/palac",
    "notes": "10km outside city centre"
  },
  {
    "id": "escape-room",
    "name": "Black Cat Escape Room - Warsaw Uprising",
    "category": "activity",
    "icon": "🎭",
    "lat": 52.2324,
    "lng": 21.0119,
    "url": "https://blackcat.pl/en/pokoje/warsaw-uprising",
    "notes": "Warsaw Uprising themed"
  },
  {
    "id": "wedel",
    "name": "E.Wedel Flagship Store",
    "category": "cafe",
    "icon": "☕",
    "lat": 52.2362,
    "lng": 21.0105,
    "url": null,
    "notes": "Best hot chocolate - 8 Szpitalna Street"
  },
  {
    "id": "koszyki",
    "name": "Hala Koszyki Food Hall",
    "category": "restaurant",
    "icon": "🍽️",
    "lat": 52.2245,
    "lng": 21.0184,
    "url": "https://koszyki.com/uslugi/restauracje/?lang=en",
    "notes": "Indoor food market"
  },
  {
    "id": "zapiecek",
    "name": "Restauracja Zapiecek",
    "category": "restaurant",
    "icon": "🍽️",
    "lat": 52.249,
    "lng": 21.012,
    "url": "http://www.restauracjazapiecek.pl/eng/menu.php",
    "notes": "Best pierogi in Old Town - touristy but highly recommended"
  },
  {
    "id": "nobu",
    "name": "Nobu Restaurant",
    "category": "restaurant",
    "icon": "🍽️",
    "lat": 52.2286,
    "lng": 21.0053,
    "url": "https://www.nobuhotels.com/warsaw/dining/nobu-restaurant/",
    "notes": "High-end Japanese-Peruvian fusion"
  },
  {
    "id": "ramenownia",
    "name": "Ramenownia",
    "category": "restaurant",
    "icon": "🍽️",
    "lat": 52.2301,
    "lng": 21.0152,
    "url": "https://warsawinsider.pl/ramenownia/",
    "notes": "Recommended ramen spot"
  },
  {
    "id": "nowy-swiat",
    "name": "Nowy Świat Street",
    "category": "poi",
    "icon": "📍",
    "lat": 52.234,
    "lng": 21.0175,
    "url": null,
    "notes": "Good place for coffee and eating - main boulevard"
  },
  {
    "id": "communist-tour",
    "name": "Communist Tour Starting Point",
    "category": "activity",
    "icon": "🎭",
    "lat": 52.2297,
    "lng": 21.0122,
    "url": "https://abpoland.com/tours/communist-tour-in-warsaw",
    "notes": "Guided communist history tour"
  }
]
```

**Step 2: Modify main.js to fetch JSON instead of import**

In `src/main.js`, replace line 5:
```javascript
import { locations } from './locations.js';
```

With:
```javascript
let locations = [];
let isEditMode = false;
let hasUnsavedChanges = false;
```

**Step 3: Add async initialization function**

Add this function at the end of `src/main.js` (after line 311):

```javascript
// Initialize app by loading locations
async function initializeApp() {
    try {
        const response = await fetch('/locations.json');
        if (!response.ok) {
            throw new Error('Failed to load locations');
        }
        locations = await response.json();

        // Add markers to map
        locations.forEach(location => {
            const marker = L.marker([location.lat, location.lng], {
                icon: createCustomIcon(location.icon)
            }).addTo(map);

            let popupContent = `
                <div class="popup-name">${location.name}</div>
                <div class="popup-category">${location.category}</div>
            `;

            if (location.notes) {
                popupContent += `<div style="margin-top: 6px; font-size: 12px; color: #666;">${location.notes}</div>`;
            }

            if (location.url) {
                popupContent += `<a href="${location.url}" target="_blank" class="popup-link">Visit Website →</a>`;
            }

            marker.bindPopup(popupContent);
            markers[location.id] = marker;

            marker.on('click', () => {
                toggleLocationSelection(location);
            });
        });

        // Initialize locations list
        renderLocationsList();

        // Fit map to show all markers
        const group = new L.featureGroup(Object.values(markers));
        map.fitBounds(group.getBounds().pad(0.1));

        // Store default bounds for reset zoom
        const defaultBounds = group.getBounds().pad(0.1);

        // Reset zoom button handler
        document.getElementById('reset-zoom-btn').addEventListener('click', function() {
            map.fitBounds(defaultBounds);
        });
    } catch (error) {
        console.error('Error loading locations:', error);
        alert('Failed to load locations. Please refresh the page.');
    }
}

// Start the app
initializeApp();
```

**Step 4: Remove old initialization code**

In `src/main.js`, delete lines 85-111 (the forEach loop that adds markers) and lines 299-311 (old initialization code).

**Step 5: Test the migration**

Run: `npm run dev`

Expected:
- Browser opens to http://localhost:5173
- Map loads with all markers
- No console errors
- All existing functionality works (routing, tile switching)

**Step 6: Commit**

```bash
git add public/locations.json src/main.js
git commit -m "feat: migrate location data from JS module to JSON file

- Create public/locations.json with all existing locations
- Update main.js to fetch JSON on app initialization
- Maintain all existing functionality
- Prepare for dynamic location management"
```

---

## Task 2: Add Admin Mode Toggle

**Files:**
- Modify: `index.html:80-86` (add edit mode button to sidebar)
- Modify: `src/main.js` (add toggle function)
- Modify: `src/style.css` (add edit mode styles)

**Step 1: Add edit mode button to HTML**

In `index.html`, replace lines 80-86:
```html
<div class="section">
    <h3>Select Two Locations</h3>
```

With:
```html
<div class="section">
    <div class="sidebar-header">
        <h3>Select Two Locations</h3>
        <button id="edit-mode-toggle" class="edit-mode-toggle">Edit Mode</button>
    </div>
    <div id="edit-mode-indicator" class="edit-mode-indicator" style="display: none;">
        ✏️ EDIT MODE
        <span id="unsaved-indicator" style="display: none;">• Unsaved changes</span>
    </div>
```

And update the closing:
```html
</div>
```

**Step 2: Add CSS for edit mode**

Add to end of `src/style.css`:

```css
.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.edit-mode-toggle {
    padding: 6px 12px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.2s;
}

.edit-mode-toggle:hover {
    background: #1976D2;
}

.edit-mode-toggle.active {
    background: #FF9800;
}

.edit-mode-toggle.active:hover {
    background: #F57C00;
}

.edit-mode-indicator {
    background: #FFF3CD;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 13px;
    font-weight: 600;
    color: #856404;
    border-left: 4px solid #FF9800;
}

.location-item-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.edit-btn, .delete-btn {
    padding: 4px 8px;
    border: none;
    border-radius: 3px;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.2s;
}

.edit-btn {
    background: #2196F3;
    color: white;
}

.edit-btn:hover {
    background: #1976D2;
}

.delete-btn {
    background: #f44336;
    color: white;
}

.delete-btn:hover {
    background: #d32f2f;
}

.add-location-btn {
    width: 100%;
    padding: 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 15px;
    transition: background 0.2s;
}

.add-location-btn:hover {
    background: #45a049;
}

.download-json-btn {
    width: 100%;
    padding: 10px;
    background: #FF9800;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 15px;
    transition: background 0.2s;
}

.download-json-btn:hover {
    background: #F57C00;
}

.download-json-btn.has-changes {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
```

**Step 3: Add toggle function in main.js**

Add this function before `initializeApp()` in `src/main.js`:

```javascript
// Toggle edit mode
function toggleEditMode() {
    isEditMode = !isEditMode;
    const toggleBtn = document.getElementById('edit-mode-toggle');
    const indicator = document.getElementById('edit-mode-indicator');

    if (isEditMode) {
        toggleBtn.classList.add('active');
        toggleBtn.textContent = 'Exit Edit Mode';
        indicator.style.display = 'block';
    } else {
        toggleBtn.classList.remove('active');
        toggleBtn.textContent = 'Edit Mode';
        indicator.style.display = 'none';
    }

    // Re-render to show/hide edit controls
    renderLocationsList();
}

// Make function globally available
window.toggleEditMode = toggleEditMode;
```

**Step 4: Update renderLocationsList to show edit controls**

In `src/main.js`, modify the `renderLocationsList` function. After line 164 (the innerHTML assignment for location items), add:

```javascript
item.innerHTML = `
    <div class="location-name">${location.icon} ${location.name}</div>
`;

// Add edit controls if in edit mode
if (isEditMode) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'location-item-actions';
    actionsDiv.innerHTML = `
        <button class="edit-btn" onclick="editLocation('${location.id}')">✏️ Edit</button>
        <button class="delete-btn" onclick="deleteLocation('${location.id}')">🗑️ Delete</button>
    `;
    item.appendChild(actionsDiv);
}
```

Also add admin controls at the top of the locations list. In `renderLocationsList`, before the `Object.keys(categoryNames).forEach` loop (around line 141), add:

```javascript
// Add admin controls if in edit mode
if (isEditMode) {
    const adminControls = document.createElement('div');
    adminControls.innerHTML = `
        <button class="add-location-btn" onclick="openAddLocationModal()">+ Add Location</button>
        <button class="download-json-btn ${hasUnsavedChanges ? 'has-changes' : ''}" onclick="downloadLocationsJSON()">
            ⬇️ Download locations.json
        </button>
    `;
    container.appendChild(adminControls);
}
```

**Step 5: Add event listener in initializeApp**

In `src/main.js`, add to `initializeApp()` after the reset-zoom button listener:

```javascript
// Edit mode toggle handler
document.getElementById('edit-mode-toggle').addEventListener('click', toggleEditMode);
```

**Step 6: Test edit mode toggle**

Run: `npm run dev`

Expected:
- "Edit Mode" button appears in sidebar header
- Clicking it shows "EDIT MODE" indicator with orange background
- Button changes to "Exit Edit Mode"
- Edit/delete buttons appear on each location
- "+ Add Location" and "Download" buttons appear at top
- Clicking "Exit Edit Mode" hides all admin controls

**Step 7: Commit**

```bash
git add index.html src/main.js src/style.css
git commit -m "feat: add admin mode toggle to sidebar

- Add Edit Mode button to sidebar header
- Show/hide edit controls based on mode
- Display edit and delete buttons on location items
- Add 'Add Location' and 'Download JSON' buttons
- Visual indicator for edit mode active state"
```

---

## Task 3: Add Location Modal Structure

**Files:**
- Modify: `index.html:89` (add modal before closing body tag)
- Modify: `src/style.css` (add modal styles)

**Step 1: Add modal HTML**

In `index.html`, add before line 91 (`<script type="module" src="/src/main.js"></script>`):

```html
<!-- Location Management Modal -->
<div id="location-modal" class="modal-overlay">
    <div class="modal-content">
        <button class="modal-close" onclick="closeLocationModal()">✕</button>
        <h3 id="modal-title">Add Location</h3>

        <form id="location-form" onsubmit="saveLocation(event)">
            <!-- Address Search -->
            <div class="form-group">
                <label for="address-search">Search Address</label>
                <div class="search-container">
                    <input type="text" id="address-search" placeholder="e.g., Copernicus Science Centre, Warsaw">
                    <button type="button" class="search-btn" onclick="searchAddress()">Search</button>
                </div>
                <div id="search-results" class="search-results"></div>
                <div id="search-error" class="search-error"></div>
            </div>

            <!-- Location Details -->
            <div class="form-group">
                <label for="location-name">Name *</label>
                <input type="text" id="location-name" required>
            </div>

            <div class="form-group">
                <label for="location-category">Category *</label>
                <select id="location-category" required>
                    <option value="">Select category...</option>
                    <option value="hotel">Hotel</option>
                    <option value="museum">Museum/Palace</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="cafe">Café</option>
                    <option value="activity">Activity</option>
                    <option value="poi">Point of Interest</option>
                </select>
            </div>

            <div class="form-group">
                <label for="location-icon">Icon (emoji) *</label>
                <input type="text" id="location-icon" placeholder="🏛️" maxlength="2" required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="location-lat">Latitude *</label>
                    <input type="number" id="location-lat" step="0.000001" min="-90" max="90" required>
                </div>
                <div class="form-group">
                    <label for="location-lng">Longitude *</label>
                    <input type="number" id="location-lng" step="0.000001" min="-180" max="180" required>
                </div>
            </div>

            <div class="form-group">
                <label for="location-url">Website URL</label>
                <input type="url" id="location-url" placeholder="https://example.com">
            </div>

            <div class="form-group">
                <label for="location-notes">Notes</label>
                <textarea id="location-notes" rows="3" placeholder="Additional information"></textarea>
            </div>

            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeLocationModal()">Cancel</button>
                <button type="submit" class="btn-save">Save Location</button>
            </div>
        </form>
    </div>
</div>
```

**Step 2: Add modal CSS**

Add to end of `src/style.css`:

```css
/* Modal Styles */
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.modal-overlay.active {
    display: flex;
}

.modal-content {
    background: white;
    border-radius: 8px;
    padding: 30px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
}

.modal-close:hover {
    color: #333;
}

.modal-content h3 {
    margin-bottom: 20px;
    color: #333;
    font-size: 20px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 13px;
    color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #2196F3;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.search-container {
    display: flex;
    gap: 8px;
}

.search-container input {
    flex: 1;
}

.search-btn {
    padding: 10px 20px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
}

.search-btn:hover {
    background: #1976D2;
}

.search-results {
    margin-top: 8px;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    display: none;
}

.search-results.active {
    display: block;
}

.search-result-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    font-size: 13px;
}

.search-result-item:last-child {
    border-bottom: none;
}

.search-result-item:hover {
    background: #f0f0f0;
}

.search-result-name {
    font-weight: 600;
    color: #333;
}

.search-result-address {
    color: #666;
    font-size: 12px;
    margin-top: 2px;
}

.search-error {
    margin-top: 8px;
    padding: 10px;
    background: #ffebee;
    border: 1px solid #ef5350;
    border-radius: 4px;
    color: #c62828;
    font-size: 13px;
    display: none;
}

.search-error.active {
    display: block;
}

.form-actions {
    display: flex;
    gap: 10px;
    margin-top: 24px;
    justify-content: flex-end;
}

.btn-cancel, .btn-save {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-cancel {
    background: #f5f5f5;
    color: #333;
}

.btn-cancel:hover {
    background: #e0e0e0;
}

.btn-save {
    background: #4CAF50;
    color: white;
}

.btn-save:hover {
    background: #45a049;
}

/* Preview marker styles */
.preview-marker {
    animation: markerPulse 1.5s infinite;
}

@keyframes markerPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
}

/* Mobile responsive */
@media (max-width: 600px) {
    .modal-content {
        padding: 20px;
        max-height: 95vh;
    }

    .form-row {
        grid-template-columns: 1fr;
    }
}
```

**Step 3: Test modal HTML/CSS**

Run: `npm run dev`

Expected:
- Page loads normally
- Modal is not visible (display: none by default)
- No console errors
- No visual changes to existing UI

**Step 4: Commit**

```bash
git add index.html src/style.css
git commit -m "feat: add location management modal structure

- Create modal overlay with form for add/edit locations
- Include address search field with results display
- Add all location fields (name, category, icon, coordinates, URL, notes)
- Style modal with responsive design
- Add preview marker animation styles"
```

---

## Task 4: Implement Modal Open/Close Logic

**Files:**
- Modify: `src/main.js` (add modal functions)

**Step 1: Add global state for modal**

In `src/main.js`, add after the `hasUnsavedChanges` variable declaration:

```javascript
let currentEditingLocationId = null;
let previewMarker = null;
```

**Step 2: Add modal management functions**

Add these functions before `initializeApp()` in `src/main.js`:

```javascript
// Open modal for adding new location
function openAddLocationModal() {
    currentEditingLocationId = null;
    document.getElementById('modal-title').textContent = 'Add Location';
    document.getElementById('location-form').reset();
    document.getElementById('search-results').classList.remove('active');
    document.getElementById('search-error').classList.remove('active');
    document.getElementById('location-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open modal for editing existing location
function editLocation(locationId) {
    currentEditingLocationId = locationId;
    const location = locations.find(loc => loc.id === locationId);

    if (!location) return;

    document.getElementById('modal-title').textContent = 'Edit Location';
    document.getElementById('location-name').value = location.name;
    document.getElementById('location-category').value = location.category;
    document.getElementById('location-icon').value = location.icon;
    document.getElementById('location-lat').value = location.lat;
    document.getElementById('location-lng').value = location.lng;
    document.getElementById('location-url').value = location.url || '';
    document.getElementById('location-notes').value = location.notes || '';

    document.getElementById('search-results').classList.remove('active');
    document.getElementById('search-error').classList.remove('active');
    document.getElementById('location-modal').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Create preview marker
    createPreviewMarker(location.lat, location.lng, location.icon);
}

// Close modal
function closeLocationModal() {
    document.getElementById('location-modal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('location-form').reset();
    document.getElementById('search-results').classList.remove('active');
    document.getElementById('search-error').classList.remove('active');

    // Remove preview marker if exists
    if (previewMarker) {
        map.removeLayer(previewMarker);
        previewMarker = null;
    }
}

// Create or update preview marker
function createPreviewMarker(lat, lng, icon) {
    // Remove existing preview
    if (previewMarker) {
        map.removeLayer(previewMarker);
    }

    // Create new preview marker with pulsing style
    const previewIcon = L.divIcon({
        html: `<div class="preview-marker" style="font-size: 30px;">${icon}</div>`,
        className: 'custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });

    previewMarker = L.marker([lat, lng], { icon: previewIcon }).addTo(map);

    // Pan map to show preview
    map.setView([lat, lng], Math.max(map.getZoom(), 14));
}

// Make functions globally available
window.openAddLocationModal = openAddLocationModal;
window.editLocation = editLocation;
window.closeLocationModal = closeLocationModal;
```

**Step 3: Add ESC key and backdrop click handlers**

Add to `initializeApp()` function:

```javascript
// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('location-modal');
        if (modal.classList.contains('active')) {
            closeLocationModal();
        }
    }
});

// Close modal on backdrop click
document.getElementById('location-modal').addEventListener('click', (e) => {
    if (e.target.id === 'location-modal') {
        closeLocationModal();
    }
});
```

**Step 4: Add coordinate change handlers for preview**

Add these event listeners to `initializeApp()`:

```javascript
// Update preview marker when coordinates change
document.getElementById('location-lat').addEventListener('input', updatePreviewFromCoordinates);
document.getElementById('location-lng').addEventListener('input', updatePreviewFromCoordinates);
document.getElementById('location-icon').addEventListener('input', updatePreviewFromCoordinates);

function updatePreviewFromCoordinates() {
    const lat = parseFloat(document.getElementById('location-lat').value);
    const lng = parseFloat(document.getElementById('location-lng').value);
    const icon = document.getElementById('location-icon').value || '📍';

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        createPreviewMarker(lat, lng, icon);
    }
}
```

**Step 5: Test modal open/close**

Run: `npm run dev`

Expected:
- Enter edit mode
- Click "+ Add Location" - modal opens with "Add Location" title
- Click X or backdrop or ESC - modal closes
- Click edit on a location - modal opens with "Edit Location" and pre-filled data
- Preview marker appears on map when editing
- Changing coordinates/icon updates preview marker
- All close methods work (X, ESC, backdrop)

**Step 6: Commit**

```bash
git add src/main.js
git commit -m "feat: implement modal open/close logic

- Add functions to open modal for add and edit modes
- Pre-fill form when editing existing location
- Create preview marker on map during add/edit
- Support ESC key and backdrop click to close
- Update preview marker when coordinates change
- Prevent body scroll when modal is open"
```

---

## Task 5: Implement Nominatim Geocoding

**Files:**
- Modify: `src/main.js` (add geocoding function)

**Step 1: Add geocoding function with rate limiting**

Add before `initializeApp()` in `src/main.js`:

```javascript
// Debounce helper for rate limiting
let searchTimeout = null;

// Search address using Nominatim
async function searchAddress() {
    const query = document.getElementById('address-search').value.trim();
    const resultsContainer = document.getElementById('search-results');
    const errorContainer = document.getElementById('search-error');

    // Clear previous results and errors
    resultsContainer.innerHTML = '';
    resultsContainer.classList.remove('active');
    errorContainer.classList.remove('active');
    errorContainer.textContent = '';

    if (!query) {
        errorContainer.textContent = 'Please enter an address to search.';
        errorContainer.classList.add('active');
        return;
    }

    // Show loading state
    const searchBtn = document.querySelector('.search-btn');
    const originalText = searchBtn.textContent;
    searchBtn.textContent = 'Searching...';
    searchBtn.disabled = true;

    try {
        // Nominatim API call
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'WarsawTripMap/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Geocoding service unavailable');
        }

        const results = await response.json();

        if (results.length === 0) {
            errorContainer.textContent = 'No locations found for this address. Try being more specific.';
            errorContainer.classList.add('active');
        } else {
            // Display results
            results.forEach(result => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <div class="search-result-name">${result.display_name.split(',')[0]}</div>
                    <div class="search-result-address">${result.display_name}</div>
                `;

                item.addEventListener('click', () => {
                    selectSearchResult(result);
                });

                resultsContainer.appendChild(item);
            });

            resultsContainer.classList.add('active');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        errorContainer.textContent = 'Unable to reach geocoding service. Check your internet connection.';
        errorContainer.classList.add('active');
    } finally {
        searchBtn.textContent = originalText;
        searchBtn.disabled = false;
    }
}

// Select a search result and populate form
function selectSearchResult(result) {
    const name = result.display_name.split(',')[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    document.getElementById('location-name').value = name;
    document.getElementById('location-lat').value = lat;
    document.getElementById('location-lng').value = lng;

    // Set default icon if not set
    if (!document.getElementById('location-icon').value) {
        document.getElementById('location-icon').value = '📍';
    }

    // Hide search results
    document.getElementById('search-results').classList.remove('active');

    // Create preview marker
    createPreviewMarker(lat, lng, document.getElementById('location-icon').value);
}

// Make function globally available
window.searchAddress = searchAddress;
```

**Step 2: Add Enter key support for address search**

Add to `initializeApp()`:

```javascript
// Allow Enter key to trigger search
document.getElementById('address-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchAddress();
    }
});
```

**Step 3: Test geocoding**

Run: `npm run dev`

Expected:
- Enter edit mode
- Click "+ Add Location"
- Type "Copernicus Science Centre, Warsaw" in search box
- Click "Search" or press Enter
- See list of results appear
- Click on first result
- Form populates with name and coordinates
- Preview marker appears on map
- Test error cases:
  - Empty search shows error
  - Invalid address shows "No locations found"
  - Network offline shows connection error

**Step 4: Commit**

```bash
git add src/main.js
git commit -m "feat: implement Nominatim geocoding for address search

- Add searchAddress function with rate limiting
- Query Nominatim API with proper User-Agent header
- Display up to 5 search results
- Allow clicking result to populate form
- Show preview marker when result is selected
- Handle errors: empty query, no results, network failures
- Support Enter key to trigger search"
```

---

## Task 6: Implement Save Location Logic

**Files:**
- Modify: `src/main.js` (add save function)

**Step 1: Add form validation and save function**

Add before `initializeApp()` in `src/main.js`:

```javascript
// Save location (add or edit)
function saveLocation(event) {
    event.preventDefault();

    const name = document.getElementById('location-name').value.trim();
    const category = document.getElementById('location-category').value;
    const icon = document.getElementById('location-icon').value.trim() || '📍';
    const lat = parseFloat(document.getElementById('location-lat').value);
    const lng = parseFloat(document.getElementById('location-lng').value);
    const url = document.getElementById('location-url').value.trim() || null;
    const notes = document.getElementById('location-notes').value.trim() || null;

    // Validation
    if (!name) {
        alert('Please enter a location name.');
        return;
    }

    if (!category) {
        alert('Please select a category.');
        return;
    }

    if (isNaN(lat) || lat < -90 || lat > 90) {
        alert('Latitude must be between -90 and 90.');
        return;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
        alert('Longitude must be between -180 and 180.');
        return;
    }

    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        alert('URL must start with http:// or https://');
        return;
    }

    // Create or update location
    if (currentEditingLocationId) {
        // Edit existing location
        const index = locations.findIndex(loc => loc.id === currentEditingLocationId);
        if (index !== -1) {
            locations[index] = {
                ...locations[index],
                name,
                category,
                icon,
                lat,
                lng,
                url,
                notes
            };
        }
    } else {
        // Add new location
        const newId = 'loc-' + Date.now();
        locations.push({
            id: newId,
            name,
            category,
            icon,
            lat,
            lng,
            url,
            notes
        });
    }

    // Mark as having unsaved changes
    hasUnsavedChanges = true;
    document.getElementById('unsaved-indicator').style.display = 'inline';

    // Close modal
    closeLocationModal();

    // Re-render map and sidebar
    refreshMapAndSidebar();
}

// Refresh map markers and sidebar
function refreshMapAndSidebar() {
    // Clear existing markers
    Object.values(markers).forEach(marker => {
        map.removeLayer(marker);
    });

    // Clear markers object
    for (let key in markers) {
        delete markers[key];
    }

    // Re-add all markers
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng], {
            icon: createCustomIcon(location.icon)
        }).addTo(map);

        let popupContent = `
            <div class="popup-name">${location.name}</div>
            <div class="popup-category">${location.category}</div>
        `;

        if (location.notes) {
            popupContent += `<div style="margin-top: 6px; font-size: 12px; color: #666;">${location.notes}</div>`;
        }

        if (location.url) {
            popupContent += `<a href="${location.url}" target="_blank" class="popup-link">Visit Website →</a>`;
        }

        marker.bindPopup(popupContent);
        markers[location.id] = marker;

        marker.on('click', () => {
            toggleLocationSelection(location);
        });
    });

    // Re-render sidebar
    renderLocationsList();

    // Update route if needed
    updateRoute();
}

// Make function globally available
window.saveLocation = saveLocation;
```

**Step 2: Test adding a new location**

Run: `npm run dev`

Expected:
- Enter edit mode
- Click "+ Add Location"
- Search for "Warsaw National Stadium"
- Select first result
- Set category to "poi"
- Icon should be "📍"
- Click "Save Location"
- Modal closes
- New location appears in sidebar under "Points of Interest"
- New marker appears on map
- "• Unsaved changes" indicator appears
- Download button pulses

**Step 3: Test editing an existing location**

Expected:
- Click edit on "Puro Hotel Warsaw Old Town"
- Change name to "Puro Hotel Old Town"
- Change icon to "🏨"
- Click "Save Location"
- Location updates in sidebar and map
- "• Unsaved changes" indicator shows

**Step 4: Test validation**

Expected:
- Try to save with empty name - shows alert
- Try to save with no category - shows alert
- Try to save with lat = 100 - shows alert
- Try to save with lng = 200 - shows alert
- Try to save with url = "example.com" - shows alert (must have http://)

**Step 5: Commit**

```bash
git add src/main.js
git commit -m "feat: implement save location functionality

- Add form validation for all required fields
- Support both adding new and editing existing locations
- Generate unique IDs for new locations using timestamp
- Mark unsaved changes when locations are modified
- Refresh map markers and sidebar after save
- Validate coordinate ranges and URL format
- Show unsaved changes indicator in header"
```

---

## Task 7: Implement Delete Location

**Files:**
- Modify: `src/main.js` (add delete function)

**Step 1: Add delete function with confirmation**

Add before `initializeApp()` in `src/main.js`:

```javascript
// Delete location with confirmation
function deleteLocation(locationId) {
    const location = locations.find(loc => loc.id === locationId);

    if (!location) return;

    // Check if location is currently selected for routing
    if (selectedLocations.includes(locationId)) {
        alert('Cannot delete location while it\'s selected for routing. Clear selection first.');
        return;
    }

    // Confirm deletion
    if (!confirm(`Delete "${location.name}"? This cannot be undone.`)) {
        return;
    }

    // Remove from locations array
    locations = locations.filter(loc => loc.id !== locationId);

    // Mark as having unsaved changes
    hasUnsavedChanges = true;
    document.getElementById('unsaved-indicator').style.display = 'inline';

    // Refresh map and sidebar
    refreshMapAndSidebar();
}

// Make function globally available
window.deleteLocation = deleteLocation;
```

**Step 2: Test delete functionality**

Run: `npm run dev`

Expected:
- Enter edit mode
- Click delete on any location
- Confirmation dialog appears with location name
- Click "Cancel" - nothing happens
- Click delete again
- Click "OK" - location disappears from map and sidebar
- "• Unsaved changes" indicator shows
- Test protection:
  - Select two locations for routing
  - Try to delete one of them
  - Should show error: "Cannot delete location while it's selected for routing"
  - Click "Clear Selection"
  - Delete works now

**Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: implement delete location with safeguards

- Add confirmation dialog before deletion
- Prevent deletion if location is in active route
- Remove marker from map when deleted
- Update sidebar after deletion
- Mark unsaved changes indicator
- Maintain routing state integrity"
```

---

## Task 8: Implement Download JSON

**Files:**
- Modify: `src/main.js` (add download function)

**Step 1: Add download function**

Add before `initializeApp()` in `src/main.js`:

```javascript
// Download locations as JSON file
function downloadLocationsJSON() {
    try {
        // Convert locations to JSON with pretty printing
        const jsonString = JSON.stringify(locations, null, 2);

        // Create Blob
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'locations.json';

        // Trigger download
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Reset unsaved changes indicator
        hasUnsavedChanges = false;
        document.getElementById('unsaved-indicator').style.display = 'none';

        // Re-render to remove pulse animation from download button
        renderLocationsList();

        alert('locations.json downloaded successfully!\n\nNext steps:\n1. Move the file to public/locations.json\n2. Commit and push to GitHub\n3. GitHub Actions will deploy automatically');
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download locations.json. Please try again.');
    }
}

// Make function globally available
window.downloadLocationsJSON = downloadLocationsJSON;
```

**Step 2: Test download functionality**

Run: `npm run dev`

Expected:
- Enter edit mode
- Make some changes (add/edit/delete locations)
- "• Unsaved changes" indicator shows
- Download button pulses
- Click "Download locations.json"
- File downloads to browser's download folder
- Alert shows with deployment instructions
- "• Unsaved changes" indicator disappears
- Download button stops pulsing
- Open downloaded file in text editor
- Verify JSON is properly formatted with 2-space indentation
- Verify all changes are present in the file

**Step 3: Test deployment workflow**

Expected:
```bash
# Move downloaded file (adjust path to your actual download location)
mv ~/Downloads/locations.json public/locations.json

# Verify changes
cat public/locations.json

# Refresh browser - changes should be visible
```

**Step 4: Commit**

```bash
git add src/main.js
git commit -m "feat: implement JSON download functionality

- Add downloadLocationsJSON function using Blob API
- Generate pretty-printed JSON with 2-space indent
- Trigger browser download with filename 'locations.json'
- Clear unsaved changes indicator after download
- Show alert with deployment instructions
- Clean up created URLs to prevent memory leaks"
```

---

## Task 9: Update README Documentation

**Files:**
- Modify: `README.md` (add admin mode section)

**Step 1: Add admin mode documentation**

In `README.md`, add after line 102 (after "How to Use" section):

```markdown
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
```

**Step 2: Update technical details section**

In `README.md`, update line 120 to include JSON:

```markdown
- **Data Storage**: Browser localStorage (your visit times are saved locally) + JSON file (location data)
```

**Step 3: Test documentation**

Run: `npm run dev`

Expected:
- Open README.md in browser or GitHub
- Verify all steps are accurate
- Follow instructions to add/edit/delete a location
- Verify download and deployment workflow works

**Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add admin mode usage instructions to README

- Document how to access edit mode
- Explain add/edit/delete workflows
- Provide step-by-step address search guide
- Detail download and deployment process
- Add tips for using admin features
- Update technical details to mention JSON storage"
```

---

## Task 10: Testing and Bug Fixes

**Files:**
- All files (comprehensive testing)

**Step 1: Test complete add workflow**

Expected:
1. Enter edit mode
2. Add 3 new locations using address search
3. Verify markers appear on map
4. Verify locations appear in correct categories
5. Download JSON and verify all 3 are present
6. Deploy and refresh - verify locations persist

**Step 2: Test complete edit workflow**

Expected:
1. Enter edit mode
2. Edit 2 existing locations (change names, icons, categories)
3. Verify changes appear immediately
4. Download JSON and verify changes
5. Deploy and refresh - verify edits persist

**Step 3: Test complete delete workflow**

Expected:
1. Enter edit mode
2. Delete 2 locations
3. Verify markers removed from map
4. Download JSON and verify deleted locations absent
5. Deploy and refresh - verify deletions persist

**Step 4: Test routing compatibility**

Expected:
1. Select two locations for routing
2. Route displays correctly
3. Enter edit mode - route still visible
4. Try to delete a selected location - error shows
5. Clear selection - deletion works
6. Add new location - routing still works
7. Edit location coordinates - routing updates correctly

**Step 5: Test error handling**

Expected:
1. Search with empty address - error message
2. Search for nonsense text - "No locations found"
3. Disconnect internet - search shows connection error
4. Try to save with empty name - validation error
5. Try to save with lat = 999 - validation error
6. Try to save with invalid URL - validation error

**Step 6: Test mobile responsiveness**

Expected (use Chrome DevTools mobile emulation):
1. Modal is full-screen on mobile
2. Form fields are easily tappable
3. Search results are easy to click
4. Edit/delete buttons are not too small
5. Map preview works on mobile
6. Download works on mobile

**Step 7: Test keyboard shortcuts**

Expected:
1. ESC key closes modal
2. Enter key in address search triggers search
3. Tab navigation works through form fields
4. Form submission with Enter key works

**Step 8: Fix any bugs found**

Document bugs and fixes:

```bash
# For each bug fix:
git add [files]
git commit -m "fix: [description of bug and fix]"
```

**Step 9: Final smoke test**

Expected:
1. Fresh browser (clear cache)
2. Load app
3. Enter access key
4. Map loads with all locations
5. Enter edit mode
6. Add, edit, delete locations
7. Download JSON
8. Deploy changes
9. Verify all changes persist after deployment
10. Exit edit mode - clean interface
11. Test routing - works correctly
12. No console errors or warnings

**Step 10: Commit final fixes**

```bash
git add .
git commit -m "test: comprehensive testing and bug fixes complete

- Verified add/edit/delete workflows
- Tested routing compatibility
- Validated error handling
- Confirmed mobile responsiveness
- Tested keyboard shortcuts
- All features working as designed"
```

---

## Task 11: Clean Up and Delete Old Files

**Files:**
- Delete: `src/locations.js`

**Step 1: Verify JSON is working**

Run: `npm run dev`

Expected:
- App loads locations from `public/locations.json`
- All functionality works
- No console errors about missing `locations.js`

**Step 2: Delete old locations.js file**

```bash
git rm src/locations.js
git commit -m "chore: remove deprecated locations.js module

Location data now loaded from public/locations.json instead of ES module. This enables dynamic location management through the admin UI."
```

**Step 3: Final verification**

Run: `npm run build`

Expected:
- Build succeeds without errors
- No warnings about missing modules
- Dist folder contains all necessary files

Run: `npm run preview`

Expected:
- Production build works correctly
- Locations load from JSON
- All admin features work
- Routing works
- No console errors

**Step 4: Final commit and merge**

```bash
# Check git status
git status

# Should show clean working tree

# Create summary of changes
git log --oneline HEAD~11..HEAD

# All commits should be present
```

---

## Completion Checklist

**Verify all success criteria from design doc:**

- [x] Locations load from `public/locations.json` instead of JS module
- [x] Edit mode toggle works, showing/hiding admin controls
- [x] Can add new location via address search with Nominatim
- [x] Can edit existing location, updating all fields
- [x] Can delete location with confirmation dialog
- [x] Can download current locations as JSON file
- [x] All existing functionality (routing, selection, tile layers) works unchanged
- [x] UI is mobile-responsive and accessible
- [x] No console errors or warnings
- [x] README updated with admin mode instructions

**Final tasks:**
1. Test on real mobile device (not just emulator)
2. Test on different browsers (Chrome, Firefox, Safari)
3. Review all commit messages for clarity
4. Update project documentation if needed
5. Consider creating a demo video or screenshots

---

## Deployment Notes

**After implementation is complete:**

1. Merge feature branch to main:
   ```bash
   git checkout main
   git merge location-json
   git push origin main
   ```

2. GitHub Actions will automatically deploy to GitHub Pages

3. Share updated URL with family:
   ```
   https://YOUR-USERNAME.github.io/warsaw-trip-map/?key=warsaw2026family
   ```

4. Test admin mode in production:
   - Verify edit mode works on live site
   - Test adding a location
   - Download JSON
   - Deploy updated JSON
   - Verify changes appear

---

**Implementation complete! ✅**
