# Location Management Design

**Date:** 2026-01-04
**Feature:** Dynamic location editing with JSON export/import workflow

## Overview

Add UI-based location management to the Warsaw trip map, allowing locations to be added, edited, and deleted through an admin mode interface. Changes are exported as JSON for manual deployment rather than requiring backend infrastructure.

## Problem Statement

Currently, locations are hardcoded in `locations.js`. Adding or modifying locations requires:
1. Editing JavaScript code
2. Finding coordinates manually
3. Understanding the code structure
4. Committing and deploying changes

This creates friction for non-technical updates and makes it hard to maintain location data during trip planning.

## Solution Architecture

### Data Structure & Loading

**Migration to JSON:**
- Create `public/locations.json` with existing location data
- Move from ES module export to static JSON file served by Vite
- Fetch JSON on application startup instead of importing module
- Keep existing schema unchanged (no breaking changes to data model)

**Schema remains:**
```json
{
  "id": "unique-identifier",
  "name": "Location Name",
  "category": "museum|hotel|restaurant|cafe|activity|poi",
  "icon": "🏛️",
  "lat": 52.2330,
  "lng": 21.0106,
  "url": "https://example.com",
  "notes": "Additional information"
}
```

**Loading flow:**
1. Application starts
2. Fetch `locations.json` from public directory
3. Parse JSON into locations array
4. Initialize map and sidebar as before
5. Browser caches for offline use after first load

### Admin Mode Toggle

**Activation mechanism:**
- "Edit Mode" toggle button in sidebar header
- Single click to enter/exit admin mode
- No separate authentication (relies on existing access key protection)

**Visual changes in edit mode:**
- Header shows "EDIT MODE" indicator with distinct background color
- Each location item shows ✏️ Edit and 🗑️ Delete buttons
- "+ Add Location" button appears at top of locations list
- "Download locations.json" button appears in header area
- Optional: "Unsaved changes" indicator when modifications exist

**Normal mode:**
- All admin controls completely hidden
- Interface identical to current production version
- Clean, distraction-free trip planning experience

### Adding Locations

**User flow:**
1. Click "+ Add Location" in edit mode
2. Modal overlay opens with form
3. Enter address in search box (e.g., "Copernicus Science Centre, Warsaw")
4. Click "Search" to query Nominatim geocoding API
5. Select from 3-5 results (handles address ambiguity)
6. Form auto-populates with name and coordinates
7. Fill in additional fields: category, icon, URL, notes
8. Preview marker appears on map while editing
9. Click "Save" to add location to array
10. Modal closes, sidebar and map update immediately

**Form fields:**
- **Address search** (with search button)
- **Results dropdown** (shows Nominatim matches)
- **Name** (text input, pre-filled from search result)
- **Category** (dropdown: hotel, museum, restaurant, cafe, activity, poi)
- **Icon** (text input for emoji, or emoji picker if time permits)
- **URL** (text input, optional)
- **Notes** (textarea, optional)
- **Latitude** (number input, auto-filled but editable)
- **Longitude** (number input, auto-filled but editable)

**Nominatim integration:**
- Endpoint: `https://nominatim.openstreetmap.org/search`
- Parameters: `format=json&q={query}&limit=5`
- User-Agent header: `WarsawTripMap/1.0` (required by usage policy)
- Rate limiting: Max 1 request/second (enforce with debounce)
- Error handling: Network failures, no results, invalid responses

**Validation:**
- Name is required
- Category is required
- Icon is required (default to 📍 if empty)
- Latitude must be between -90 and 90
- Longitude must be between -180 and 180
- URL must be valid format if provided (basic check)

### Editing Locations

**User flow:**
1. Click ✏️ edit button on any location in sidebar
2. Same modal opens as "Add" flow
3. All fields pre-populated with current values
4. Can re-search address if geocoding needs updating
5. Preview marker updates as coordinates change
6. Click "Save" to update location in array
7. Changes reflect immediately in sidebar and map

**Implementation notes:**
- Reuse same modal component as add flow
- Pass location ID to identify which location to update
- Deep clone location object to avoid mutating until save
- Replace location in array on save (find by ID)

### Deleting Locations

**User flow:**
1. Click 🗑️ delete button on location in sidebar
2. Confirmation dialog appears: "Delete [Location Name]? This cannot be undone."
3. User clicks "Delete" to confirm or "Cancel" to abort
4. On confirm: remove from array, remove marker from map, re-render
5. On cancel: nothing happens

**Safety considerations:**
- Always require confirmation (no accidental deletes)
- Clear messaging about irreversibility (in-memory only, but still disruptive)
- Cannot delete if location is currently selected for routing (show error)

### Downloading & Deployment Workflow

**Download functionality:**
1. Click "Download locations.json" button in edit mode
2. JavaScript serializes current locations array to JSON
3. Pretty-print with 2-space indentation for readability
4. Create Blob with `application/json` MIME type
5. Trigger browser download with filename `locations.json`
6. User saves to project directory: `/public/locations.json`

**Manual deployment workflow:**
```bash
# 1. Edit locations through UI
# 2. Download locations.json
# 3. Replace file in project
mv ~/Downloads/locations.json public/locations.json

# 4. Commit changes
git add public/locations.json
git commit -m "Update locations from admin UI"

# 5. Push to GitHub
git push origin main

# 6. GitHub Actions automatically deploys
```

**Why this approach:**
- No backend infrastructure required (zero cost, zero maintenance)
- Version control of location changes (full git history)
- Review changes before deployment (git diff)
- Rollback capability (git revert)
- Works with existing GitHub Pages deployment

## Technical Implementation Details

### State Management

**Locations array:**
```javascript
let locations = []; // Loaded from JSON, mutable for editing
let isEditMode = false; // Admin mode toggle state
let hasUnsavedChanges = false; // Track modifications
```

