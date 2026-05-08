// Configuration
const GROQ_API_KEY = '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';

// Get journey data from localStorage
const journeyStart = localStorage.getItem('journeyStart') || 'Banashankari, Bangalore';
const journeyEnd = localStorage.getItem('journeyEnd') || 'Whitefield, Bangalore';
const journeyTimestamp = localStorage.getItem('journeyTimestamp') || new Date().toISOString();

// Update header info
document.getElementById('journeyRoute').textContent = `${journeyStart} → ${journeyEnd}`;
document.getElementById('startPoint').textContent = journeyStart;
document.getElementById('endPoint').textContent = journeyEnd;

// Format date and time
const journeyDate = new Date(journeyTimestamp);
const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
const timeOptions = { hour: '2-digit', minute: '2-digit' };
document.getElementById('journeyDateTime').textContent = 
    `${journeyDate.toLocaleDateString('en-US', dateOptions)}, ${journeyDate.toLocaleTimeString('en-US', timeOptions)}`;


// Location coordinates (approximate for major Indian locations)
const locationCoords = {
    'banashankari': { lat: 12.9250, lng: 77.5431 },
    'whitefield': { lat: 12.9698, lng: 77.7499 },
    'koramangala': { lat: 12.9352, lng: 77.6245 },
    'indiranagar': { lat: 12.9716, lng: 77.6412 },
    'electronic city': { lat: 12.8456, lng: 77.6603 },
    'mg road': { lat: 12.9716, lng: 77.5946 },
    'hsr layout': { lat: 12.9121, lng: 77.6446 },
    'jayanagar': { lat: 12.9250, lng: 77.5833 },
    'marathahalli': { lat: 12.9591, lng: 77.6974 },
    'btm layout': { lat: 12.9165, lng: 77.6101 },
    'andheri': { lat: 19.1136, lng: 72.8697 },
    'bandra': { lat: 19.0596, lng: 72.8295 },
    'powai': { lat: 19.1197, lng: 72.9059 },
    'dadar': { lat: 19.0176, lng: 72.8479 },
    'connaught place': { lat: 28.6315, lng: 77.2167 },
    'karol bagh': { lat: 28.6519, lng: 77.1909 },
    'dwarka': { lat: 28.5921, lng: 77.0460 },
    'hitech city': { lat: 17.4485, lng: 78.3908 },
    't nagar': { lat: 13.0418, lng: 80.2341 },
    'salt lake': { lat: 22.5645, lng: 88.4129 },
    'koregaon park': { lat: 18.5362, lng: 73.8958 }
};

// Get coordinates for a location
function getLocationCoords(locationString) {
    const normalized = locationString.toLowerCase().split(',')[0].trim();
    
    for (const key in locationCoords) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return locationCoords[key];
        }
    }
    
    // Default to Bangalore center if not found
    return { lat: 12.9716, lng: 77.5946 };
}

const startCoords = getLocationCoords(journeyStart);
const endCoords = getLocationCoords(journeyEnd);


// Generate weather data for destination
function generateDestinationWeather() {
    const currentMonth = new Date().getMonth() + 1;
    let season = 'summer';
    
    if (currentMonth >= 6 && currentMonth <= 9) season = 'monsoon';
    else if (currentMonth >= 10 && currentMonth <= 11) season = 'spring';
    else if (currentMonth >= 12 || currentMonth <= 2) season = 'winter';
    
    const baseTemp = season === 'summer' ? 33 : season === 'monsoon' ? 28 : season === 'winter' ? 22 : 30;
    const baseHumidity = season === 'summer' ? 55 : season === 'monsoon' ? 85 : season === 'winter' ? 60 : 65;
    const baseAQI = season === 'summer' ? 95 : season === 'monsoon' ? 65 : season === 'winter' ? 125 : 85;
    const baseRainfall = season === 'summer' ? 15 : season === 'monsoon' ? 250 : season === 'winter' ? 8 : 35;
    
    return {
        temperature: baseTemp + (Math.random() - 0.5) * 4,
        humidity: baseHumidity + (Math.random() - 0.5) * 10,
        aqi: Math.max(0, baseAQI + (Math.random() - 0.5) * 20),
        rainfall: Math.max(0, baseRainfall + (Math.random() - 0.5) * 10),
        trafficIndex: 70 + Math.random() * 25,
        windSpeed: 5 + Math.random() * 15,
        visibility: 5 + Math.random() * 5,
        uvIndex: Math.floor(3 + Math.random() * 8)
    };
}

