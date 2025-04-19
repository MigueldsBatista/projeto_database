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

// Common utility functions for the entire app

const APP_NAME = 'Hospital Santa Joana';
const API_URL = 'http://localhost:8080';

// Check authentication state
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const isAuthPage = window.location.pathname.includes('login.html') || 
                      window.location.pathname.includes('register.html');
    
    if (!user && !isAuthPage) {
        window.location.href = 'login.html';
        return null;
    }
    
    return user;
}

// Common toast notification function
function showToast(message, type = 'default', duration = 3000) {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide and remove the toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Update cart badge count
function updateCartBadge(count) {
    const badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

// Format currency values
function formatCurrency(value) {
    return Number(value).toFixed(2).replace('.', ',');
}

// Format date to PT-BR format
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Format date and time to PT-BR format
function formatDateTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Generic status mappers
function getStatusText(status) {
    if (!status) return 'Desconhecido';
    
    // Convert to uppercase for case-insensitive comparison
    const upperStatus = status.toUpperCase();
    
    switch(upperStatus) {
        case 'PENDENTE':
        case 'PENDING':
            return 'Pendente';
        case 'EM_PREPARO':
        case 'EM PREPARO':
        case 'IN-PROGRESS':
        case 'IN_PROGRESS':
            return 'Em Preparo';
        case 'ENTREGUE':
        case 'DELIVERED':
            return 'Entregue';
        case 'CANCELADO':
        case 'CANCELLED':
        case 'CANCELED':
            return 'Cancelado';
        default:
            return status;
    }
}

function getStatusClass(status) {
    if (!status) return 'status-default';
    
    // Convert to uppercase for case-insensitive comparison
    const upperStatus = status.toUpperCase();
    
    switch(upperStatus) {
        case 'PENDENTE':
        case 'PENDING':
            return 'pending';
        case 'EM_PREPARO':
        case 'EM PREPARO':
        case 'IN-PROGRESS':
        case 'IN_PROGRESS':
            return 'in-progress';
        case 'ENTREGUE':
        case 'DELIVERED':
            return 'delivered';
        case 'CANCELADO':
        case 'CANCELLED':
        case 'CANCELED':
            return 'cancelled';
        default:
            return 'status-default';
    }
}

// Run on every page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const user = checkAuth();
    
    // Update cart badge if on authorized pages
    if (!user) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartBadge(totalItems);
});

// Helper Functions
function getCartTotal() {
    return appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function findProductById(id) {
    return appState.products.find(product => product.id === id);
}

function getCartItemCount() {
    return appState.cart.reduce((total, item) => total + item.quantity, 0);
}

// UI Functions
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

function updateCartBadge() {
    const count = getCartItemCount();
    const badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

// Initialize App - simplified to work with existing HTML structure
function initApp() {
    // Check if we're on the login page
    if (window.location.pathname.includes('login.html')) {
        setupLoginPage();
        return;
    }
    
    // For other pages, setup general event listeners
    setupEventListeners();
    
    // Check auth and load user data
    const user = checkAuth();
    if (user) {
        // Update cart badge
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    }
}

function setupLoginPage() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (!email || !password) {
            showToast('Por favor, preencha todos os campos', 'error');
            return;
        }
        
        // In a real app, we would authenticate with the server
        // For now, simulate a successful login
        const user = {
            id: 1,
            name: 'Maria Silva',
            room: '302',
            email: email
        };
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        showToast('Login realizado com sucesso!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    });
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
