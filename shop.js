/ Campus Shop functionality
document.addEventListener('DOMContentLoaded', function() {
    displayShopItems();
    
    // Handle form submission
    document.getElementById('itemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addShopItem();
    });
    
    // Add event listeners for filters
    document.getElementById('categoryFilter').addEventListener('change', filterItems);
    document.getElementById('searchItems').addEventListener('input', filterItems);
});

function addShopItem() {
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const price = document.getElementById('itemPrice').value;
    const condition = document.getElementById('itemCondition').value;
    const description = document.getElementById('itemDescription').value;
    const seller = document.getElementById('sellerName').value;
    const contact = document.getElementById('sellerContact').value;

    if (name && category && price && condition && description && seller && contact) {
        // Get existing items from localStorage
        let items = JSON.parse(localStorage.getItem('shopItems')) || [];
        
        const newItem = {
            id: Date.now(),
            name: name,
            category: category,
            price: price,
            condition: condition,
            description: description,
            seller: seller,
            contact: contact,
            date: new Date().toISOString().split('T')[0],
            status: 'available'
        };
        
        items.unshift(newItem);
        localStorage.setItem('shopItems', JSON.stringify(items));
        
        // Reset form
        document.getElementById('itemForm').reset();
        
        // Refresh items display
        displayShopItems();
        
        // Show success message
        showNotification('✅ Item listed successfully!', 'success');
    } else {
        showNotification('❌ Please fill all fields', 'error');
    }
}

function displayShopItems() {
    const itemsContainer = document.getElementById('itemsContainer');
    const items = JSON.parse(localStorage.getItem('shopItems')) || [];
    
    if (items.length === 0) {
        itemsContainer.innerHTML = `
            <div class="col-12">
                <div class="card text-center py-5">
                    <div class="card-body">
                        <h5 class="text-muted">No items available yet</h5>
                        <p class="text-muted mb-3">Be the first to list an item for sale!</p>
                        <button class="btn btn-primary" onclick="document.getElementById('itemForm').scrollIntoView()">
                            List Your Item
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    itemsContainer.innerHTML = '';
    
    items.forEach(item => {
        if (item.status !== 'sold') {
            const categoryIcons = {
                'books': '📚',
                'electronics': '💻',
                'stationery': '✏️',
                'furniture': '🪑',
                'sports': '⚽',
                'other': '🔧'
            };
            
            const conditionText = {
                'new': 'Like New',
                'good': 'Good',
                'fair': 'Fair',
                'needs-repair': 'Needs Repair'
            };
            
            const itemCard = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shop-item" data-category="${item.category}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge bg-secondary">${categoryIcons[item.category]} ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                                <span class="badge bg-light text-dark">${conditionText[item.condition]}</span>
                            </div>
                            <h5 class="card-title">${item.name}</h5>
                            <h4 class="text-primary mb-3">₹${item.price}</h4>
                            <p class="card-text text-muted small">${item.description}</p>
                            <div class="item-details mt-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">
                                        <strong>Seller:</strong> ${item.seller}
                                    </small>
                                    <small class="text-muted">${formatDate(item.date)}</small>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="contactSeller('${item.seller}', '${item.contact}')">
                                    📞 Contact Seller
                                </button>
                                <button class="btn btn-outline-success btn-sm" onclick="markAsSold(${item.id})">
                                    ✅ Mark as Sold
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            itemsContainer.innerHTML += itemCard;
        }
    });
}

function filterItems() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchItems').value.toLowerCase();
    const items = document.querySelectorAll('.shop-item');
    
    items.forEach(item => {
        const category = item.getAttribute('data-category');
        const itemName = item.querySelector('.card-title').textContent.toLowerCase();
        const itemDescription = item.querySelector('.card-text').textContent.toLowerCase();
        
        const categoryMatch = !categoryFilter || category === categoryFilter;
        const searchMatch = !searchTerm || 
                           itemName.includes(searchTerm) || 
                           itemDescription.includes(searchTerm);
        
        if (categoryMatch && searchMatch) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function contactSeller(sellerName, contactInfo) {
    const message = Hi ${sellerName}, I'm interested in your item listed on Campus Saathi. My contact info: [Your Phone/Email];
    
    if (contactInfo.includes('@')) {
        // Email
        window.location.href = mailto:${contactInfo}?subject=Interest in your item - Campus Saathi&body=${encodeURIComponent(message)};
    } else {
        // Phone - show contact info
        showNotification(📞 Contact ${sellerName}: ${contactInfo}, 'info');
    }
}

function markAsSold(itemId) {
    if (confirm('Are you sure you want to mark this item as sold?')) {
        let items = JSON.parse(localStorage.getItem('shopItems')) || [];
        items = items.map(item => {
            if (item.id === itemId) {
                return { ...item, status: 'sold' };
            }
            return item;
        });
        
        localStorage.setItem('shopItems', JSON.stringify(items));
        displayShopItems();
        showNotification('✅ Item marked as sold!', 'success');
    }
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

// Initialize sample shop items
function initializeSampleShopItems() {
    const items = JSON.parse(localStorage.getItem('shopItems')) || [];
    
    if (items.length === 0) {
        const sampleItems = [
            {
                id: 1,
                name: "Calculus Textbook",
                category: "books",
                price: "250",
                condition: "good",
                description: "James Stewart Calculus 8th Edition, like new condition with minimal highlighting.",
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
                description: "Casio FX-991ES Plus, used only for one semester. Original packaging included.",
                seller: "Rahul Kumar",
                contact: "9876543210",
                date: new Date().toISOString().split('T')[0],
                status: "available"
            },
            {
                id: 3,
                name: "Study Table",
                category: "furniture",
                price: "1200",
                condition: "good",
                description: "Wooden study table with drawer. Perfect for hostel room. Pickup only.",
                seller: "Amit Singh",
                contact: "amit.singh@college.edu",
                date: new Date().toISOString().split('T')[0],
                status: "available"
            }
        ];
        
        localStorage.setItem('shopItems', JSON.stringify(sampleItems));
        displayShopItems();
    }
}

// Initialize sample data
initializeSampleShopItems();