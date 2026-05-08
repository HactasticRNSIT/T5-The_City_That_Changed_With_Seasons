// Ticket System Logic
const TICKET_PREFIX = 'USIS-2024-';
let ticketCounter = parseInt(localStorage.getItem('ticketCounter') || '1');

// Show/Hide sections
document.getElementById('showReportForm').addEventListener('click', () => {
    document.getElementById('reportFormSection').classList.remove('hidden');
    document.getElementById('trackFormSection').classList.add('hidden');
    document.getElementById('ticketStatusSection').classList.add('hidden');
});

document.getElementById('showTrackForm').addEventListener('click', () => {
    document.getElementById('trackFormSection').classList.remove('hidden');
    document.getElementById('reportFormSection').classList.add('hidden');
    document.getElementById('ticketStatusSection').classList.add('hidden');
});

// Handle category change
document.getElementById('issueCategory').addEventListener('change', (e) => {
    const customDiv = document.getElementById('customCategoryDiv');
    if (e.target.value === 'other') {
        customDiv.classList.remove('hidden');
    } else {
        customDiv.classList.add('hidden');
    }
});

// Handle report form submission
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const category = document.getElementById('issueCategory').value;
    const customCategory = document.getElementById('customCategory').value;
    const location = document.getElementById('issueLocation').value;
    const description = document.getElementById('issueDescription').value;
    const attachments = document.getElementById('issueAttachments').files;
    
    // Generate ticket ID
    const ticketId = TICKET_PREFIX + String(ticketCounter).padStart(3, '0');
    ticketCounter++;
    localStorage.setItem('ticketCounter', ticketCounter);
    
    // Process attachments
    const attachmentData = [];
    for (let file of attachments) {
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
        attachmentData.push({
            name: file.name,
            data: dataUrl
        });
    }
    
    // Create ticket
    const ticket = {
        id: ticketId,
        category: category === 'other' ? customCategory : category,
        location: location,
        description: description,
        attachments: attachmentData,
        status: 'raised',
        createdAt: new Date().toISOString(),
        milestones: [
            { status: 'raised', label: 'Issue Raised', completed: true, date: new Date().toISOString() },
            { status: 'acknowledged', label: 'Acknowledged', completed: false, date: null },
            { status: 'in-progress', label: 'Work in Progress', completed: false, date: null },
            { status: 'resolved', label: 'Resolved', completed: false, date: null }
        ]
    };
    
    // Save ticket
    saveTicket(ticket);
    
    // Show success and ticket ID
    showTicketCreated(ticketId);
    
    // Reset form
    document.getElementById('reportForm').reset();
});

// Handle track form submission
document.getElementById('trackForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const ticketId = document.getElementById('ticketIdInput').value.trim();
    const ticket = getTicket(ticketId);
    
    if (ticket) {
        displayTicketStatus(ticket);
    } else {
        alert('Ticket not found. Please check the Ticket ID and try again.');
    }
});

// Save ticket to localStorage
function saveTicket(ticket) {
    const tickets = getAllTickets();
    tickets.push(ticket);
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
}

// Get all tickets
function getAllTickets() {
    const tickets = localStorage.getItem('supportTickets');
    return tickets ? JSON.parse(tickets) : [];
}

// Get specific ticket
function getTicket(ticketId) {
    const tickets = getAllTickets();
    return tickets.find(t => t.id === ticketId);
}

// Update ticket status
function updateTicketStatus(ticketId, newStatus) {
    const tickets = getAllTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (ticket) {
        ticket.status = newStatus;
        
        // Update milestones
        const milestoneIndex = ticket.milestones.findIndex(m => m.status === newStatus);
        if (milestoneIndex !== -1) {
            for (let i = 0; i <= milestoneIndex; i++) {
                ticket.milestones[i].completed = true;
                if (!ticket.milestones[i].date) {
                    ticket.milestones[i].date = new Date().toISOString();
                }
            }
        }
        
        localStorage.setItem('supportTickets', JSON.stringify(tickets));
    }
}

// Show ticket created message
function showTicketCreated(ticketId) {
    const section = document.getElementById('ticketStatusSection');
    section.innerHTML = `
        <div class="glass-card p-8">
            <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-4">
                    <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-space font-bold text-white mb-2">Ticket Created Successfully!</h3>
                <p class="text-gray-400 mb-4">Your issue has been reported and assigned a ticket ID</p>
                <div class="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg px-6 py-3 mb-6">
                    <p class="text-sm text-gray-400 mb-1">Your Ticket ID</p>
                    <p class="text-3xl font-bold gradient-text">${ticketId}</p>
                </div>
                <p class="text-sm text-gray-400 mb-6">Save this ID to track your ticket status</p>
                <button onclick="copyTicketId('${ticketId}')" class="cta-button-secondary">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    Copy Ticket ID
                </button>
            </div>
        </div>
    `;
    section.classList.remove('hidden');
    document.getElementById('reportFormSection').classList.add('hidden');
}

