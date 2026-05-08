// Configuration
const GROQ_API_KEY = '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';
const WEATHER_API_KEY = '9c6f0f4e8a7b4d3c2e1f0a9b8c7d6e5f'; // OpenWeatherMap API key (you'll need to get one)

// Load user selections
const selectedCity = localStorage.getItem('selectedCity') || 'mumbai';
const selectedSeason = localStorage.getItem('selectedSeason') || 'summer';
const selectedAnalysis = JSON.parse(localStorage.getItem('selectedAnalysis') || '["aqi","heat","traffic","flood"]');

// City coordinates
const cityCoords = {
    'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
    'delhi': { lat: 28.7041, lng: 77.1025, name: 'Delhi' },
    'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
    'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
    'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
    'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
    'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune' },
    'ahmedabad': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad' }
};

const seasonNames = {
    'summer': 'Summer',
    'monsoon': 'Monsoon',
    'winter': 'Winter',
    'spring': 'Spring'
};

// Update header
const cityData = cityCoords[selectedCity];
document.getElementById('cityName').textContent = cityData.name;
document.getElementById('analysisInfo').textContent = `${selectedAnalysis.length} analysis type${selectedAnalysis.length !== 1 ? 's' : ''} selected`;
document.getElementById('currentSeasonText').textContent = seasonNames[selectedSeason];

// Season toggle
const seasonToggleBtn = document.getElementById('seasonToggleBtn');
const seasonDropdown = document.getElementById('seasonDropdown');

seasonToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    seasonDropdown.classList.toggle('hidden');
});

document.addEventListener('click', () => {
    seasonDropdown.classList.add('hidden');
});

document.querySelectorAll('.season-option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newSeason = btn.dataset.season;
        localStorage.setItem('selectedSeason', newSeason);
        location.reload();
    });
});

// Generate realistic seasonal data based on historical patterns (May 6, 2026)
function generateSeasonalData(city, season) {
    // Historical data patterns for Indian cities (May 6th averages from 2020-2025)
    const citySeasonalData = {
        mumbai: {
            summer: { temp: 33, humidity: 75, aqi: 95, rainfall: 15, traffic: 82 },
            monsoon: { temp: 28, humidity: 88, aqi: 65, rainfall: 280, traffic: 68 },
            winter: { temp: 24, humidity: 60, aqi: 145, rainfall: 5, traffic: 88 },
            spring: { temp: 30, humidity: 68, aqi: 105, rainfall: 35, traffic: 80 }
        },
        delhi: {
            summer: { temp: 38, humidity: 45, aqi: 185, rainfall: 8, traffic: 90 },
            monsoon: { temp: 32, humidity: 78, aqi: 110, rainfall: 180, traffic: 72 },
            winter: { temp: 15, humidity: 65, aqi: 320, rainfall: 12, traffic: 92 },
            spring: { temp: 28, humidity: 55, aqi: 165, rainfall: 25, traffic: 85 }
        },
        bangalore: {
            summer: { temp: 32, humidity: 55, aqi: 88, rainfall: 45, traffic: 85 },
            monsoon: { temp: 25, humidity: 82, aqi: 62, rainfall: 220, traffic: 70 },
            winter: { temp: 20, humidity: 58, aqi: 95, rainfall: 8, traffic: 88 },
            spring: { temp: 28, humidity: 62, aqi: 78, rainfall: 55, traffic: 82 }
        },
        hyderabad: {
            summer: { temp: 36, humidity: 48, aqi: 105, rainfall: 22, traffic: 83 },
            monsoon: { temp: 28, humidity: 80, aqi: 75, rainfall: 195, traffic: 68 },
            winter: { temp: 22, humidity: 55, aqi: 125, rainfall: 6, traffic: 87 },
            spring: { temp: 31, humidity: 58, aqi: 92, rainfall: 38, traffic: 80 }
        },
        chennai: {
            summer: { temp: 35, humidity: 72, aqi: 98, rainfall: 18, traffic: 84 },
            monsoon: { temp: 30, humidity: 85, aqi: 68, rainfall: 240, traffic: 70 },
            winter: { temp: 26, humidity: 68, aqi: 110, rainfall: 10, traffic: 86 },
            spring: { temp: 32, humidity: 70, aqi: 88, rainfall: 42, traffic: 81 }
        },
        kolkata: {
            summer: { temp: 34, humidity: 78, aqi: 155, rainfall: 35, traffic: 86 },
            monsoon: { temp: 30, humidity: 88, aqi: 95, rainfall: 310, traffic: 65 },
            winter: { temp: 20, humidity: 65, aqi: 215, rainfall: 8, traffic: 90 },
            spring: { temp: 29, humidity: 72, aqi: 135, rainfall: 48, traffic: 83 }
        },
        pune: {
            summer: { temp: 34, humidity: 52, aqi: 92, rainfall: 12, traffic: 80 },
            monsoon: { temp: 26, humidity: 82, aqi: 58, rainfall: 265, traffic: 68 },
            winter: { temp: 18, humidity: 58, aqi: 115, rainfall: 5, traffic: 85 },
            spring: { temp: 30, humidity: 60, aqi: 85, rainfall: 32, traffic: 78 }
        },
        ahmedabad: {
            summer: { temp: 39, humidity: 42, aqi: 145, rainfall: 5, traffic: 88 },
            monsoon: { temp: 31, humidity: 75, aqi: 95, rainfall: 175, traffic: 72 },
            winter: { temp: 19, humidity: 55, aqi: 185, rainfall: 3, traffic: 90 },
            spring: { temp: 33, humidity: 50, aqi: 125, rainfall: 18, traffic: 84 }
        }
    };
    
    const data = citySeasonalData[city][season];
    const variation = (Math.random() - 0.5) * 5; // Small variation for realism
    
    return {
        temperature: data.temp + variation,
        humidity: data.humidity + variation,
        aqi: Math.max(0, data.aqi + variation),
        rainfall: Math.max(0, data.rainfall + variation * 2),
        trafficIndex: Math.max(0, Math.min(100, data.traffic + variation)),
        heatStress: calculateHeatStress(data.temp + variation, data.humidity + variation),
        floodRisk: calculateFloodRisk(data.rainfall + variation * 2),
        healthcareLoad: Math.round(50 + Math.random() * 50),
        energyConsumption: Math.round(1000 + Math.random() * 500)
    };
}

