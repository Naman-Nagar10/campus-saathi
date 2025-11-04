// Dashboard functionality for presentation
document.addEventListener('DOMContentLoaded', function() {
    updateLiveStats();
    initializeDemoData();
    
    // Update stats every 10 seconds
    setInterval(updateLiveStats, 10000);
});

function updateLiveStats() {
    const notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
    const items = JSON.parse(localStorage.getItem('shopItems')) || [];
    const events = JSON.parse(localStorage.getItem('campusEvents')) || [];
    const feedbacks = JSON.parse(localStorage.getItem('campusFeedbacks')) || [];
    
    // Update stats display if elements exist
    const statsElements = {
        'totalNotes': notes.length,
        'totalItems': items.length,
        'totalEvents': events.length,
        'totalFeedbacks': feedbacks.length
    };
    
    Object.keys(statsElements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = statsElements[id];
        }
    });
}

function initializeDemoData() {
    // Ensure there's some demo data for presentation
    const notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
    const items = JSON.parse(localStorage.getItem('shopItems')) || [];
    const events = JSON.parse(localStorage.getItem('campusEvents')) || [];
    const feedbacks = JSON.parse(localStorage.getItem('campusFeedbacks')) || [];
    
    if (notes.length === 0) {
        const demoNotes = [
            {
                id: 1,
                subject: "Computer Science",
                topic: "Data Structures",
                description: "Complete notes on Linked Lists, Trees and Graphs with algorithms and examples",
                uploader: "Rahul Kumar",
                date: new Date().toISOString().split('T')[0],
                downloads: 15
            },
            {
                id: 2,
                subject: "Mathematics",
                topic: "Calculus",
                description: "Derivatives, Integration and Applications with solved problems and examples",
                uploader: "Priya Sharma",
                date: new Date().toISOString().split('T')[0],
                downloads: 12
            }
        ];
        localStorage.setItem('campusNotes', JSON.stringify(demoNotes));
    }
    
    if (items.length === 0) {
        const demoItems = [
            {
                id: 1,
                name: "Calculus Textbook",
                category: "books",
                price: "250",
                condition: "good",
                description: "James Stewart Calculus 8th Edition, like new condition with minimal highlighting",
                seller: "Priya Sharma",
                contact: "priya@college.edu",
                date: new Date().toISOString().split('T')[0],
                status: "available"
            },
            {
                id: 2,
                name: "Scientific Calculator",
                category: "electronics",
                price: "500",
                condition: "new",
                description: "Casio FX-991ES Plus, used only for one semester. Original packaging included",
                seller: "Rahul Kumar",
                contact: "9876543210",
                date: new Date().toISOString().split('T')[0],
                status: "available"
            }
        ];
        localStorage.setItem('shopItems', JSON.stringify(demoItems));
    }
    
    if (events.length === 0) {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const demoEvents = [
            {
                id: 1,
                title: "Technical Fest 2024",
                organizer: "Computer Science Department",
                date: nextWeek.toISOString().split('T')[0],
                time: "10:00",
                location: "Main Auditorium",
                description: "Annual technical fest featuring coding competitions, project exhibitions and workshops",
                createdAt: today.toISOString().split('T')[0],
                registrations: 8
            }
        ];
        localStorage.setItem('campusEvents', JSON.stringify(demoEvents));
    }
    
    if (feedbacks.length === 0) {
        const demoFeedbacks = [
            {
                id: 1,
                name: "Amit Singh",
                email: "amit@college.edu",
                type: "compliment",
                message: "Great platform! Very useful for students.",
                date: new Date().toLocaleString('en-IN')
            }
        ];
        localStorage.setItem('campusFeedbacks', JSON.stringify(demoFeedbacks));
    }
    
    updateLiveStats();
}

// Presentation mode functions
function startPresentation() {
    // Show presentation controls
    showPresentationControls();
    
    // Auto-demo sequence
    startAutoDemo();
}

function showPresentationControls() {
    const controls = document.createElement('div');
    controls.id = 'presentationControls';
    controls.innerHTML = `
        <div class="position-fixed bottom-0 end-0 m-3">
            <div class="card">
                <div class="card-body p-2">
                    <h6 class="card-title mb-2">🎬 Presentation Controls</h6>
                    <div class="btn-group-vertical">
                        <button class="btn btn-primary btn-sm" onclick="toggleSiteTheme()">🎨 Toggle Theme</button>
                        <button class="btn btn-success btn-sm" onclick="showNextFeature()">➡️ Next Feature</button>
                        <button class="btn btn-warning btn-sm" onclick="resetDemoData()">🔄 Reset Data</button>
                        <button class="btn btn-secondary btn-sm" onclick="exitPresentation()">❌ Exit</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(controls);
}

let currentFeature = 0;
const features = ['shop', 'notes', 'events', 'theme'];

function showNextFeature() {
    currentFeature = (currentFeature + 1) % features.length;
    highlightFeature(features[currentFeature]);
}

function highlightFeature(feature) {
    // Remove previous highlights
    document.querySelectorAll('.feature-highlight').forEach(el => {
        el.classList.remove('feature-highlight');
    });
    
    // Add highlight to current feature
    const featureCards = document.querySelectorAll('.feature-demo-card');
    featureCards.forEach(card => {
        if (card.textContent.toLowerCase().includes(feature)) {
            card.classList.add('feature-highlight');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    showNotification(🎯 Highlighting: ${feature.charAt(0).toUpperCase() + feature.slice(1)} Feature, 'info');
}

function startAutoDemo() {
    let step = 0;
    const demoSteps = [
        () => showNotification('🎬 Starting Presentation Demo', 'info'),
        () => highlightFeature('shop'),
        () => { highlightFeature('notes'); toggleSiteTheme(); },
        () => highlightFeature('events'),
        () => highlightFeature('theme'),
        () => showNotification('✅ Demo Complete! All features working.', 'success')
    ];
    
    const demoInterval = setInterval(() => {
        if (step < demoSteps.length) {
            demoSteps[step]();
            step++;
        } else {
            clearInterval(demoInterval);
        }
    }, 3000);
}

function resetDemoData() {
    if (confirm('Are you sure you want to reset all demo data?')) {
        localStorage.clear();
        initializeDemoData();
        showNotification('🔄 All demo data has been reset!', 'info');
    }
}

function exitPresentation() {
    const controls = document.getElementById('presentationControls');
    if (controls) {
        controls.remove();
    }
    showNotification('🎬 Presentation mode ended', 'info');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = alert alert-${type === 'error' ? 'danger' : type === 'info' ? 'info' : 'success'} position-fixed;
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

// Add dashboard styles
const dashboardStyle = document.createElement('style');
dashboardStyle.textContent = `
    .feature-demo-card {
        transition: all 0.3s ease;
    }
    
    .feature-highlight {
        border: 3px solid var(--accent-color) !important;
        transform: scale(1.02);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
    }
    
    .demo-steps {
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .step {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-secondary);
    }
    
    .step:last-child {
        border-bottom: none;
    }
    
    .stat-card {
        padding: 1rem;
        text-align: center;
    }
    
    .stat-card h3 {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--accent-color);
        margin-bottom: 0.5rem;
    }
    
    .stat-card p {
        color: var(--text-secondary);
        margin-bottom: 0;
    }
    
    #presentationControls {
        z-index: 10000;
    }
`;
document.head.appendChild(dashboardStyle);