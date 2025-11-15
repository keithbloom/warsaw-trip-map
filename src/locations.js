// Warsaw Trip Locations Data
export const locations = [
    {
        id: 'hotel',
        name: 'Puro Hotel Warsaw Old Town',
        category: 'hotel',
        icon: '🏨',
        lat: 52.2496,
        lng: 21.0082,
        url: 'https://purohotel.pl/en/warsaw-city/warsaw-old-town/rooms/',
        notes: 'Our hotel if we can afford it',
        visit: null
    },
    {
        id: 'royal-palace',
        name: 'Royal Palace',
        category: 'museum',
        icon: '🏛️',
        lat: 52.2477,
        lng: 21.0145,
        url: 'https://www.zamek-krolewski.pl/en/godziny-otwarcia-i-ceny-biletow',
        notes: 'Historic royal residence',
        visit: null
    },
    {
        id: 'warsaw-uprising',
        name: 'Museum of Warsaw Uprising',
        category: 'museum',
        icon: '🏛️',
        lat: 52.2320,
        lng: 20.9802,
        url: 'https://www.1944.pl/en/article/visit-us,4993.html',
        notes: 'WWII history museum',
        visit: null
    },
    {
        id: 'vodka-museum',
        name: 'Polish Vodka Museum',
        category: 'museum',
        icon: '🏛️',
        lat: 52.2526,
        lng: 21.0417,
        url: 'https://muzeumpolskiejwodki.pl/en/tours-and-tasting/standard/',
        notes: 'Tours and tasting available',
        visit: null
    },
    {
        id: 'polin',
        name: 'POLIN Museum of History of Polish Jews',
        category: 'museum',
        icon: '🏛️',
        lat: 52.2496,
        lng: 20.9933,
        url: 'https://bilety.polin.pl/index.html?lang=en',
        notes: 'Jewish history and culture',
        visit: null
    },
    {
        id: 'communist-museum',
        name: 'Museum of Life Under Communism',
        category: 'museum',
        icon: '🏛️',
        lat: 52.2318,
        lng: 21.0065,
        url: 'https://mzprl.pl/wizyta/?lang=en',
        notes: 'Communist era exhibition',
        visit: null
    },
    {
        id: 'neon-museum',
        name: 'Neon Museum',
        category: 'museum',
        icon: '🏛️',
        lat: 52.2443,
        lng: 20.9819,
        url: 'https://www.neonmuzeum.org/visit-museum',
        notes: 'Vintage neon signs',
        visit: null
    },
    {
        id: 'wilanow-palace',
        name: 'Wilanów Palace',
        category: 'museum',
        icon: '🏛️',
        lat: 52.1654,
        lng: 21.0910,
        url: 'https://wilanow-palac.pl/palac',
        notes: '10km outside city centre',
        visit: null
    },
    {
        id: 'escape-room',
        name: 'Black Cat Escape Room - Warsaw Uprising',
        category: 'activity',
        icon: '🎭',
        lat: 52.2324,
        lng: 21.0119,
        url: 'https://blackcat.pl/en/pokoje/warsaw-uprising',
        notes: 'Warsaw Uprising themed',
        visit: null
    },
    {
        id: 'wedel',
        name: 'E.Wedel Flagship Store',
        category: 'cafe',
        icon: '☕',
        lat: 52.2362,
        lng: 21.0105,
        url: null,
        notes: 'Best hot chocolate - 8 Szpitalna Street',
        visit: null
    },
    {
        id: 'koszyki',
        name: 'Hala Koszyki Food Hall',
        category: 'restaurant',
        icon: '🍽️',
        lat: 52.2245,
        lng: 21.0184,
        url: 'https://koszyki.com/uslugi/restauracje/?lang=en',
        notes: 'Indoor food market',
        visit: null
    },
    {
        id: 'zapiecek',
        name: 'Restauracja Zapiecek',
        category: 'restaurant',
        icon: '🍽️',
        lat: 52.2490,
        lng: 21.0120,
        url: 'http://www.restauracjazapiecek.pl/eng/menu.php',
        notes: 'Best pierogi in Old Town - touristy but highly recommended',
        visit: null
    },
    {
        id: 'nobu',
        name: 'Nobu Restaurant',
        category: 'restaurant',
        icon: '🍽️',
        lat: 52.2286,
        lng: 21.0053,
        url: 'https://www.nobuhotels.com/warsaw/dining/nobu-restaurant/',
        notes: 'High-end Japanese-Peruvian fusion',
        visit: null
    },
    {
        id: 'ramenownia',
        name: 'Ramenownia',
        category: 'restaurant',
        icon: '🍽️',
        lat: 52.2301,
        lng: 21.0152,
        url: 'https://warsawinsider.pl/ramenownia/',
        notes: 'Recommended ramen spot',
        visit: null
    },
    {
        id: 'nowy-swiat',
        name: 'Nowy Świat Street',
        category: 'poi',
        icon: '📍',
        lat: 52.2340,
        lng: 21.0175,
        url: null,
        notes: 'Good place for coffee and eating - main boulevard',
        visit: null
    },
    {
        id: 'communist-tour',
        name: 'Communist Tour Starting Point',
        category: 'activity',
        icon: '🎭',
        lat: 52.2297,
        lng: 21.0122,
        url: 'https://abpoland.com/tours/communist-tour-in-warsaw',
        notes: 'Guided communist history tour',
        visit: null
    }
];

// Load saved visits from localStorage
export function loadVisits() {
    const saved = localStorage.getItem('warsaw-visits');
    if (saved) {
        const visits = JSON.parse(saved);
        locations.forEach(loc => {
            if (visits[loc.id]) {
                loc.visit = visits[loc.id];
            }
        });
    }
}

// Save visits to localStorage
export function saveVisits() {
    const visits = {};
    locations.forEach(loc => {
        if (loc.visit) {
            visits[loc.id] = loc.visit;
        }
    });
    localStorage.setItem('warsaw-visits', JSON.stringify(visits));
}

// Initialize visits on load
loadVisits();
