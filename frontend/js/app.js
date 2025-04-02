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

// Helper Functions
function formatCurrency(value) {
    return value.toFixed(2).replace('.', ',');
}

function formatDate(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()) {
        return `Hoje, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.getDate() === yesterday.getDate() && 
               date.getMonth() === yesterday.getMonth() && 
               date.getFullYear() === yesterday.getFullYear()) {
        return `Ontem, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
}

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

function updateCartBadge() {
    const count = getCartItemCount();
    const badges = document.querySelectorAll('.nav-item[data-screen="cart"] .badge');
    
    badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

// Initialize App
function initApp() {
    // Inject templates
    const app = document.getElementById('app');
    const loginTemplate = document.getElementById('login-template').innerHTML;
    const dashboardTemplate = document.getElementById('dashboard-template').innerHTML;
    const catalogTemplate = document.getElementById('catalog-template').innerHTML;
    
    app.innerHTML += loginTemplate;
    app.innerHTML += dashboardTemplate;
    app.innerHTML += catalogTemplate;
    
    // Simulate loading
    setTimeout(() => {
        showScreen('login-screen');
    }, 2000);
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const cpf = document.getElementById('cpf').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (cpf && password) {
                // Simulate login
                appState.user = {
                    id: 1,
                    name: 'Maria Silva',
                    room: '302'
                };
                
                showScreen('dashboard-screen');
                
                // Update user info
                document.getElementById('patient-name').textContent = appState.user.name;
                document.getElementById('room-number').textContent = appState.user.room;
                
                // Update invoice info
                document.getElementById('invoice-total').textContent = formatCurrency(appState.invoice.total);
            } else {
                showToast('Por favor, preencha todos os campos', 'error');
            }
        });
    }
    
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const screenId = this.getAttribute('data-screen');
            
            if (screenId) {
                // Update active state
                document.querySelectorAll('.nav-item').forEach(navItem => {
                    navItem.classList.remove('active');
                });
                this.classList.add('active');
                
                // Show screen
                showScreen(`${screenId}-screen`);
            }
        });
    });
    
    // Back buttons
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
            showScreen('dashboard-screen');
            
            // Update active nav
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            document.querySelector('.nav-item[data-screen="dashboard"]').classList.add('active');
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = parseInt(productCard.getAttribute('data-id'), 10);
            const product = findProductById(productId);
            
            if (product) {
                // Check if product is already in cart
                const existingItem = appState.cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    appState.cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                // Update cart badge
                updateCartBadge();
                
                showToast(`${product.name} adicionado ao carrinho`, 'success');
            }
        });
    });
    
    // Category tabs
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            document.querySelectorAll('.tab-item').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter products
            if (category === 'all') {
                document.querySelectorAll('.product-card').forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                document.querySelectorAll('.product-card').forEach(card => {
                    const product = findProductById(parseInt(card.getAttribute('data-id'), 10));
                    if (product && product.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Category items in dashboard
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Show catalog screen
            showScreen('catalog-screen');
            
            // Update active nav
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            document.querySelector('.nav-item[data-screen="catalog"]').classList.add('active');
            
            // Set active tab
            document.querySelectorAll('.tab-item').forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('data-category') === category) {
                    tab.classList.add('active');
                    tab.click(); // Trigger click to filter products
                }
            });
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input input');
    const clearSearch = document.querySelector('.clear-search');
    
    if (searchInput && clearSearch) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm) {
                clearSearch.style.display = 'block';
                
                // Filter products
                document.querySelectorAll('.product-card').forEach(card => {
                    const product = findProductById(parseInt(card.getAttribute('data-id'), 10));
                    if (product && (product.name.toLowerCase().includes(searchTerm) || 
                                    product.description.toLowerCase().includes(searchTerm))) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            } else {
                clearSearch.style.display = 'none';
                
                // Reset filters to current active tab
                const activeTab = document.querySelector('.tab-item.active');
                if (activeTab) {
                    activeTab.click();
                }
            }
        });
        
        clearSearch.addEventListener('click', function() {
            searchInput.value = '';
            this.style.display = 'none';
            
            // Reset filters to current active tab
            const activeTab = document.querySelector('.tab-item.active');
            if (activeTab) {
                activeTab.click();
            }
        });
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