const weatherData = generateDestinationWeather();


// Fetch actual route from OSRM (OpenStreetMap Routing Machine)
async function getActualRoute(start, end) {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Routing failed');
        
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates;
            
            // Convert [lng, lat] to {lat, lng}
            const waypoints = coordinates.map(coord => ({
                lat: coord[1],
                lng: coord[0]
            }));
            
            // Distance in km, duration in seconds
            const distance = (route.distance / 1000).toFixed(1);
            const durationMinutes = Math.round(route.duration / 60);
            
            // Adjust for traffic
            const trafficFactor = 1 + (weatherData.trafficIndex / 100);
            const adjustedDuration = Math.round(durationMinutes * trafficFactor);
            
            return {
                waypoints: waypoints,
                distance: distance,
                time: adjustedDuration,
                timeFormatted: formatTime(adjustedDuration),
                originalDuration: durationMinutes
            };
        }
        
        throw new Error('No route found');
    } catch (error) {
        console.error('OSRM routing error:', error);
        // Fallback to simple route
        return getFallbackRoute(start, end);
    }
}

// Fallback route if OSRM fails
function getFallbackRoute(start, end) {
    const waypoints = [start];
    const numWaypoints = 5;
    
    for (let i = 1; i < numWaypoints; i++) {
        const ratio = i / numWaypoints;
        waypoints.push({
            lat: start.lat + (end.lat - start.lat) * ratio,
            lng: start.lng + (end.lng - start.lng) * ratio
        });
    }
    waypoints.push(end);
    
    const distance = calculateDistance(start.lat, start.lng, end.lat, end.lng);
    const avgSpeed = 35;
    const timeInMinutes = Math.round((distance / avgSpeed) * 60);
    
    return {
        waypoints: waypoints,
        distance: distance.toFixed(1),
        time: timeInMinutes,
        timeFormatted: formatTime(timeInMinutes),
        originalDuration: timeInMinutes
    };
}

// Calculate distance between two coordinates (Haversine formula)
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

function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

// Initialize and render the route map
async function initializeRouteMap() {
    const mapContainer = document.getElementById('routeMap');
    if (!mapContainer) return;
    
    // Show loading on map
    mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(15, 15, 25, 0.5); border-radius: 12px;"><div class="loading-spinner"></div><span style="color: #a855f7; margin-left: 12px;">Fetching route...</span></div>';
    
    // Get actual route from OSRM
    const routeData = await getActualRoute(startCoords, endCoords);
    
    // Store route data globally
    window.journeyETA = routeData;
    
    // Update ETA display
    document.getElementById('etaInfo').textContent = 
        `${routeData.timeFormatted} • ${routeData.distance} km`;
    
    // Clear loading and create map
    mapContainer.innerHTML = '';
    
    // Calculate center point
    const centerLat = (startCoords.lat + endCoords.lat) / 2;
    const centerLng = (startCoords.lng + endCoords.lng) / 2;
    
    // Initialize map
    const map = L.map('routeMap').setView([centerLat, centerLng], 12);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add markers
    const startIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #10b981; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">A</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
    
    const endIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">B</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
    
    L.marker([startCoords.lat, startCoords.lng], { icon: startIcon })
        .addTo(map)
        .bindPopup(`<div style="padding: 4px;"><b>Start:</b><br>${journeyStart}</div>`);
    
    L.marker([endCoords.lat, endCoords.lng], { icon: endIcon })
        .addTo(map)
        .bindPopup(`<div style="padding: 4px;"><b>Destination:</b><br>${journeyEnd}<br><br><b>ETA:</b> ${routeData.timeFormatted}<br><b>Distance:</b> ${routeData.distance} km</div>`);
    
    // Draw actual route line
    const routeCoords = routeData.waypoints.map(wp => [wp.lat, wp.lng]);
    
    // Single route line
    const routeLine = L.polyline(routeCoords, {
        color: '#a855f7',
        weight: 5,
        opacity: 0.9,
        smoothFactor: 1,
        lineJoin: 'round',
        lineCap: 'round'
    }).addTo(map);
    
    // Fit bounds to show entire route
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    
    // Add weather info overlay at bottom left
    const weatherInfo = L.control({ position: 'bottomleft' });
    weatherInfo.onAdd = function() {
        const div = L.DomUtil.create('div', 'weather-info-overlay');
        div.innerHTML = `
            <div style="background: rgba(15, 15, 25, 0.95); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(168, 85, 247, 0.3); backdrop-filter: blur(10px);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <svg width="18" height="18" fill="none" stroke="#f59e0b" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
                        </svg>
                        <span style="color: white; font-weight: 600; font-size: 15px;">${weatherData.temperature.toFixed(1)}°C</span>
                    </div>
                    <div style="width: 1px; height: 20px; background: rgba(168, 85, 247, 0.3);"></div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <svg width="18" height="18" fill="none" stroke="#3b82f6" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                        </svg>
                        <span style="color: #9ca3af; font-size: 13px;">AQI ${weatherData.aqi.toFixed(0)}</span>
                    </div>
                    <div style="width: 1px; height: 20px; background: rgba(168, 85, 247, 0.3);"></div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <svg width="18" height="18" fill="none" stroke="#10b981" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945"/>
                        </svg>
                        <span style="color: #9ca3af; font-size: 13px;">${weatherData.windSpeed.toFixed(1)} km/h</span>
                    </div>
                </div>
            </div>
        `;
        return div;
    };
    weatherInfo.addTo(map);
    
    setTimeout(() => map.invalidateSize(), 100);
}