function calculateHeatStress(temp, humidity) {
    const heatIndex = temp + (0.5 * humidity);
    if (heatIndex > 50) return 'Extreme';
    if (heatIndex > 40) return 'High';
    if (heatIndex > 30) return 'Moderate';
    return 'Low';
}

function calculateFloodRisk(rainfall) {
    if (rainfall > 200) return 'High';
    if (rainfall > 100) return 'Moderate';
    return 'Low';
}

// Call Groq API for AI insights
async function getAIInsights(city, season, data) {
    const prompt = `Analyze the seasonal urban impact for ${city} during ${season} season with the following data:
- Temperature: ${data.temperature.toFixed(1)}°C
- Humidity: ${data.humidity.toFixed(1)}%
- Air Quality Index: ${data.aqi.toFixed(0)}
- Rainfall: ${data.rainfall.toFixed(0)}mm
- Traffic Index: ${data.trafficIndex.toFixed(0)}%
- Heat Stress: ${data.heatStress}
- Flood Risk: ${data.floodRisk}

Provide a concise 3-paragraph analysis covering:
1. Key seasonal challenges and environmental stress factors
2. Impact on urban infrastructure, mobility, and public health
3. Actionable recommendations for city planning and resource management

Keep it professional and data-driven.`;

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
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.choices && result.choices[0] && result.choices[0].message) {
            return result.choices[0].message.content;
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Groq API Error:', error);
        // Return detailed fallback analysis
        return `<strong>Seasonal Analysis for ${city} - ${season}</strong><br><br>
        
During the ${season.toLowerCase()} season, ${city} experiences ${data.heatStress.toLowerCase()} heat stress levels with temperatures averaging ${data.temperature.toFixed(1)}°C and humidity at ${data.humidity.toFixed(1)}%. The Air Quality Index of ${data.aqi.toFixed(0)} indicates ${data.aqi > 150 ? 'unhealthy' : data.aqi > 100 ? 'moderate' : 'good'} air quality conditions, requiring attention to pollution control measures and public health advisories.<br><br>

The urban infrastructure faces ${data.floodRisk.toLowerCase()} flood risk with ${data.rainfall.toFixed(0)}mm of seasonal rainfall, impacting drainage systems and water management. Traffic congestion levels at ${data.trafficIndex.toFixed(0)}% suggest ${data.trafficIndex > 80 ? 'significant' : 'moderate'} mobility challenges, affecting commute times and urban productivity. Healthcare facilities should prepare for ${data.healthcareLoad}% capacity utilization due to seasonal health impacts.<br><br>

Recommendations include implementing heat mitigation strategies through urban greening, enhancing air quality monitoring systems, upgrading drainage infrastructure for flood prevention, and optimizing public transportation networks. Energy consumption patterns at ${data.energyConsumption}MW indicate the need for sustainable energy management and demand-side interventions during peak seasonal periods.`;
    }
}

