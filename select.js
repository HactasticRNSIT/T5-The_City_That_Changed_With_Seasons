// Determine current season based on month
function getCurrentSeason() {
    const month = new Date().getMonth() + 1; // 1-12
    
    if (month >= 3 && month <= 5) {
        return 'summer'; // March to May
    } else if (month >= 6 && month <= 9) {
        return 'monsoon'; // June to September
    } else if (month >= 10 && month <= 11) {
        return 'spring'; // October to November
    } else {
        return 'winter'; // December to February
    }
}

// City coordinates for geolocation matching
const cityCoordinates = {
    'mumbai': { lat: 19.0760, lng: 72.8777, radius: 50 },
    'delhi': { lat: 28.7041, lng: 77.1025, radius: 50 },
    'bangalore': { lat: 12.9716, lng: 77.5946, radius: 50 },
    'hyderabad': { lat: 17.3850, lng: 78.4867, radius: 50 },
    'chennai': { lat: 13.0827, lng: 80.2707, radius: 50 },
    'kolkata': { lat: 22.5726, lng: 88.3639, radius: 50 },
    'pune': { lat: 18.5204, lng: 73.8567, radius: 50 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714, radius: 50 }
};

// Calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Find nearest city based on user coordinates
function findNearestCity(userLat, userLng) {
    let nearestCity = null;
    let minDistance = Infinity;
    
    for (const [city, coords] of Object.entries(cityCoordinates)) {
        const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng);
        
        // If within city radius, return immediately
        if (distance <= coords.radius) {
            return city;
        }
        
        // Track nearest city
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    }
    
    return nearestCity;
}

// Request user location and auto-select city
function requestLocationPermission() {
    if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        return;
    }
    
    // Show loading indicator
    const citySelect = document.getElementById('citySelect');
    const originalHTML = citySelect.innerHTML;
    citySelect.innerHTML = '<option value="">Detecting location...</option>';
    citySelect.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Find nearest city
            const nearestCity = findNearestCity(userLat, userLng);
            
            // Restore dropdown
            citySelect.innerHTML = originalHTML;
            citySelect.disabled = false;
            
            if (nearestCity) {
                citySelect.value = nearestCity;
                
                // Show notification
                showLocationNotification(`Location detected: ${nearestCity.charAt(0).toUpperCase() + nearestCity.slice(1)}`);
            }
        },
        (error) => {
            console.log('Location permission denied or error:', error);
            
            // Restore dropdown
            citySelect.innerHTML = originalHTML;
            citySelect.disabled = false;
            
            // Show notification
            if (error.code === error.PERMISSION_DENIED) {
                showLocationNotification('Location permission denied. Please select city manually.', 'warning');
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

// Season data with icons
const seasons = {
    summer: {
        name: 'Summer',
        icon: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`
    },
    monsoon: {
        name: 'Monsoon',
        icon: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
        </svg>`
    },
    winter: {
        name: 'Winter',
        icon: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
        </svg>`
    },
    spring: {
        name: 'Spring',
        icon: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>`
    }
};

// Reorder seasons with current season first
function reorderSeasons() {
    const currentSeason = getCurrentSeason();
    const seasonOrder = ['summer', 'monsoon', 'winter', 'spring'];
    
    // Move current season to front
    const currentIndex = seasonOrder.indexOf(currentSeason);
    if (currentIndex > 0) {
        seasonOrder.splice(currentIndex, 1);
        seasonOrder.unshift(currentSeason);
    }
    
    return seasonOrder;
}

// Render season cards in order
function renderSeasonCards() {
    const container = document.getElementById('seasonCardsContainer');
    const orderedSeasons = reorderSeasons();
    const currentSeason = getCurrentSeason();
    
    container.innerHTML = '';
    
    orderedSeasons.forEach((seasonKey, index) => {
        const season = seasons[seasonKey];
        const isFirst = index === 0;
        
        const label = document.createElement('label');
        label.className = 'season-option';
        
        label.innerHTML = `
            <input type="radio" name="season" value="${seasonKey}" ${isFirst ? 'checked' : ''} required class="hidden">
            <div class="season-card ${isFirst ? 'selected' : ''}">
                ${season.icon}
                <span>${season.name}${isFirst ? ' (Current)' : ''}</span>
            </div>
        `;
        
        container.appendChild(label);
    });
    
    // Re-attach event listeners
    document.querySelectorAll('.season-option input').forEach(input => {
        input.addEventListener('change', function() {
            document.querySelectorAll('.season-card').forEach(card => {
                card.classList.remove('selected');
            });
            if (this.checked) {
                this.nextElementSibling.classList.add('selected');
            }
        });
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    renderSeasonCards();
    
    // Request location permission after a short delay
    setTimeout(() => {
        requestLocationPermission();
    }, 500);
});

// Handle form submission
document.getElementById('selectionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const city = document.getElementById('citySelect').value;
    const season = document.querySelector('input[name="season"]:checked')?.value;
    const analysisTypes = Array.from(document.querySelectorAll('input[name="analysis"]:checked'))
        .map(input => input.value);
    
    // Validation
    if (!city) {
        alert('Please select a city');
        return;
    }
    
    if (!season) {
        alert('Please select a season');
        return;
    }
    
    if (analysisTypes.length === 0) {
        alert('Please select at least one analysis type');
        return;
    }
    
    // Store selections in localStorage
    localStorage.setItem('selectedCity', city);
    localStorage.setItem('selectedSeason', season);
    localStorage.setItem('selectedAnalysis', JSON.stringify(analysisTypes));
    
    // Redirect to dashboard (will be created next)
    window.location.href = 'dashboard.html';
});

// Season card selection
document.querySelectorAll('.season-option input').forEach(input => {
    input.addEventListener('change', function() {
        document.querySelectorAll('.season-card').forEach(card => {
            card.classList.remove('selected');
        });
        if (this.checked) {
            this.nextElementSibling.classList.add('selected');
        }
    });
});

// Analysis card selection
document.querySelectorAll('.analysis-option input').forEach(input => {
    input.addEventListener('change', function() {
        if (this.checked) {
            this.nextElementSibling.classList.add('selected');
        } else {
            this.nextElementSibling.classList.remove('selected');
        }
    });
});