// Add environmental heat layer to map
function addEnvironmentalHeatLayer(map, routeWaypoints) {
    const heatData = [];
    
    // Generate heat points along the curved route
    for (let i = 0; i < routeWaypoints.length - 1; i++) {
        const start = routeWaypoints[i];
        const end = routeWaypoints[i + 1];
        
        // Add points between each waypoint
        const steps = 10;
        for (let j = 0; j <= steps; j++) {
            const ratio = j / steps;
            const lat = start.lat + (end.lat - start.lat) * ratio;
            const lng = start.lng + (end.lng - start.lng) * ratio;
            
            // Vary intensity along route
            const intensity = 0.5 + Math.random() * 0.5;
            heatData.push([lat, lng, intensity]);
            
            // Add surrounding points for realistic spread
            for (let k = 0; k < 3; k++) {
                const offsetLat = lat + (Math.random() - 0.5) * 0.008;
                const offsetLng = lng + (Math.random() - 0.5) * 0.008;
                const offsetIntensity = intensity * (0.4 + Math.random() * 0.3);
                heatData.push([offsetLat, offsetLng, offsetIntensity]);
            }
        }
    }
    
    // Add heat layer
    L.heatLayer(heatData, {
        radius: 25,
        blur: 20,
        maxZoom: 17,
        max: 1.0,
        gradient: {
            0.0: '#3b82f6',
            0.3: '#22d3ee',
            0.5: '#10b981',
            0.7: '#f59e0b',
            1.0: '#ef4444'
        }
    }).addTo(map);
}


// Get AI insights for the journey
async function getJourneyInsights() {
    const etaInfo = window.journeyETA || { distance: '0', timeFormatted: 'calculating' };
    
    const prompt = `Analyze the journey from ${journeyStart} to ${journeyEnd} with current conditions:
- Distance: ${etaInfo.distance} km
- Estimated Time: ${etaInfo.timeFormatted}
- Temperature: ${weatherData.temperature.toFixed(1)}°C
- Humidity: ${weatherData.humidity.toFixed(1)}%
- Air Quality Index: ${weatherData.aqi.toFixed(0)}
- Traffic Index: ${weatherData.trafficIndex.toFixed(0)}%
- Wind Speed: ${weatherData.windSpeed.toFixed(1)} km/h
- UV Index: ${weatherData.uvIndex}

Provide a 2-paragraph analysis covering:
1. Current environmental conditions and their impact on the journey
2. Practical recommendations for travelers (timing, precautions, route considerations)

Keep it concise and actionable.`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 400
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const result = await response.json();
        return result.choices?.[0]?.message?.content || getFallbackInsights();
    } catch (error) {
        console.error('AI Error:', error);
        return getFallbackInsights();
    }
}