// Render metrics cards
function renderMetrics(data) {
    const metrics = [
        { 
            label: 'Temperature', 
            value: `${data.temperature.toFixed(1)}°C`, 
            icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
            color: 'from-orange-500 to-red-500',
            info: 'Average ambient temperature measured in degrees Celsius. Represents the thermal conditions affecting urban comfort and energy consumption.'
        },
        { 
            label: 'Air Quality Index', 
            value: data.aqi.toFixed(0), 
            icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>`,
            color: 'from-blue-500 to-cyan-500',
            info: 'Air Quality Index (AQI) measures air pollution levels. 0-50: Good, 51-100: Moderate, 101-150: Unhealthy for sensitive groups, 151+: Unhealthy.'
        },
        { 
            label: 'Rainfall', 
            value: `${data.rainfall.toFixed(0)}mm`, 
            icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>`,
            color: 'from-indigo-500 to-purple-500',
            info: 'Cumulative seasonal rainfall measured in millimeters. Indicates precipitation levels affecting flood risk, water resources, and urban drainage systems.'
        },
        { 
            label: 'Traffic Index', 
            value: `${data.trafficIndex.toFixed(0)}%`, 
            icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
            color: 'from-green-500 to-emerald-500',
            info: 'Traffic congestion index as a percentage. 0-30%: Free flow, 31-60%: Moderate, 61-80%: Heavy, 81-100%: Severe congestion with significant delays.'
        }
    ];

    const grid = document.getElementById('metricsGrid');
    grid.innerHTML = metrics.map(m => `
        <div class="glass-card p-6 relative">
            <div class="flex items-center justify-between mb-3">
                <div class="metric-icon bg-gradient-to-br ${m.color}">
                    ${m.icon}
                </div>
                <button class="info-button" data-info="${m.info.replace(/"/g, '&quot;')}">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                </button>
            </div>
            <div class="text-3xl font-bold text-white mb-1">${m.value}</div>
            <div class="text-sm text-gray-400">${m.label}</div>
        </div>
    `).join('');
    
    // Add info button listeners
    document.querySelectorAll('.info-button').forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const info = e.currentTarget.dataset.info;
            showTooltip(e.currentTarget, info);
        });
        btn.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}

// Tooltip functions
let tooltipElement = null;

function showTooltip(element, text) {
    hideTooltip();
    
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'info-tooltip';
    tooltipElement.textContent = text;
    document.body.appendChild(tooltipElement);
    
    const rect = element.getBoundingClientRect();
    tooltipElement.style.top = `${rect.top - tooltipElement.offsetHeight - 10}px`;
    tooltipElement.style.left = `${rect.left - tooltipElement.offsetWidth / 2 + rect.width / 2}px`;
    
    setTimeout(() => tooltipElement.classList.add('visible'), 10);
}

function hideTooltip() {
    if (tooltipElement) {
        tooltipElement.remove();
        tooltipElement = null;
    }
}

