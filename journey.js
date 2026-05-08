// Popular locations in Indian cities for autocomplete
const popularLocations = [
    // Bangalore
    'Banashankari, Bangalore', 'Whitefield, Bangalore', 'Koramangala, Bangalore', 
    'Indiranagar, Bangalore', 'Electronic City, Bangalore', 'MG Road, Bangalore',
    'HSR Layout, Bangalore', 'Jayanagar, Bangalore', 'Marathahalli, Bangalore',
    'BTM Layout, Bangalore', 'Yelahanka, Bangalore', 'JP Nagar, Bangalore',
    
    // Mumbai
    'Andheri, Mumbai', 'Bandra, Mumbai', 'Powai, Mumbai', 'Dadar, Mumbai',
    'Churchgate, Mumbai', 'Colaba, Mumbai', 'Juhu, Mumbai', 'Goregaon, Mumbai',
    
    // Delhi
    'Connaught Place, Delhi', 'Karol Bagh, Delhi', 'Dwarka, Delhi', 'Rohini, Delhi',
    'Saket, Delhi', 'Nehru Place, Delhi', 'Lajpat Nagar, Delhi',
    
    // Other cities
    'Hitech City, Hyderabad', 'Gachibowli, Hyderabad', 'Banjara Hills, Hyderabad',
    'T Nagar, Chennai', 'Anna Nagar, Chennai', 'Velachery, Chennai',
    'Salt Lake, Kolkata', 'Park Street, Kolkata', 'Howrah, Kolkata',
    'Koregaon Park, Pune', 'Hinjewadi, Pune', 'Viman Nagar, Pune'
];

// City coordinates for reverse geocoding
const cityCoordinates = {
    'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
    'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
    'delhi': { lat: 28.7041, lng: 77.1025, name: 'Delhi' },
    'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
    'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
    'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
    'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune' },
    'ahmedabad': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad' }
};

// Calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Find nearest city
function findNearestCity(userLat, userLng) {
    let nearestCity = null;
    let minDistance = Infinity;
    
    for (const [city, coords] of Object.entries(cityCoordinates)) {
        const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = coords.name;
        }
    }
    
    return nearestCity;
}

// Request user location for start point
function requestUserLocation() {
    if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        return;
    }
    
    const startInput = document.getElementById('startLocation');
    const originalPlaceholder = startInput.placeholder;
    startInput.placeholder = 'Detecting your location...';
    startInput.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Find nearest city
            const nearestCity = findNearestCity(userLat, userLng);
            
            // Set as start location
            startInput.value = `Current Location, ${nearestCity}`;
            startInput.placeholder = originalPlaceholder;
            startInput.disabled = false;
            
            // Store coordinates for later use
            window.userLocation = {
                lat: userLat,
                lng: userLng,
                city: nearestCity
            };
            
            // Show notification
            showLocationNotification(`Location detected: ${nearestCity}`);
        },
        (error) => {
            console.log('Location error:', error);
            startInput.placeholder = originalPlaceholder;
            startInput.disabled = false;
            
            if (error.code === error.PERMISSION_DENIED) {
                showLocationNotification('Location permission denied. Please enter manually.', 'warning');
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Show location notification
function showLocationNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #f97316)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    notification.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Location autocomplete
function setupAutocomplete(inputId, suggestionsId) {
    const input = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(suggestionsId);
    
    input.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        
        if (value.length < 2) {
            suggestionsDiv.classList.add('hidden');
            return;
        }
        
        const matches = popularLocations.filter(loc => 
            loc.toLowerCase().includes(value)
        ).slice(0, 5);
        
        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.map(loc => 
                `<div class="location-suggestion-item" data-location="${loc}">${loc}</div>`
            ).join('');
            suggestionsDiv.classList.remove('hidden');
            
            // Add click handlers
            suggestionsDiv.querySelectorAll('.location-suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    input.value = item.dataset.location;
                    suggestionsDiv.classList.add('hidden');
                });
            });
        } else {
            suggestionsDiv.classList.add('hidden');
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.add('hidden');
        }
    });
}

// Initialize autocomplete
setupAutocomplete('startLocation', 'startSuggestions');
setupAutocomplete('endLocation', 'endSuggestions');

// Request user location on page load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        requestUserLocation();
    }, 500);
});

// Handle form submission
document.getElementById('journeyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const startLocation = document.getElementById('startLocation').value;
    const endLocation = document.getElementById('endLocation').value;
    
    if (!startLocation || !endLocation) {
        alert('Please enter both start and end locations');
        return;
    }
    
    // Store journey data
    localStorage.setItem('journeyStart', startLocation);
    localStorage.setItem('journeyEnd', endLocation);
    localStorage.setItem('journeyTimestamp', new Date().toISOString());
    
    // Redirect to journey report
    window.location.href = 'journey-report.html';
});