function getFallbackInsights() {
    const aqiStatus = weatherData.aqi > 150 ? 'poor' : weatherData.aqi > 100 ? 'moderate' : 'good';
    const trafficStatus = weatherData.trafficIndex > 80 ? 'heavy' : weatherData.trafficIndex > 60 ? 'moderate' : 'light';
    const etaInfo = window.journeyETA || { distance: '0', timeFormatted: 'calculating' };
    
    return `The journey from ${journeyStart} to ${journeyEnd} covers approximately ${etaInfo.distance} km with an estimated travel time of ${etaInfo.timeFormatted} under current conditions. The route experiences ${aqiStatus} air quality (AQI: ${weatherData.aqi.toFixed(0)}) with temperatures at ${weatherData.temperature.toFixed(1)}°C and ${weatherData.humidity.toFixed(0)}% humidity. Traffic conditions are ${trafficStatus} with a congestion index of ${weatherData.trafficIndex.toFixed(0)}%, which ${weatherData.trafficIndex > 75 ? 'may extend travel time' : 'should allow smooth travel'}. Wind speeds of ${weatherData.windSpeed.toFixed(1)} km/h and UV index of ${weatherData.uvIndex} indicate ${weatherData.uvIndex > 7 ? 'high sun exposure' : 'moderate environmental conditions'}.<br><br>For optimal travel, ${weatherData.trafficIndex > 75 ? 'consider alternative routes or travel during off-peak hours to reduce the journey time' : 'current traffic conditions are favorable for your planned route'}. ${weatherData.aqi > 100 ? 'Wear a mask due to elevated pollution levels, especially if traveling with windows down' : 'Air quality is acceptable for travel'}. ${weatherData.uvIndex > 7 ? 'Use sun protection as UV levels are high' : 'Standard precautions are sufficient'}. Stay hydrated and plan for ${weatherData.temperature > 32 ? 'hot weather conditions with air conditioning recommended' : 'comfortable temperatures during your journey'}.`;
}


// Render destination analysis
async function renderDestinationAnalysis() {
    const container = document.getElementById('destinationAnalysis');
    
    // Show loading state
    container.innerHTML = `
        <div class="glass-card p-8 text-center">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-400">Analyzing journey conditions...</p>
        </div>
    `;
    
    // Get AI insights
    const insights = await getJourneyInsights();
    
    // Render full analysis
    container.innerHTML = `
        <!-- AI Insights -->
        <div class="glass-card p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="analysis-icon">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                </div>
                <h2 class="text-xl font-space font-bold text-white">Journey Analysis</h2>
            </div>
            <div class="text-gray-300 leading-relaxed">${insights}</div>
        </div>
        
        <!-- Weather Metrics -->
        <div class="grid md:grid-cols-4 gap-4 mb-6">
            <div class="glass-card p-6">
                <div class="flex items-center justify-between mb-3">
                    <div class="metric-icon bg-gradient-to-br from-orange-500 to-red-500">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                        </svg>
                    </div>
                </div>
                <div class="text-3xl font-bold text-white mb-1">${weatherData.temperature.toFixed(1)}°C</div>
                <div class="text-sm text-gray-400">Temperature</div>
            </div>
            
            <div class="glass-card p-6">
                <div class="flex items-center justify-between mb-3">
                    <div class="metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                        </svg>
                    </div>
                </div>
                <div class="text-3xl font-bold text-white mb-1">${weatherData.aqi.toFixed(0)}</div>
                <div class="text-sm text-gray-400">Air Quality Index</div>
            </div>
            
            <div class="glass-card p-6">
                <div class="flex items-center justify-between mb-3">
                    <div class="metric-icon bg-gradient-to-br from-purple-500 to-pink-500">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                </div>
                <div class="text-3xl font-bold text-white mb-1">${weatherData.trafficIndex.toFixed(0)}%</div>
                <div class="text-sm text-gray-400">Traffic Index</div>
            </div>
            
            <div class="glass-card p-6">
                <div class="flex items-center justify-between mb-3">
                    <div class="metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
                        </svg>
                    </div>
                </div>
                <div class="text-3xl font-bold text-white mb-1">${weatherData.windSpeed.toFixed(1)}</div>
                <div class="text-sm text-gray-400">Wind Speed (km/h)</div>
            </div>
        </div>
        
        <!-- Additional Details -->
        <div class="grid md:grid-cols-2 gap-6">
            <div class="glass-card p-6">
                <h3 class="text-lg font-space font-semibold mb-4 text-white">Environmental Conditions</h3>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">Humidity</span>
                        <span class="text-white font-semibold">${weatherData.humidity.toFixed(0)}%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">Visibility</span>
                        <span class="text-white font-semibold">${weatherData.visibility.toFixed(1)} km</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">UV Index</span>
                        <span class="text-white font-semibold">${weatherData.uvIndex} ${weatherData.uvIndex > 7 ? '(High)' : weatherData.uvIndex > 5 ? '(Moderate)' : '(Low)'}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">Rainfall</span>
                        <span class="text-white font-semibold">${weatherData.rainfall.toFixed(0)} mm</span>
                    </div>
                </div>
            </div>
            
            <div class="glass-card p-6">
                <h3 class="text-lg font-space font-semibold mb-4 text-white">Travel Recommendations</h3>
                <div class="space-y-3">
                    ${weatherData.aqi > 100 ? '<div class="recommendation-item warning">😷 Wear a mask - Air quality is poor</div>' : '<div class="recommendation-item success">✓ Air quality is acceptable</div>'}
                    ${weatherData.trafficIndex > 75 ? '<div class="recommendation-item warning">🚗 Heavy traffic expected - Plan extra time</div>' : '<div class="recommendation-item success">✓ Traffic conditions are favorable</div>'}
                    ${weatherData.uvIndex > 7 ? '<div class="recommendation-item warning">☀️ High UV - Use sun protection</div>' : '<div class="recommendation-item success">✓ UV levels are moderate</div>'}
                    ${weatherData.temperature > 32 ? '<div class="recommendation-item warning">🌡️ Hot weather - Stay hydrated</div>' : '<div class="recommendation-item success">✓ Temperature is comfortable</div>'}
                </div>
            </div>
        </div>
    `;
}