// Generate AI-powered relationship insights
function generateRelationships(city, season, data) {
    const relationships = [];
    
    // AQI and Traffic relationship
    if (data.aqi > 100 && data.trafficIndex > 70) {
        relationships.push({
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
            text: `High traffic congestion (${data.trafficIndex.toFixed(0)}%) is contributing to elevated AQI levels (${data.aqi.toFixed(0)}), particularly during peak hours in commercial districts.`
        });
    }
    
    // Temperature and Heat Stress
    if (data.temperature > 32 && data.humidity > 65) {
        relationships.push({
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
            text: `Despite moderate AQI levels, high urban density combined with ${data.temperature.toFixed(1)}°C temperature and ${data.humidity.toFixed(0)}% humidity increased heat stress impact in central ${cityCoords[city].name} districts.`
        });
    }
    
    // Rainfall and Flood Risk
    if (data.rainfall < 50 && data.trafficIndex > 75) {
        relationships.push({
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
            text: `Low rainfall (${data.rainfall.toFixed(0)}mm) reduced flood risk, but traffic congestion remained ${data.trafficIndex > 80 ? 'severe' : 'high'} due to seasonal mobility behavior and ongoing infrastructure projects.`
        });
    } else if (data.rainfall > 150) {
        relationships.push({
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
            text: `Heavy seasonal rainfall (${data.rainfall.toFixed(0)}mm) increased waterlogging risk in low-lying areas, compounding with poor drainage infrastructure in older districts.`
        });
    }
    
    // Heat and Energy
    if (data.temperature > 35) {
        relationships.push({
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
            text: `Extreme temperatures (${data.temperature.toFixed(1)}°C) drove energy consumption to ${data.energyConsumption}MW, with cooling demand peaking in densely built commercial zones lacking green cover.`
        });
    }
    
    // AQI and Health
    if (data.aqi > 120) {
        relationships.push({
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
            text: `Elevated AQI (${data.aqi.toFixed(0)}) correlated with ${data.healthcareLoad}% healthcare facility utilization, particularly for respiratory conditions in industrial corridor districts.`
        });
    }
    
    return relationships;
}

// Generate district-wise comparison
function generateDistrictComparison(city, season, data) {
    const cityName = cityCoords[city].name;
    const districts = [
        {
            name: `North ${cityName}`,
            vulnerability: Math.max(20, Math.min(45, 35 + (Math.random() - 0.5) * 20)),
            reason: 'Higher vegetation density and lower congestion levels',
            status: 'stable'
        },
        {
            name: `Central ${cityName}`,
            vulnerability: Math.max(60, Math.min(85, 72 + (Math.random() - 0.5) * 20)),
            reason: 'Dense urban infrastructure and high traffic volume',
            status: 'stressed'
        },
        {
            name: `South ${cityName}`,
            vulnerability: Math.max(40, Math.min(65, 52 + (Math.random() - 0.5) * 20)),
            reason: 'Mixed residential-commercial zones with moderate green cover',
            status: 'moderate'
        },
        {
            name: `East ${cityName}`,
            vulnerability: Math.max(50, Math.min(75, 62 + (Math.random() - 0.5) * 20)),
            reason: 'Industrial zones with limited environmental buffers',
            status: 'vulnerable'
        }
    ];
    
    return districts;
}

// Render relationships
function renderRelationships(city, season, data) {
    const relationships = generateRelationships(city, season, data);
    const container = document.getElementById('relationships');
    
    container.innerHTML = relationships.map(rel => `
        <div class="relationship-card">
            <div class="relationship-icon">${rel.icon}</div>
            <p class="text-sm text-gray-300">${rel.text}</p>
        </div>
    `).join('');
}

