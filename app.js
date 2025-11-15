// Initialize the map centered on Warsaw Old Town
const map = L.map('map').setView([52.2330, 21.0106], 13);

// Define available tile layers
const tileLayers = {
    'osm': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 16,
        minZoom: 11
    }),
    'cartodb-positron': L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
        minZoom: 11,
        subdomains: 'abcd'
    }),
    'cartodb-voyager': L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
        minZoom: 11,
        subdomains: 'abcd'
    }),
    'cartodb-dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
        minZoom: 11,
        subdomains: 'abcd'
    }),
    'esri-world': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 19,
        minZoom: 11
    })
};

// Add default tile layer (OpenStreetMap)
let currentTileLayer = tileLayers['osm'];
currentTileLayer.addTo(map);

// Set the select dropdown to show the correct default
document.getElementById('tile-style').value = 'osm';

// Prevent map interactions on tile selector
const tileSelector = document.querySelector('.tile-selector');
L.DomEvent.disableClickPropagation(tileSelector);
L.DomEvent.disableScrollPropagation(tileSelector);

// Tile selector change handler
document.getElementById('tile-style').addEventListener('change', function(e) {
    const selectedStyle = e.target.value;

    // Remove current tile layer
    map.removeLayer(currentTileLayer);

    // Add new tile layer
    currentTileLayer = tileLayers[selectedStyle];
    currentTileLayer.addTo(map);
});

// Store markers and selected locations
const markers = {};
let selectedLocations = [];
let routingControl = null;

