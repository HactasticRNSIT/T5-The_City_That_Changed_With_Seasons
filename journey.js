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
