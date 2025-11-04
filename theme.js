// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.init();
    }

    init() {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('campusSaathiTheme') || 'light';
        this.setTheme(savedTheme);

        // Add event listener to toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('campusSaathiTheme', theme);
        this.updateThemeIcon(theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        this.showThemeNotification(newTheme);
    }

    updateThemeIcon(theme) {
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    showThemeNotification(theme) {
        const notification = document.createElement('div');
        notification.className = alert alert-info position-fixed;
        notification.style.cssText = `
            top: 70px;
            right: 20px;
            z-index: 9999;
            min-width: 200px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            background: var(--bg-primary);
            color: var(--text-primary);
        `;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="me-2">${theme === 'light' ? '☀️' : '🌙'}</span>
                <span>${theme === 'light' ? 'Light' : 'Dark'} theme activated</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const themeManager = new ThemeManager();
    window.themeManager = themeManager;
});

// Utility function to toggle theme from anywhere
function toggleSiteTheme() {
    const themeManager = window.themeManager;
    if (themeManager) {
        themeManager.toggleTheme();
    }
}