// Initialize everything when page loads
window.addEventListener('DOMContentLoaded', async () => {
    await initializeRouteMap();
    await renderDestinationAnalysis();
    initTrafficReportSystem();
    displayTrafficReports();
});


// Traffic Report System
function initTrafficReportSystem() {
    const modal = document.getElementById('trafficReportModal');
    const reportBtn = document.getElementById('reportTrafficBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const submitBtn = document.getElementById('submitTrafficReport');
    const customTimeInput = document.getElementById('customTimeInput');
    
    // Open modal
    reportBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    // Toggle custom time input
    document.querySelectorAll('input[name="timeOption"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customTimeInput.classList.remove('hidden');
            } else {
                customTimeInput.classList.add('hidden');
            }
        });
    });
    
    // Submit report
    submitBtn.addEventListener('click', () => {
        const timeOption = document.querySelector('input[name="timeOption"]:checked').value;
        const severity = document.querySelector('input[name="severity"]:checked').value;
        
        let reportTime;
        if (timeOption === 'current') {
            reportTime = new Date().toISOString();
        } else {
            const customTime = document.getElementById('customDateTime').value;
            if (!customTime) {
                alert('Please select a date and time');
                return;
            }
            reportTime = new Date(customTime).toISOString();
        }
        
        saveTrafficReport({
            route: `${journeyStart} → ${journeyEnd}`,
            time: reportTime,
            severity: severity,
            reportedAt: new Date().toISOString()
        });
        
        modal.classList.add('hidden');
        displayTrafficReports();
        
        // Show success message
        showNotification('Traffic report submitted successfully!');
    });
}

// Save traffic report to localStorage
function saveTrafficReport(report) {
    const reports = getTrafficReports();
    reports.push(report);
    localStorage.setItem('trafficReports', JSON.stringify(reports));
}

// Get all traffic reports
function getTrafficReports() {
    const reports = localStorage.getItem('trafficReports');
    return reports ? JSON.parse(reports) : [];
}

// Get reports for current route
function getRouteReports() {
    const allReports = getTrafficReports();
    const currentRoute = `${journeyStart} → ${journeyEnd}`;
    return allReports.filter(report => report.route === currentRoute);
}

// Display traffic reports
function displayTrafficReports() {
    const container = document.getElementById('trafficReportsDisplay');
    const reports = getRouteReports();
    
    if (reports.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    // Sort by time (most recent first)
    reports.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    
    // Show only last 3 reports
    const recentReports = reports.slice(0, 3);
    
    container.innerHTML = `
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(168, 85, 247, 0.2);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <svg width="16" height="16" fill="none" stroke="#a855f7" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span style="color: #a855f7; font-weight: 600; font-size: 14px;">Recent Traffic Reports</span>
            </div>
            ${recentReports.map(report => {
                const reportDate = new Date(report.time);
                const timeAgo = getTimeAgo(new Date(report.reportedAt));
                return `
                    <div class="traffic-report-item">
                        <span class="traffic-report-badge ${report.severity}">${report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}</span>
                        <span class="traffic-report-time">
                            ${reportDate.toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </span>
                        <span style="color: #6b7280; font-size: 12px; margin-left: auto;">${timeAgo}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Calculate time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