// Custom icon creator
function createCustomIcon(emoji) {
    return L.divIcon({
        html: `<div style="font-size: 24px;">${emoji}</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });
}

// Add markers to map
locations.forEach(location => {
    const marker = L.marker([location.lat, location.lng], {
        icon: createCustomIcon(location.icon)
    }).addTo(map);
    
    // Create popup content
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
    
    if (location.visit) {
        popupContent += `<div class="popup-visit">📅 Visiting: ${location.visit}</div>`;
    }
    
    marker.bindPopup(popupContent);
    markers[location.id] = marker;
    
    // Click handler for selection
    marker.on('click', () => {
        toggleLocationSelection(location);
    });
});

// Render locations list in sidebar
function renderLocationsList() {
    const container = document.getElementById('locations-list');
    container.innerHTML = '';
    
    // Group by category
    const categories = {
        hotel: [],
        museum: [],
        restaurant: [],
        cafe: [],
        activity: [],
        poi: []
    };
    
    locations.forEach(loc => {
        categories[loc.category].push(loc);
    });
    
    const categoryNames = {
        hotel: 'Hotel',
        museum: 'Museums & Palaces',
        restaurant: 'Restaurants',
        cafe: 'Cafés & Drinks',
        activity: 'Activities',
        poi: 'Points of Interest'
    };
    
    Object.keys(categoryNames).forEach(catKey => {
        if (categories[catKey].length > 0) {
            const categoryDiv = document.createElement('div');
            categoryDiv.style.marginBottom = '15px';
            
            const categoryTitle = document.createElement('div');
            categoryTitle.style.fontSize = '13px';
            categoryTitle.style.fontWeight = '600';
            categoryTitle.style.color = '#666';
            categoryTitle.style.marginBottom = '8px';
            categoryTitle.textContent = categoryNames[catKey];
            categoryDiv.appendChild(categoryTitle);
            
            categories[catKey].forEach(location => {
                const item = document.createElement('div');
                item.className = 'location-item';
                item.id = `loc-${location.id}`;
                
                if (selectedLocations.includes(location.id)) {
                    item.classList.add('selected');
                }
                
                let itemHTML = `
                    <div class="location-name">${location.icon} ${location.name}</div>
                `;
                
                if (location.visit) {
                    itemHTML += `<div class="location-visit">📅 ${location.visit}</div>`;
                }
                
                itemHTML += `
                    <button class="add-visit-btn" onclick="showVisitForm('${location.id}', event)">
                        ${location.visit ? 'Edit Visit' : '+ Add Visit'}
                    </button>
                    <div class="visit-form" id="visit-form-${location.id}">
                        <input type="datetime-local" id="visit-input-${location.id}" 
                               value="${location.visit || ''}" 
                               placeholder="Date and time">
                        <div>
                            <button class="save" onclick="saveVisit('${location.id}', event)">Save</button>
                            <button class="cancel" onclick="hideVisitForm('${location.id}', event)">Cancel</button>
                        </div>
                    </div>
                `;
                
                item.innerHTML = itemHTML;
                
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.add-visit-btn') && !e.target.closest('.visit-form')) {
                        toggleLocationSelection(location);
                    }
                });
                
                categoryDiv.appendChild(item);
            });
            
            container.appendChild(categoryDiv);
        }
    });
}

// Toggle location selection
function toggleLocationSelection(location) {
    const index = selectedLocations.indexOf(location.id);
    
    if (index > -1) {
        // Deselect
        selectedLocations.splice(index, 1);
        document.getElementById(`loc-${location.id}`).classList.remove('selected');
    } else {
        // Select (max 2)
        if (selectedLocations.length >= 2) {
            // Remove first selection
            const oldId = selectedLocations.shift();
            document.getElementById(`loc-${oldId}`).classList.remove('selected');
        }
        selectedLocations.push(location.id);
        document.getElementById(`loc-${location.id}`).classList.add('selected');
    }
    
    // Update route
    updateRoute();
}

// Update route display
function updateRoute() {
    const routeContainer = document.getElementById('route-info-container');
    
    // Clear existing route
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    
    if (selectedLocations.length === 2) {
        const loc1 = locations.find(l => l.id === selectedLocations[0]);
        const loc2 = locations.find(l => l.id === selectedLocations[1]);
        
        // Calculate straight-line distance
        const distance = calculateDistance(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
        
        // Show route on map using Leaflet Routing Machine
        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(loc1.lat, loc1.lng),
                L.latLng(loc2.lat, loc2.lng)
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            lineOptions: {
                styles: [{color: '#2196F3', opacity: 0.7, weight: 4}]
            },
            show: false,
            createMarker: function() { return null; } // Don't create route markers
        }).addTo(map);
        
        // Listen for route calculation
        routingControl.on('routesfound', function(e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            
            // Display route info (walking distance only)
            const walkingTime = Math.round(summary.totalTime / 60); // minutes
            const walkingDistance = (summary.totalDistance / 1000).toFixed(2); // km

            routeContainer.innerHTML = `
                <div class="route-info">
                    <h4>Route: ${loc1.name} → ${loc2.name}</h4>
                    <div class="route-distance">
                        <span class="route-type">🚶 Walking distance:</span>
                        <span class="route-value">${walkingDistance} km (~${walkingTime} min)</span>
                    </div>
                    <button class="clear-btn" onclick="clearSelection()">Clear Selection</button>
                </div>
            `;
        });
        
    } else {
        routeContainer.innerHTML = '';
    }
}

// Calculate straight-line distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Clear selection
function clearSelection() {
    selectedLocations = [];
    document.querySelectorAll('.location-item').forEach(item => {
        item.classList.remove('selected');
    });
    updateRoute();
}

// Visit form functions
function showVisitForm(locationId, event) {
    event.stopPropagation();
    const form = document.getElementById(`visit-form-${locationId}`);
    form.style.display = 'block';
}

function hideVisitForm(locationId, event) {
    event.stopPropagation();
    const form = document.getElementById(`visit-form-${locationId}`);
    form.style.display = 'none';
}

function saveVisit(locationId, event) {
    event.stopPropagation();
    const input = document.getElementById(`visit-input-${locationId}`);
    const location = locations.find(l => l.id === locationId);
    
    if (input.value) {
        const date = new Date(input.value);
        location.visit = date.toLocaleString('en-GB', { 
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        location.visit = null;
    }
    
    saveVisits();
    hideVisitForm(locationId, event);
    renderLocationsList();
    
    // Update marker popup
    const marker = markers[locationId];
    const popupContent = marker.getPopup().getContent();
    let newContent = popupContent.replace(/<div class="popup-visit">.*?<\/div>/, '');
    if (location.visit) {
        newContent += `<div class="popup-visit">📅 Visiting: ${location.visit}</div>`;
    }
    marker.getPopup().setContent(newContent);
}

// Initialize
renderLocationsList();

// Fit map to show all markers
const group = new L.featureGroup(Object.values(markers));
map.fitBounds(group.getBounds().pad(0.1));