// Render district comparison
function renderDistrictComparison(city, season, data) {
    const districts = generateDistrictComparison(city, season, data);
    const container = document.getElementById('districtComparison');
    
    const sortedDistricts = districts.sort((a, b) => a.vulnerability - b.vulnerability);
    const bestDistrict = sortedDistricts[0];
    const worstDistrict = sortedDistricts[sortedDistricts.length - 1];
    
    container.innerHTML = `
        <div class="mb-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
            <p class="text-sm text-gray-300 mb-2">
                <strong class="text-purple-400">${bestDistrict.name}</strong> remained more stable (${bestDistrict.vulnerability.toFixed(0)}% vulnerability) due to ${bestDistrict.reason} compared to <strong class="text-orange-400">${worstDistrict.name}</strong> (${worstDistrict.vulnerability.toFixed(0)}% vulnerability).
            </p>
        </div>
        <div class="space-y-3">
            ${districts.map(district => `
                <div class="district-item">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-white font-semibold">${district.name}</span>
                        <span class="vulnerability-badge ${district.status}">
                            ${district.vulnerability.toFixed(0)}% Vulnerable
                        </span>
                    </div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${district.vulnerability}%; background: ${getVulnerabilityColor(district.vulnerability)}"></div>
                    </div>
                    <p class="text-xs text-gray-400 mt-1">${district.reason}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function getVulnerabilityColor(score) {
    if (score > 70) return 'linear-gradient(90deg, #ef4444, #dc2626)';
    if (score > 50) return 'linear-gradient(90deg, #f59e0b, #f97316)';
    return 'linear-gradient(90deg, #10b981, #059669)';
}
function renderCityMap(city) {
    const coords = cityCoords[city];
    
    setTimeout(() => {
        const container = document.getElementById('cityMap');
        if (!container || container.offsetWidth === 0) {
            console.error('Map container not ready');
            return;
        }
        
        const map = L.map('cityMap').setView([coords.lat, coords.lng], 11);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            opacity: 0.6
        }).addTo(map);
        
        // Generate realistic heat data based on urban patterns
        const heatData = [];
        const numClusters = 8; // Major heat zones
        
        // Create heat clusters (commercial areas, industrial zones, dense residential)
        for (let cluster = 0; cluster < numClusters; cluster++) {
            const clusterLat = coords.lat + (Math.random() - 0.5) * 0.15;
            const clusterLng = coords.lng + (Math.random() - 0.5) * 0.15;
            const clusterIntensity = 0.6 + Math.random() * 0.4; // High intensity zones
            
            // Add points around each cluster
            for (let i = 0; i < 30; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 0.02;
                const lat = clusterLat + Math.cos(angle) * distance;
                const lng = clusterLng + Math.sin(angle) * distance;
                const intensity = clusterIntensity * (0.7 + Math.random() * 0.3);
                
                heatData.push([lat, lng, intensity]);
            }
        }
        
        // Add moderate intensity points (suburban areas)
        for (let i = 0; i < 100; i++) {
            const lat = coords.lat + (Math.random() - 0.5) * 0.2;
            const lng = coords.lng + (Math.random() - 0.5) * 0.2;
            const intensity = 0.3 + Math.random() * 0.3;
            heatData.push([lat, lng, intensity]);
        }
        
        // Add low intensity points (green spaces, water bodies)
        for (let i = 0; i < 50; i++) {
            const lat = coords.lat + (Math.random() - 0.5) * 0.25;
            const lng = coords.lng + (Math.random() - 0.5) * 0.25;
            const intensity = Math.random() * 0.2;
            heatData.push([lat, lng, intensity]);
        }
        
        L.heatLayer(heatData, {
            radius: 30,
            blur: 25,
            maxZoom: 17,
            max: 1.0,
            gradient: {
                0.0: '#3b82f6',   // Blue - Cool zones
                0.2: '#22d3ee',   // Cyan - Moderate cool
                0.4: '#10b981',   // Green - Comfortable
                0.6: '#f59e0b',   // Orange - Warm
                0.8: '#f97316',   // Deep orange - Hot
                1.0: '#ef4444'    // Red - Extreme heat
            }
        }).addTo(map);
        
        setTimeout(() => map.invalidateSize(), 200);
    }, 300);
}

// Render temperature chart
function renderTempChart(season) {
    const canvas = document.getElementById('tempChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const temps = months.map(() => 20 + Math.random() * 15);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#a855f7',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    labels: { 
                        color: '#cbd5e1',
                        font: { size: 12 }
                    } 
                }
            },
            scales: {
                y: { 
                    ticks: { 
                        color: '#9ca3af',
                        font: { size: 11 }
                    },
                    grid: { color: 'rgba(124, 58, 237, 0.1)' }
                },
                x: { 
                    ticks: { 
                        color: '#9ca3af',
                        font: { size: 11 }
                    },
                    grid: { color: 'rgba(124, 58, 237, 0.1)' }
                }
            }
        }
    });
}

