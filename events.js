// Events functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').min = today;
    
    displayEvents();
    
    // Handle form submission
    document.getElementById('eventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addEvent();
    });
});

function addEvent() {
    const title = document.getElementById('eventTitle').value;
    const organizer = document.getElementById('eventOrganizer').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value;
    const description = document.getElementById('eventDescription').value;

    if (title && organizer && date && time && location && description) {
        // Get existing events from localStorage
        let events = JSON.parse(localStorage.getItem('campusEvents')) || [];
        
        const newEvent = {
            id: Date.now(),
            title: title,
            organizer: organizer,
            date: date,
            time: time,
            location: location,
            description: description,
            createdAt: new Date().toISOString().split('T')[0],
            registrations: 0
        };
        
        events.unshift(newEvent);
        localStorage.setItem('campusEvents', JSON.stringify(events));
        
        // Reset form
        document.getElementById('eventForm').reset();
        
        // Refresh events display
        displayEvents();
        
        // Show success message
        showNotification('✅ Event added successfully!', 'success');
    } else {
        showNotification('❌ Please fill all fields', 'error');
    }
}

function displayEvents() {
    const eventsContainer = document.getElementById('eventsContainer');
    const upcomingContainer = document.getElementById('upcomingEvents');
    const events = JSON.parse(localStorage.getItem('campusEvents')) || [];
    
    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Separate upcoming and past events
    const today = new Date().toISOString().split('T')[0];
    const upcomingEvents = events.filter(event => event.date >= today);
    const pastEvents = events.filter(event => event.date < today);
    
    // Display upcoming events in cards
    if (upcomingEvents.length === 0) {
        upcomingContainer.innerHTML = `
            <div class="col-12">
                <div class="card text-center py-4">
                    <div class="card-body">
                        <h5 class="text-muted">No upcoming events</h5>
                        <p class="text-muted">Be the first to add an event!</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        upcomingContainer.innerHTML = '';
        upcomingEvents.forEach(event => {
            const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const eventCard = `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 border-primary">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">by ${event.organizer}</h6>
                            <p class="card-text small text-muted">${event.description}</p>
                            <div class="event-details mt-3">
                                <p class="mb-1"><strong>📅 Date:</strong> ${eventDate}</p>
                                <p class="mb-1"><strong>⏰ Time:</strong> ${event.time}</p>
                                <p class="mb-1"><strong>📍 Location:</strong> ${event.location}</p>
                                <p class="mb-0"><strong>👥 Registrations:</strong> ${event.registrations}</p>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="d-grid gap-2">
                                <button onclick="registerForEvent(${event.id})" class="btn btn-success btn-sm">
                                    📝 Register
                                </button>
                                <button onclick="shareEvent(${event.id})" class="btn btn-outline-primary btn-sm">
                                    📤 Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            upcomingContainer.innerHTML += eventCard;
        });
    }
    
    // Display all events in list view
    if (events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="card text-center py-5">
                <div class="card-body">
                    <h5 class="text-muted">No events available yet</h5>
                    <p class="text-muted mb-3">Be the first to add an event!</p>
                    <button class="btn btn-primary" onclick="document.getElementById('eventForm').scrollIntoView()">
                        Add Event
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    eventsContainer.innerHTML = '';
    
    events.forEach(event => {
        const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const isUpcoming = event.date >= today;
        const badgeClass = isUpcoming ? 'bg-success' : 'bg-secondary';
        const badgeText = isUpcoming ? 'Upcoming' : 'Completed';
        
        const eventItem = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title">${event.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Organizer: ${event.organizer}</h6>
                            <p class="card-text">${event.description}</p>
                            <div class="row">
                                <div class="col-md-3">
                                    <small class="text-muted"><strong>📅 Date:</strong> ${eventDate}</small>
                                </div>
                                <div class="col-md-2">
                                    <small class="text-muted"><strong>⏰ Time:</strong> ${event.time}</small>
                                </div>
                                <div class="col-md-4">
                                    <small class="text-muted"><strong>📍 Location:</strong> ${event.location}</small>
                                </div>
                                <div class="col-md-3">
                                    <small class="text-muted"><strong>Registrations:</strong> ${event.registrations}</small>
                                </div>
                            </div>
                        </div>
                        <span class="badge ${badgeClass} ms-2">${badgeText}</span>
                    </div>
                    ${isUpcoming ? `
                    <div class="mt-3">
                        <button onclick="registerForEvent(${event.id})" class="btn btn-sm btn-outline-primary">
                            📝 Register for Event
                        </button>
                        <button onclick="shareEvent(${event.id})" class="btn btn-sm btn-outline-secondary ms-2">
                            📤 Share Event
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        eventsContainer.innerHTML += eventItem;
    });
}

function registerForEvent(eventId) {
    const events = JSON.parse(localStorage.getItem('campusEvents')) || [];
    const event = events.find(e => e.id === eventId);
    
    if (event) {
        // Get student name
        const studentName = prompt('Please enter your name for registration:') || 'Anonymous Student';
        
        if (studentName) {
            // Update registration count
            const updatedEvents = events.map(e => {
                if (e.id === eventId) {
                    return { ...e, registrations: e.registrations + 1 };
                }
                return e;
            });
            
            localStorage.setItem('campusEvents', JSON.stringify(updatedEvents));
            
            // Save registration details
            let registrations = JSON.parse(localStorage.getItem('eventRegistrations')) || [];
            const registration = {
                eventId: eventId,
                eventTitle: event.title,
                studentName: studentName,
                registeredAt: new Date().toLocaleString('en-IN')
            };
            
            registrations.push(registration);
            localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
            
            displayEvents();
            showNotification(✅ Successfully registered for "${event.title}"!, 'success');
        }
    }
}

function shareEvent(eventId) {
    const events = JSON.parse(localStorage.getItem('campusEvents')) || [];
    const event = events.find(e => e.id === eventId);
    
    if (event) {
        const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const shareText = 🎓 Campus Event: ${event.title}\n📅 ${eventDate} ⏰ ${event.time}\n📍 ${event.location}\n\n${event.description}\n\n- Shared via Campus Saathi;
        
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: shareText
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText);
            showNotification('📋 Event details copied to clipboard! You can share it now.', 'info');
        }
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = alert alert-${type === 'error' ? 'danger' : 'success'} position-fixed;
    notification.style.cssText = `
        top: 70px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Initialize sample events
function initializeSampleEvents() {
    const events = JSON.parse(localStorage.getItem('campusEvents')) || [];
    
    if (events.length === 0) {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
        
        const sampleEvents = [
            {
                id: 1,
                title: "Technical Fest 2024",
                organizer: "Computer Science Department",
                date: nextWeek.toISOString().split('T')[0],
                time: "10:00",
                location: "Main Auditorium",
                description: "Annual technical fest featuring coding competitions, project exhibitions, workshops, and guest lectures from industry experts.",
                createdAt: today.toISOString().split('T')[0],
                registrations: 15
            },
            {
                id: 2,
                title: "Cultural Night",
                organizer: "Cultural Committee",
                date: twoWeeks.toISOString().split('T')[0],
                time: "18:00",
                location: "College Ground",
                description: "Colorful cultural program featuring dance, music, drama performances, and food stalls from different regions of India.",
                createdAt: today.toISOString().split('T')[0],
                registrations: 8
            }
        ];
        
        localStorage.setItem('campusEvents', JSON.stringify(sampleEvents));
        displayEvents();
    }
}

// Initialize sample events
initializeSampleEvents();