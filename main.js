/ Main JavaScript for homepage functionality
document.addEventListener('DOMContentLoaded', function() {
    updateHomeStats();
    loadRecentActivity();
    
    // Update stats every 30 seconds
    setInterval(updateHomeStats, 30000);
});

function updateHomeStats() {
    // Get counts from localStorage
    const notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
    const items = JSON.parse(localStorage.getItem('shopItems')) || [];
    const events = JSON.parse(localStorage.getItem('campusEvents')) || [];
    
    // Update homepage statistics
    document.getElementById('totalNotes').textContent = notes.length;
    document.getElementById('totalItems').textContent = items.length;
    document.getElementById('totalEvents').textContent = events.length;
}

function loadRecentActivity() {
    loadRecentNotes();
    loadRecentShopItems();
}

function loadRecentNotes() {
    const notesContainer = document.getElementById('recentNotes');
    const notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
    
    // Get last 3 notes
    const recentNotes = notes.slice(0, 3);
    
    if (recentNotes.length === 0) {
        notesContainer.innerHTML = `
            <div class="text-center text-muted">
                <p>No notes available yet</p>
                <a href="notes.html" class="btn btn-sm btn-primary">Upload First Note</a>
            </div>
        `;
        return;
    }
    
    let notesHTML = '';
    recentNotes.forEach(note => {
        notesHTML += `
            <div class="border-bottom pb-2 mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <strong class="d-block">${note.subject}</strong>
                        <small class="text-muted">${note.topic}</small>
                    </div>
                    <small class="text-muted">${formatDate(note.date)}</small>
                </div>
                <small class="text-muted">by ${note.uploader}</small>
            </div>
        `;
    });
    
    notesContainer.innerHTML = notesHTML;
}

function loadRecentShopItems() {
    const itemsContainer = document.getElementById('recentItems');
    const items = JSON.parse(localStorage.getItem('shopItems')) || [];
    
    // Get last 3 items
    const recentItems = items.slice(0, 3);
    
    if (recentItems.length === 0) {
        itemsContainer.innerHTML = `
            <div class="text-center text-muted">
                <p>No shop items available yet</p>
                <a href="shop.html" class="btn btn-sm btn-primary">Add First Item</a>
            </div>
        `;
        return;
    }
    
    let itemsHTML = '';
    recentItems.forEach(item => {
        itemsHTML += `
            <div class="border-bottom pb-2 mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <strong class="d-block">${item.name}</strong>
                        <small class="text-muted">₹${item.price}</small>
                    </div>
                    <small class="text-muted">${formatDate(item.date)}</small>
                </div>
                <small class="text-muted">by ${item.seller}</small>
            </div>
        `;
    });
    
    itemsContainer.innerHTML = itemsHTML;
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Initialize sample data if empty
function initializeSampleData() {
    const notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
    const items = JSON.parse(localStorage.getItem('shopItems')) || [];
    
    if (notes.length === 0 && items.length === 0) {
        // Add sample note
        const sampleNote = {
            id: Date.now(),
            subject: "Computer Science",
            topic: "Data Structures",
            description: "Complete notes on Linked Lists, Trees and Graphs",
            uploader: "Rahul Kumar",
            date: new Date().toISOString().split('T')[0]
        };
        
        // Add sample shop item
        const sampleItem = {
            id: Date.now() + 1,
            name: "Calculus Textbook",
            category: "books",
            price: "250",
            description: "Like new condition, barely used",
            seller: "Priya Sharma",
            contact: "priya@college.edu",
            date: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('campusNotes', JSON.stringify([sampleNote]));
        localStorage.setItem('shopItems', JSON.stringify([sampleItem]));
        
        // Reload activity
        loadRecentActivity();
        updateHomeStats();
    }
}

// Initialize sample data on first load
initializeSampleData();