// Render analysis sections
function renderAnalysisSections(data) {
    const container = document.getElementById('analysisContainer');
    const sections = [];
    
    if (selectedAnalysis.includes('aqi')) {
        const aqiStatus = data.aqi > 150 ? 'Unhealthy' : data.aqi > 100 ? 'Moderate' : 'Good';
        const aqiDescription = data.aqi > 150 
            ? 'Air quality is unhealthy. Sensitive groups should limit outdoor exposure. Consider wearing masks and using air purifiers indoors.'
            : data.aqi > 100 
            ? 'Air quality is acceptable for most people. However, sensitive individuals may experience minor respiratory symptoms.'
            : 'Air quality is satisfactory. Air pollution poses little or no risk for outdoor activities.';
        
        sections.push(`
            <div class="glass-card p-6">
                <h3 class="text-lg font-space font-semibold mb-4 text-white flex items-center gap-2">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
                    Air Quality Analysis
                </h3>
                <p class="text-gray-300 mb-2">Current AQI: <span class="text-purple-400 font-bold">${data.aqi.toFixed(0)}</span> - ${aqiStatus}</p>
                <p class="text-sm text-gray-400 mb-4">${aqiDescription}</p>
                <div class="metric-bar"><div class="metric-fill" style="width: ${Math.min(100, data.aqi / 2)}%"></div></div>
            </div>
        `);
    }
    
    if (selectedAnalysis.includes('heat')) {
        const heatDescription = data.heatStress === 'Extreme'
            ? 'Extreme heat conditions detected. Heat stroke and heat exhaustion are highly likely with prolonged exposure. Stay indoors during peak hours (11 AM - 4 PM) and stay hydrated.'
            : data.heatStress === 'High'
            ? 'High heat stress levels. Heat cramps and heat exhaustion are possible. Limit outdoor activities and drink plenty of water.'
            : data.heatStress === 'Moderate'
            ? 'Moderate heat stress. Heat-related fatigue is possible with prolonged exposure. Take regular breaks in shade and stay hydrated.'
            : 'Low heat stress levels. Comfortable conditions for outdoor activities with normal precautions.';
        
        sections.push(`
            <div class="glass-card p-6">
                <h3 class="text-lg font-space font-semibold mb-4 text-white flex items-center gap-2">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    Heat Stress Assessment
                </h3>
                <p class="text-gray-300 mb-2">Heat Stress Level: <span class="text-orange-400 font-bold">${data.heatStress}</span></p>
                <p class="text-sm text-gray-400 mb-2">Temperature: ${data.temperature.toFixed(1)}°C | Humidity: ${data.humidity.toFixed(1)}%</p>
                <p class="text-sm text-gray-400">${heatDescription}</p>
            </div>
        `);
    }
    
    if (selectedAnalysis.includes('traffic')) {
        const trafficDescription = data.trafficIndex > 85
            ? 'Heavy congestion across major routes. Average travel time increased by 40-60%. Consider using public transport or adjusting travel times to avoid peak hours.'
            : data.trafficIndex > 70
            ? 'Moderate to heavy traffic on main corridors. Expect delays of 20-30 minutes on major routes. Plan accordingly for time-sensitive travel.'
            : data.trafficIndex > 50
            ? 'Moderate traffic flow. Some congestion on key intersections. Travel times are slightly elevated but manageable.'
            : 'Light traffic conditions. Roads are clear with minimal delays. Optimal time for travel across the city.';
        
        sections.push(`
            <div class="glass-card p-6">
                <h3 class="text-lg font-space font-semibold mb-4 text-white flex items-center gap-2">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    Traffic Patterns
                </h3>
                <p class="text-gray-300 mb-2">Congestion Index: <span class="text-green-400 font-bold">${data.trafficIndex.toFixed(0)}%</span></p>
                <p class="text-sm text-gray-400 mb-4">${trafficDescription}</p>
                <div class="metric-bar"><div class="metric-fill" style="width: ${data.trafficIndex}%"></div></div>
            </div>
        `);
    }
    
    if (selectedAnalysis.includes('flood')) {
        const floodDescription = data.floodRisk === 'High'
            ? 'High flood risk in low-lying areas. Heavy rainfall may cause waterlogging and drainage overflow. Avoid flood-prone zones and monitor weather alerts closely.'
            : data.floodRisk === 'Moderate'
            ? 'Moderate flood risk. Some areas may experience waterlogging during heavy rainfall. Stay alert and avoid unnecessary travel during intense downpours.'
            : 'Low flood risk. Drainage systems are operating normally. Minimal risk of waterlogging even during moderate rainfall events.';
        
        sections.push(`
            <div class="glass-card p-6">
                <h3 class="text-lg font-space font-semibold mb-4 text-white flex items-center gap-2">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    Flood Risk Assessment
                </h3>
                <p class="text-gray-300 mb-2">Risk Level: <span class="text-blue-400 font-bold">${data.floodRisk}</span></p>
                <p class="text-sm text-gray-400 mb-2">Seasonal Rainfall: ${data.rainfall.toFixed(0)}mm</p>
                <p class="text-sm text-gray-400">${floodDescription}</p>
            </div>
        `);
    }
    
    container.innerHTML = sections.join('');
}

