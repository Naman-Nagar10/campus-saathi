// Notes functionality
document.addEventListener('DOMContentLoaded', function() {
    displayNotes();
    
    // Handle form submission
    document.getElementById('notesForm').addEventListener('submit', function(e) {
        e.preventDefault();
        uploadNote();
    });
    
    // Add event listener for search
    document.getElementById('searchNotes').addEventListener('input', filterNotes);
});

function uploadNote() {
    const subject = document.getElementById('subjectName').value;
    const topic = document.getElementById('topicName').value;
    const description = document.getElementById('notesDescription').value;
    const uploader = document.getElementById('uploaderName').value;

    if (subject && topic && description && uploader) {
        // Get existing notes from localStorage
        let notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
        
        const newNote = {
            id: Date.now(),
            subject: subject,
            topic: topic,
            description: description,
            uploader: uploader,
            date: new Date().toISOString().split('T')[0],
            downloads: 0
        };
        
        notes.unshift(newNote);
        localStorage.setItem('campusNotes', JSON.stringify(notes));
        
        // Reset form
        document.getElementById('notesForm').reset();
        
        // Refresh notes display
        displayNotes();
        
        // Show success message
        showNotification('✅ Notes uploaded successfully!', 'success');
    } else {
        showNotification('❌ Please fill all fields', 'error');
    }
}

function displayNotes() {
    const notesContainer = document.getElementById('notesContainer');
    const notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
    
    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="col-12">
                <div class="card text-center py-5">
                    <div class="card-body">
                        <h5 class="text-muted">No notes available yet</h5>
                        <p class="text-muted mb-3">Be the first to share your notes!</p>
                        <button class="btn btn-primary" onclick="document.getElementById('notesForm').scrollIntoView()">
                            Upload Notes
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    notesContainer.innerHTML = '';
    
    notes.forEach(note => {
        const noteCard = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 note-item">
                    <div class="card-body">
                        <h5 class="card-title">${note.subject}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${note.topic}</h6>
                        <p class="card-text small text-muted">${note.description}</p>
                        <div class="note-meta mt-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    <strong>Uploaded by:</strong> ${note.uploader}
                                </small>
                                <small class="text-muted">${formatDate(note.date)}</small>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <small class="text-muted">
                                    <strong>Downloads:</strong> ${note.downloads}
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-sm" onclick="downloadNote(${note.id})">
                                📥 Download Notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        notesContainer.innerHTML += noteCard;
    });
}

function downloadNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        // Create a text file content
        const content = `
CAMPUS SAATHI - STUDY NOTES
===========================

Subject: ${note.subject}
Topic: ${note.topic}
Description: ${note.description}
Uploaded By: ${note.uploader}
Date: ${note.date}
Downloads: ${note.downloads + 1}

NOTES CONTENT:
[Your notes content would go here]

---
Thank you for using Campus Saathi!
Happy Learning! 🎓
        `;
        
        // Update download count
        const updatedNotes = notes.map(n => {
            if (n.id === noteId) {
                return { ...n, downloads: n.downloads + 1 };
            }
            return n;
        });
        localStorage.setItem('campusNotes', JSON.stringify(updatedNotes));
        
        // Create download link
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = CampusSaathi_${note.subject}_${note.topic}.txt;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Refresh display to update download count
        displayNotes();
        
        showNotification('📥 Notes download started!', 'success');
    }
}

function filterNotes() {
    const searchTerm = document.getElementById('searchNotes').value.toLowerCase();
    const notes = document.querySelectorAll('.note-item');
    
    notes.forEach(note => {
        const subject = note.querySelector('.card-title').textContent.toLowerCase();
        const topic = note.querySelector('.card-subtitle').textContent.toLowerCase();
        const description = note.querySelector('.card-text').textContent.toLowerCase();
        
        const searchMatch = !searchTerm || 
                           subject.includes(searchTerm) || 
                           topic.includes(searchTerm) || 
                           description.includes(searchTerm);
        
        if (searchMatch) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
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

// Initialize sample notes
function initializeSampleNotes() {
    const notes = JSON.parse(localStorage.getItem('campusNotes')) || [];
    
    if (notes.length === 0) {
        const sampleNotes = [
            {
                id: 1,
                subject: "Computer Science",
                topic: "Data Structures",
                description: "Complete notes on Linked Lists, Trees, Graphs with algorithms and examples.",
                uploader: "Rahul Kumar",
                date: new Date().toISOString().split('T')[0],
                downloads: 12
            },
            {
                id: 2,
                subject: "Mathematics",
                topic: "Calculus",
                description: "Derivatives, Integration, and Applications with solved problems.",
                uploader: "Priya Sharma",
                date: new Date().toISOString().split('T')[0],
                downloads: 8
            },
            {
                id: 3,
                subject: "Physics",
                topic: "Quantum Mechanics",
                description: "Wave functions, Schrödinger equation, and quantum states notes.",
                uploader: "Amit Singh",
                date: new Date().toISOString().split('T')[0],
                downloads: 5
            }
        ];
        
        localStorage.setItem('campusNotes', JSON.stringify(sampleNotes));
        displayNotes();
    }
}

// Initialize sample data
initializeSampleNotes();