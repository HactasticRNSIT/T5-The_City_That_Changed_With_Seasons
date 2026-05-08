// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    html.classList.remove('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
} else {
    html.classList.add('dark');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    
    if (html.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        localStorage.setItem('theme', 'light');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
    
    // Redraw charts on theme change
    setTimeout(() => {
        drawAQIChart();
        drawTrafficChart();
        drawHeatmap();
    }, 100);
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
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

// Realistic AQI data based on seasonal patterns
const aqiData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [85, 78, 65, 52, 45, 38, 35, 42, 48, 58, 72, 82] // Winter higher, summer lower
};

// AQI Chart with smooth curves
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
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Y-axis labels
        const value = Math.round(max - (max / 5) * i);
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(value, padding - 10, y + 4);
    }
    
    // Calculate smooth curve points using Catmull-Rom spline
    const points = aqiData.values.map((value, index) => ({
        x: padding + (chartWidth / (aqiData.values.length - 1)) * index,
        y: padding + chartHeight - (value / max) * chartHeight
    }));
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Draw smooth curve
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
    
    // Draw line
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Draw points
    points.forEach((point, index) => {
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#0a0a0f';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw X-axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    aqiData.labels.forEach((label, index) => {
        const x = padding + (chartWidth / (aqiData.labels.length - 1)) * index;
        ctx.fillText(label, x, height - 15);
    });
}

// Traffic data - realistic hourly patterns
const trafficData = {
    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'],
    values: [45, 85, 72, 68, 65, 78, 92, 75, 55, 35, 20, 25] // Peak hours higher
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
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars
    trafficData.values.forEach((value, index) => {
        const x = padding + (chartWidth / trafficData.values.length) * index + 6;
        const barHeight = (value / max) * chartHeight;
        const y = padding + chartHeight - barHeight;
        
        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#a855f7');
        gradient.addColorStop(1, '#7c3aed');
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
        ctx.shadowBlur = 15;
        
        // Rounded rectangle
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    });
    
    // Draw labels
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

// Realistic heatmap data - simulating urban heat distribution
function generateHeatmapData() {
    const gridSize = 20;
    const data = [];
    
    // Create realistic heat patterns with hot spots
    for (let y = 0; y < gridSize; y++) {
        const row = [];
        for (let x = 0; x < gridSize; x++) {
            // Create multiple heat centers
            const center1 = Math.sqrt(Math.pow(x - 5, 2) + Math.pow(y - 5, 2));
            const center2 = Math.sqrt(Math.pow(x - 15, 2) + Math.pow(y - 8, 2));
            const center3 = Math.sqrt(Math.pow(x - 10, 2) + Math.pow(y - 15, 2));
            
            // Combine heat sources with decay
            let heat = 0;
            heat += Math.max(0, 42 - center1 * 2);
            heat += Math.max(0, 38 - center2 * 1.8);
            heat += Math.max(0, 35 - center3 * 2.2);
            
            // Add some noise for realism
            heat += (Math.random() - 0.5) * 5;
            
            // Clamp between 15-42°C
            heat = Math.max(15, Math.min(42, heat));
            
            row.push(heat);
        }
        data.push(row);
    }
    
    return data;
}

// Draw Heatmap
function drawHeatmap() {
    const canvas = document.getElementById('heatmapCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 220;
    canvas.width = width;
    canvas.height = height;
    
    const heatmapData = generateHeatmapData();
    const gridSize = heatmapData.length;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw heatmap cells
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const temp = heatmapData[y][x];
            const normalized = (temp - 15) / (42 - 15); // Normalize to 0-1
            
            // Color interpolation: blue -> purple -> red
            let r, g, b;
            if (normalized < 0.5) {
                // Blue to purple
                const t = normalized * 2;
                r = Math.round(59 + (168 - 59) * t);
                g = Math.round(130 - 130 * t);
                b = Math.round(246 + (247 - 246) * t);
            } else {
                // Purple to red
                const t = (normalized - 0.5) * 2;
                r = Math.round(168 + (239 - 168) * t);
                g = Math.round(85 - 85 * t);
                b = Math.round(247 - (247 - 68) * t);
            }
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.7 + normalized * 0.3})`;
            ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
    }
    
    // Add blur effect for smoother appearance
    ctx.filter = 'blur(3px)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
}

// Polyfill for roundRect if not available
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radii) {
        if (!Array.isArray(radii)) radii = [radii, radii, radii, radii];
        this.moveTo(x + radii[0], y);
        this.lineTo(x + width - radii[1], y);
        this.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
        this.lineTo(x + width, y + height - radii[2]);
        this.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
        this.lineTo(x + radii[3], y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
        this.lineTo(x, y + radii[0]);
        this.quadraticCurveTo(x, y, x + radii[0], y);
        return this;
    };
}

// Initial draw
setTimeout(() => {
    drawAQIChart();
    drawTrafficChart();
    drawHeatmap();
}, 100);

// Redraw on window resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        drawAQIChart();
        drawTrafficChart();
        drawHeatmap();
    }, 250);
});

// Smooth scroll for CTA button
document.querySelector('.cta-button').addEventListener('click', (e) => {
    e.preventDefault();
    const featuresSection = document.querySelector('section:nth-of-type(2)');
    featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Optimized parallax effect for gradient orbs (disabled for performance)
// Parallax is now handled by CSS animations only

// Animate metrics on scroll
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

// Add smooth reveal animation to hero section
window.addEventListener('load', () => {
    const hero = document.querySelector('.fade-in');
    if (hero) {
        hero.style.opacity = '0';
        setTimeout(() => {
            hero.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            hero.style.opacity = '1';
        }, 100);
    }
});
