// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// Realistic AQI data
const aqiData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [85, 78, 65, 52, 45, 38, 35, 42, 48, 58, 72, 82]
};

// AQI Chart
function drawAQIChart() {
    const canvas = document.getElementById('aqiChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 220;
    canvas.width = width;
    canvas.height = height;
    
    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const max = Math.max(...aqiData.values) * 1.2;
    
    ctx.clearRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        const value = Math.round(max - (max / 5) * i);
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(value, padding - 10, y + 4);
    }
    
    // Points
    const points = aqiData.values.map((value, index) => ({
        x: padding + (chartWidth / (aqiData.values.length - 1)) * index,
        y: padding + chartHeight - (value / max) * chartHeight
    }));
    
    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].x, points[points.length - 1].y);
    
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Line
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();
    
    // Points
    points.forEach((point) => {
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#0a0a0f';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    aqiData.labels.forEach((label, index) => {
        const x = padding + (chartWidth / (aqiData.labels.length - 1)) * index;
        ctx.fillText(label, x, height - 15);
    });
}

// Traffic data
const trafficData = {
    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'],
    values: [45, 85, 72, 68, 65, 78, 92, 75, 55, 35, 20, 25]
};

// Traffic Chart
function drawTrafficChart() {
    const canvas = document.getElementById('trafficChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 220;
    canvas.width = width;
    canvas.height = height;
    
    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const max = 100;
    const barWidth = (chartWidth / trafficData.values.length) - 12;
    
    ctx.clearRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Bars
    trafficData.values.forEach((value, index) => {
        const x = padding + (chartWidth / trafficData.values.length) * index + 6;
        const barHeight = (value / max) * chartHeight;
        const y = padding + chartHeight - barHeight;
        
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#a855f7');
        gradient.addColorStop(1, '#7c3aed');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    trafficData.labels.forEach((label, index) => {
        if (index % 2 === 0) {
            const x = padding + (chartWidth / trafficData.values.length) * index + barWidth / 2 + 6;
            ctx.fillText(label, x, height - 15);
        }
    });
}

// Leaflet Heatmap
let heatmapMap = null;

function drawHeatmap() {
    const container = document.getElementById('heatmapCanvas');
    if (!container) return;
    
    // Clear existing map
    if (heatmapMap) {
        heatmapMap.remove();
    }
    
    // Initialize map centered on a city (e.g., New York)
    heatmapMap = L.map('heatmapCanvas', {
        center: [40.7128, -74.0060],
        zoom: 12,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        attributionControl: false
    });
    
    // Add dark tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        opacity: 0.6
    }).addTo(heatmapMap);
    
    // Generate realistic heat data points for urban areas
    const heatData = [];
    const baseLatLng = [40.7128, -74.0060];
    
    // Create multiple heat clusters (simulating urban hot spots)
    const clusters = [
        { lat: 40.7580, lng: -73.9855, intensity: 0.9, radius: 50 }, // Times Square area
        { lat: 40.7489, lng: -73.9680, intensity: 0.85, radius: 40 }, // Midtown
        { lat: 40.7061, lng: -74.0087, intensity: 0.8, radius: 45 }, // Financial District
        { lat: 40.7282, lng: -73.7949, intensity: 0.75, radius: 35 }, // Queens
        { lat: 40.6782, lng: -73.9442, intensity: 0.7, radius: 30 }, // Brooklyn
        { lat: 40.7831, lng: -73.9712, intensity: 0.65, radius: 25 }, // Upper West Side
        { lat: 40.7614, lng: -73.9776, intensity: 0.8, radius: 35 }, // Central Park South
        { lat: 40.7489, lng: -73.9680, intensity: 0.75, radius: 30 }  // East Side
    ];
    
    // Generate heat points around each cluster
    clusters.forEach(cluster => {
        for (let i = 0; i < cluster.radius; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 0.02;
            const lat = cluster.lat + Math.cos(angle) * distance;
            const lng = cluster.lng + Math.sin(angle) * distance;
            const intensity = cluster.intensity * (0.5 + Math.random() * 0.5);
            
            heatData.push([lat, lng, intensity]);
        }
    });
    
    // Add additional random points for realistic distribution
    for (let i = 0; i < 100; i++) {
        const lat = baseLatLng[0] + (Math.random() - 0.5) * 0.15;
        const lng = baseLatLng[1] + (Math.random() - 0.5) * 0.15;
        const intensity = Math.random() * 0.5;
        heatData.push([lat, lng, intensity]);
    }
    
    // Add heat layer with custom gradient
    L.heatLayer(heatData, {
        radius: 25,
        blur: 20,
        maxZoom: 17,
        max: 1.0,
        gradient: {
            0.0: '#3b82f6',
            0.25: '#22d3ee',
            0.5: '#a855f7',
            0.75: '#ec4899',
            1.0: '#ef4444'
        }
    }).addTo(heatmapMap);
    
    // Invalidate size after a short delay to ensure proper rendering
    setTimeout(() => {
        if (heatmapMap) {
            heatmapMap.invalidateSize();
        }
    }, 100);
}

// Initial draw
setTimeout(() => {
    drawAQIChart();
    drawTrafficChart();
    drawHeatmap();
}, 100);

// Redraw on resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        drawAQIChart();
        drawTrafficChart();
        drawHeatmap();
    }, 250);
});

// CTA button navigation
document.querySelector('.cta-button').addEventListener('click', (e) => {
    if (!e.target.closest('button').hasAttribute('onclick')) {
        e.preventDefault();
        const featuresSection = document.querySelector('section:nth-of-type(2)');
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Animate metrics
const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.metric-fill');
            fills.forEach(fill => {
                const targetWidth = fill.style.width;
                fill.style.width = '0';
                setTimeout(() => {
                    fill.style.width = targetWidth;
                }, 200);
            });
            metricsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const metricsCard = document.querySelector('.glass-card:has(.metric-item)');
if (metricsCard) {
    metricsObserver.observe(metricsCard);
}
