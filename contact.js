// Contact and Feedback functionality
document.addEventListener('DOMContentLoaded', function() {
    updateStatistics();
    
    // Handle feedback form submission
    document.getElementById('feedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitFeedback();
    });
});

function submitFeedback() {
    const name = document.getElementById('feedbackName').value;
    const email = document.getElementById('feedbackEmail').value;
    const type = document.getElementById('feedbackType').value;
    const message = document.getElementById('feedbackMessage').value;

    if (name && email && type && message) {
        // Get existing feedbacks from localStorage
        let feedbacks = JSON.parse(localStorage.getItem('campusFeedbacks')) || [];
        
        const newFeedback = {
            id: Date.now(),
            name: name,
            email: email,
            type: type,
            message: message,
            date: new Date().toLocaleString('en-IN')
        };
        
        feedbacks.unshift(newFeedback);
        localStorage.setItem('campusFeedbacks', JSON.stringify(feedbacks));
        
        // Reset form
        document.getElementById('feedbackForm').reset();
        
        // Update statistics
        updateStatistics();
        
        // Show success message
        showNotification('✅ Feedback sent successfully! Thank you!', 'success');
    } else {
        showNotification('❌ Please fill all fields', 'error');
    }
}

function updateStatistics() {
    // Get counts from localStorage
    const notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
    const items = JSON.parse(localStorage.getItem('shopItems')) || [];
    const events = JSON.parse(localStorage.getItem('campusEvents')) || [];
    const feedbacks = JSON.parse(localStorage.getItem('campusFeedbacks')) || [];
    
    // Update statistics
    document.getElementById('totalNotes').textContent = notes.length;
    document.getElementById('totalItems').textContent = items.length;
    document.getElementById('totalEvents').textContent = events.length;
    document.getElementById('totalFeedbacks').textContent = feedbacks.length;
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

// Add contact icon styles to CSS
const style = document.createElement('style');
style.textContent = `
    .contact-icon {
        font-size: 3rem;
    }
    .stat-card {
        padding: 1rem;
    }
    .stat-card h3 {
        color: var(--accent-color);
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);