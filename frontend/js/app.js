// App State
const appState = {
    currentScreen: 'splash',
    user: null,
    cart: [],
    products: [
        {
            id: 1,
            name: 'Água Mineral',
            description: 'Garrafa 500ml',
            price: 3.50,
            image: 'img/products/water.jpg',
            category: 'food'
        },
        {
            id: 2,
            name: 'Suco Natural',
            description: 'Laranja ou maçã, 300ml',
            price: 7.90,
            image: 'img/products/juice.jpg',
            category: 'food'
        },
        {
            id: 3,
            name: 'Kit Higiene',
            description: 'Sabonete, shampoo e condicionador',
            price: 18.50,
            image: 'img/products/soap.jpg',
            category: 'hygiene'
        },
        {
            id: 4,
            name: 'Refeição Completa',
            description: 'Almoço ou jantar com sobremesa',
            price: 32.90,
            image: 'img/products/meal.jpg',
            category: 'food'
        }
    ],
    orders: [
        {
            id: 1,
            date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            items: [
                { id: 1, name: 'Café da manhã', price: 18.90, quantity: 1 },
                { id: 2, name: 'Água', price: 3.50, quantity: 2 }
            ],
            total: 25.90,
            status: 'delivered'
        },
        {
            id: 2,
            date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            items: [
                { id: 4, name: 'Jantar', price: 32.90, quantity: 1 },
                { id: 2, name: 'Suco', price: 7.90, quantity: 1 },
                { id: 5, name: 'Sobremesa', price: 8.50, quantity: 1 }
            ],
            total: 49.30,
            status: 'delivered'
        }
    ],
    invoice: {
        total: 320.50,
        status: 'pending',
        items: []
    }
};

// Helper Functions specific to app functionality
function getCartTotal() {
    return appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function findProductById(id) {
    return appState.products.find(product => product.id === id);
}

function getCartItemCount() {
    return appState.cart.reduce((total, item) => total + item.quantity, 0);
}

// UI Functions specific to app navigation
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        appState.currentScreen = screenId;
    }
}

// Initialize App
function initApp() {
    // Check auth and load user data (if not on login page)
    const user = checkAuth();
    
    // For authorized pages, update cart badge
    if (user) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Setup event listeners for navigation, search, etc.
        setupEventListeners();
    }
}

function setupEventListeners() {
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Only prevent default if it's an anchor without a specific href
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
            }
            
            // Handle nav item activation
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Back buttons
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function(e) {
            // If it's a button without an onclick, prevent default and go back
            if (!this.getAttribute('onclick')) {
                e.preventDefault();
                window.history.back();
            }
        });
    });
    
    // Search functionality if we're on a page with search
    setupSearchFunctionality();
    
    // Category tabs if we're on a page with categories
    setupCategoryTabs();
}

function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input input');
    const clearSearch = document.querySelector('.clear-search');
    
    if (!searchInput || !clearSearch) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm) {
            clearSearch.style.display = 'block';
            
            // Product filtering logic would go here
            // This depends on the page structure
        } else {
            clearSearch.style.display = 'none';
        }
    });
    
    clearSearch.addEventListener('click', function() {
        if (!searchInput) return;
        
        searchInput.value = '';
        this.style.display = 'none';
    });
}

function setupCategoryTabs() {
    // Category tabs
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            document.querySelectorAll('.tab-item').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Category filtering logic would depend on page structure
        });
    });
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