**Rendering strategy:**
- Single source of truth: `locations` array
- Re-render sidebar and map markers when data changes
- Preserve existing routing functionality (selectedLocations remains unchanged)

### Modal Component

**HTML structure:**
```html
<div id="location-modal" class="modal-overlay">
  <div class="modal-content">
    <h3>Add Location</h3>
    <form id="location-form">
      <!-- Address search -->
      <!-- Search results -->
      <!-- Form fields -->
      <!-- Action buttons -->
    </form>
  </div>
</div>
```

**Behavior:**
- Show/hide with CSS classes (`display: none` / `display: flex`)
- Click outside modal to close (backdrop click)
- ESC key to close
- Prevent body scroll when open
- Clear form on close
- Remove preview marker on close

### Preview Markers

**During add/edit:**
- Create temporary marker with distinct style (different color, pulsing animation)
- Update position as coordinates change in form
- Remove when modal closes or location is saved

**Styling:**
- Different color from permanent markers (e.g., orange vs blue)
- Slightly larger to stand out
- Optional: pulsing CSS animation

### Error Handling

**Geocoding errors:**
- No results: "No locations found for this address. Try being more specific."
- Network error: "Unable to reach geocoding service. Check your internet connection."
- Rate limit: "Too many requests. Please wait a moment and try again."

**Validation errors:**
- Required field empty: Inline error message under field
- Invalid coordinate range: "Latitude must be between -90 and 90"
- Invalid URL format: "Please enter a valid URL starting with http:// or https://"

**Delete safeguards:**
- Cannot delete location currently in route: "Cannot delete location while it's selected for routing. Clear selection first."

## User Experience Considerations

### Admin Mode Affordances

**Clear visual distinction:**
- Edit mode header: Yellow/orange background with "EDIT MODE" badge
- Normal mode header: Default styling
- Smooth transition between modes (CSS transitions)

**Unsaved changes indicator:**
- Small dot or text: "• Unsaved changes" in header when modifications exist
- Download button highlights or pulses when changes exist
- Optional: Confirm dialog on exit edit mode if unsaved changes

### Mobile Responsiveness

**Modal on mobile:**
- Full-screen overlay on small screens
- Scrollable content area for long forms
- Large touch targets for buttons (min 44px)
- Keyboard-friendly input fields

**Edit controls:**
- Edit/delete buttons sized for touch (not too small)
- Confirmation dialogs mobile-friendly
- Address search results easy to tap

### Performance

**Geocoding:**
- Debounce search input (wait 500ms after typing stops)
- Show loading spinner during API request
- Cache recent searches to reduce API calls

**Rendering:**
- Batch marker updates (don't re-render after every change)
- Virtual scrolling if location list grows large (unlikely with ~20 locations)
- Maintain 60fps animations for modal open/close

## Non-Goals (Out of Scope)

**What we're NOT building:**
- ❌ Backend database or API
- ❌ Real-time sync across devices
- ❌ Collaborative editing
- ❌ Undo/redo functionality
- ❌ Drag-and-drop reordering
- ❌ Bulk import/export (beyond single JSON file)
- ❌ Location categories customization (fixed set of 6)
- ❌ Advanced geocoding (only basic address search)
- ❌ Map drawing tools or custom markers
- ❌ Visit scheduling (removed in earlier version)

## Success Criteria

**Feature is complete when:**
1. ✅ Locations load from `public/locations.json` instead of JS module
2. ✅ Edit mode toggle works, showing/hiding admin controls
3. ✅ Can add new location via address search with Nominatim
4. ✅ Can edit existing location, updating name/category/icon/URL/notes/coordinates
5. ✅ Can delete location with confirmation dialog
6. ✅ Can download current locations as JSON file
7. ✅ All existing functionality (routing, selection, tile layers) works unchanged
8. ✅ UI is mobile-responsive and accessible
9. ✅ No console errors or warnings
10. ✅ README updated with admin mode instructions

## Implementation Notes

### File Changes

**New files:**
- `public/locations.json` - Location data moved from JS
- None others (all changes in existing files)

**Modified files:**
- `src/main.js` - Add edit mode, modal, geocoding, download logic
- `src/style.css` - Modal styles, edit mode indicators
- `README.md` - Document admin mode usage
- `src/locations.js` - Delete this file (no longer needed)

### Dependencies

**No new npm packages required:**
- Nominatim API is REST, use native `fetch()`
- Modal is pure HTML/CSS/JS
- File download uses Blob API (built-in browser feature)
- Existing Leaflet handles preview markers

### Deployment

**GitHub Pages impact:**
- `locations.json` served as static asset (same as before, just different format)
- No build changes needed (Vite already handles public directory)
- No new environment variables or secrets
- Existing GitHub Actions workflow unchanged

## Future Enhancements (Post-MVP)

**Potential additions later:**
- Emoji picker UI for icon selection
- Click-on-map to add location (alternative to address search)
- Duplicate location (clone and edit)
- Reorder locations within categories (drag-and-drop)
- Import locations from Google Maps saved places
- Export to GPX/KML for GPS devices

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Nominatim rate limiting | Users can't add locations | Add debouncing, show clear error, document manual lat/lng entry |
| Invalid JSON download | Breaks app on next deploy | Validate JSON before download, add schema check |
| Accidental data loss | Lost location data | Git version control, confirmation dialogs, clear "unsaved" indicators |
| Mobile UX poor | Hard to edit on phone | Responsive design from start, test on real devices |
| Breaking existing features | Route planning stops working | Thorough testing, keep data schema identical |

## Timeline Estimate

**Not providing timeline estimates per guidance.** Implementation will be broken into logical steps with validation at each checkpoint.