// Copy ticket ID
function copyTicketId(ticketId) {
    navigator.clipboard.writeText(ticketId);
    showNotification('Ticket ID copied to clipboard!');
}

// Display ticket status
function displayTicketStatus(ticket) {
    const section = document.getElementById('ticketStatusSection');
    const progress = (ticket.milestones.filter(m => m.completed).length / ticket.milestones.length) * 100;
    
    const categoryLabels = {
        'road-damage': 'Road Damage / Potholes',
        'traffic-signal': 'Traffic Signal Malfunction',
        'street-light': 'Street Light Issue',
        'drainage': 'Drainage / Flooding',
        'pollution': 'Air/Noise Pollution',
        'waste-management': 'Waste Management',
        'public-transport': 'Public Transport Issue'
    };
    
    section.innerHTML = `
        <div class="glass-card p-8">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-2xl font-space font-bold text-white mb-1">Ticket Status</h3>
                    <p class="text-gray-400">Ticket ID: <span class="text-purple-400 font-semibold">${ticket.id}</span></p>
                </div>
                <div class="ticket-status-badge ${ticket.status}">
                    ${ticket.status.replace('-', ' ').toUpperCase()}
                </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mb-8">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-gray-400">Overall Progress</span>
                    <span class="text-sm font-semibold text-purple-400">${Math.round(progress)}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            
            <!-- Milestones -->
            <div class="mb-8">
                <h4 class="text-lg font-semibold text-white mb-4">Progress Timeline</h4>
                <div class="milestone-timeline">
                    ${ticket.milestones.map((milestone, index) => `
                        <div class="milestone-item ${milestone.completed ? 'completed' : ''}">
                            <div class="milestone-marker">
                                ${milestone.completed ? 
                                    '<svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : 
                                    `<span>${index + 1}</span>`
                                }
                            </div>
                            <div class="milestone-content">
                                <h5 class="milestone-title">${milestone.label}</h5>
                                ${milestone.date ? 
                                    `<p class="milestone-date">${new Date(milestone.date).toLocaleString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric',
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}</p>` : 
                                    '<p class="milestone-date">Pending</p>'
                                }
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Ticket Details -->
            <div class="ticket-details">
                <h4 class="text-lg font-semibold text-white mb-4">Issue Details</h4>
                <div class="space-y-3">
                    <div class="detail-row">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">${categoryLabels[ticket.category] || ticket.category}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${ticket.location}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Reported:</span>
                        <span class="detail-value">${new Date(ticket.createdAt).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Description:</span>
                        <span class="detail-value">${ticket.description}</span>
                    </div>
                    ${ticket.attachments.length > 0 ? `
                        <div class="detail-row">
                            <span class="detail-label">Attachments:</span>
                            <div class="attachment-grid">
                                ${ticket.attachments.map(att => `
                                    <img src="${att.data}" alt="${att.name}" class="attachment-thumbnail">
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Demo Actions -->
            ${ticket.status !== 'resolved' ? `
                <div class="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p class="text-sm text-gray-400 mb-3">Demo: Simulate status updates</p>
                    <div class="flex gap-2 flex-wrap">
                        ${ticket.status === 'raised' ? '<button onclick="simulateStatusUpdate(\'' + ticket.id + '\', \'acknowledged\')" class="demo-btn">Mark as Acknowledged</button>' : ''}
                        ${ticket.status === 'acknowledged' ? '<button onclick="simulateStatusUpdate(\'' + ticket.id + '\', \'in-progress\')" class="demo-btn">Start Work</button>' : ''}
                        ${ticket.status === 'in-progress' ? '<button onclick="simulateStatusUpdate(\'' + ticket.id + '\', \'resolved\')" class="demo-btn">Mark as Resolved</button>' : ''}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    section.classList.remove('hidden');
    document.getElementById('trackFormSection').classList.add('hidden');
}

// Simulate status update (for demo)
function simulateStatusUpdate(ticketId, newStatus) {
    updateTicketStatus(ticketId, newStatus);
    const ticket = getTicket(ticketId);
    displayTicketStatus(ticket);
    showNotification('Ticket status updated successfully!');
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