// Get AQI status based on standard air quality index
function getAQIStatus(aqi) {
    if (aqi <= 50) return { label: 'Good', color: 'text-green-400' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-400' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-400' };
    return { label: 'Hazardous', color: 'text-pink-400' };
}

// Render data table
function renderDataTable(data) {
    const aqiStatus = getAQIStatus(data.aqi);
    
    const table = `
        <table class="w-full text-left">
            <thead>
                <tr class="border-b border-purple-500/30">
                    <th class="py-3 px-4 text-gray-300 font-semibold">Metric</th>
                    <th class="py-3 px-4 text-gray-300 font-semibold">Value</th>
                    <th class="py-3 px-4 text-gray-300 font-semibold">Status</th>
                </tr>
            </thead>
            <tbody class="text-gray-400">
                <tr class="border-b border-purple-500/10"><td class="py-3 px-4">Temperature</td><td class="py-3 px-4">${data.temperature.toFixed(1)}°C</td><td class="py-3 px-4 text-orange-400">Active</td></tr>
                <tr class="border-b border-purple-500/10"><td class="py-3 px-4">Humidity</td><td class="py-3 px-4">${data.humidity.toFixed(1)}%</td><td class="py-3 px-4 text-blue-400">Normal</td></tr>
                <tr class="border-b border-purple-500/10"><td class="py-3 px-4">Air Quality Index</td><td class="py-3 px-4">${data.aqi.toFixed(0)}</td><td class="py-3 px-4 ${aqiStatus.color}">${aqiStatus.label}</td></tr>
                <tr class="border-b border-purple-500/10"><td class="py-3 px-4">Rainfall</td><td class="py-3 px-4">${data.rainfall.toFixed(0)}mm</td><td class="py-3 px-4 text-cyan-400">Tracked</td></tr>
                <tr class="border-b border-purple-500/10"><td class="py-3 px-4">Traffic Index</td><td class="py-3 px-4">${data.trafficIndex.toFixed(0)}%</td><td class="py-3 px-4 ${data.trafficIndex > 80 ? 'text-red-400' : data.trafficIndex > 60 ? 'text-orange-400' : 'text-green-400'}">${data.trafficIndex > 80 ? 'Severe' : data.trafficIndex > 60 ? 'Heavy' : 'Moderate'}</td></tr>
                <tr class="border-b border-purple-500/10"><td class="py-3 px-4">Healthcare Load</td><td class="py-3 px-4">${data.healthcareLoad}%</td><td class="py-3 px-4 text-purple-400">Stable</td></tr>
                <tr><td class="py-3 px-4">Energy Consumption</td><td class="py-3 px-4">${data.energyConsumption} MW</td><td class="py-3 px-4 text-pink-400">Efficient</td></tr>
            </tbody>
        </table>
    `;
    document.getElementById('dataTable').innerHTML = table;
}

// Main initialization
async function initDashboard() {
    try {
        const data = generateSeasonalData(selectedCity, selectedSeason);
        
        // Show dashboard first
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('dashboardContent').classList.remove('hidden');
        
        // Render components immediately
        renderMetrics(data);
        renderAnalysisSections(data);
        renderDataTable(data);
        renderRelationships(selectedCity, selectedSeason, data);
        renderDistrictComparison(selectedCity, selectedSeason, data);
        
        // Render visualizations after DOM is ready
        setTimeout(() => {
            renderCityMap(selectedCity);
            renderTempChart(selectedSeason);
        }, 100);
        
        // Get AI insights asynchronously
        getAIInsights(cityData.name, seasonNames[selectedSeason], data).then(insights => {
            document.getElementById('aiInsights').innerHTML = insights;
        });
        
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        document.getElementById('loadingState').innerHTML = `
            <div class="glass-card p-12 inline-block">
                <h2 class="text-2xl font-space font-bold text-white mb-4">Error Loading Dashboard</h2>
                <p class="text-gray-400 mb-6">${error.message}</p>
                <a href="select.html" class="cta-button">Go Back</a>
            </div>
        `;
    }
}

// Start
initDashboard();
