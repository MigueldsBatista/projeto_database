// App State - Enhanced to store comprehensive user data
const appState = {
    currentScreen: 'splash',
    user: null,
    cart: [],
    userProfile: {
        estadia: null,
        quarto: null,
        fatura: null,
        pedidos: [],
        loaded: false
    },
    // Flag to track if core data has been loaded
    dataLoaded: false
};

function getCartTotal() {
    return appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function findProductById(id) {
    return appState.products.find(product => product.id === id);
}

function getCartItemCount() {
    return appState.cart.reduce((total, item) => total + item.quantity, 0);
}

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

async function loadUserData() {
    // If already loaded, don't reload
    if (appState.dataLoaded) return true;
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return false;
    
    // Set basic user info
    appState.user = user;
    
    try {
        // Step 1: Load estadia data
        const estadia = await fetchEstadiaData(user.id);
        appState.userProfile.estadia = estadia;
        
        if (estadia) {
            // Step 2: Load room data if estadia exists
            const quarto = await fetchQuartoData(estadia.quartoId);
            appState.userProfile.quarto = quarto;
        }
        
        // Step 3: Load invoice data
        const fatura = await fetchFaturaData(user.id);
        appState.userProfile.fatura = fatura;
        
        // Step 4: Load recent orders
        const pedidos = await fetchPedidosData(user.id);
        appState.userProfile.pedidos = pedidos;
        
        // Mark data as loaded
        appState.dataLoaded = true;
        appState.userProfile.loaded = true;
        console.log('User data loaded successfully:', appState.userProfile);
        
        return true;
    } catch (error) {
        console.error('Error loading user data:', error);
        return false;
    }
}

async function fetchEstadiaData(pacienteId) {
    try {
        const response = await fetch(`${API_URL}/api/pacientes/obter-estadia/${pacienteId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('No active estadia found for patient');
                return null;
            }
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching estadia data:', error);
        return null;
    }
}

async function fetchQuartoData(quartoId) {
    if (!quartoId) return null;
    
    try {
        const response = await fetch(`${API_URL}/api/quartos/${quartoId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching room data:', error);
        return null;
    }
}

async function fetchFaturaData(pacienteId) {
    try {
        const response = await fetch(`${API_URL}/api/pacientes/fatura-recente/${pacienteId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('No invoice found for patient');
                return null;
            }
            
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching invoice data:', error);
        return null;
    }
}

async function fetchPedidosData(pacienteId) {
    try {
        const response = await fetch(`${API_URL}/api/pacientes/${pacienteId}/pedidos`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        const pedidos = await response.json();
        
        // For each order, fetch its products
        const enhancedPedidos = [];
        for (const pedido of pedidos) {
            try {
                // Fetch products for this order
                const produtos = await fetchProdutosFromPedido(pedido.dataPedido);
                
                // Create enhanced order with details
                const enhancedPedido = {
                    ...pedido,
                    // Format details as product names separated by commas
                    detalhes: produtos && produtos.length > 0 
                        ? produtos.map(p => p.nome).join(', ')
                        : 'Sem produtos',
                    // Calculate or use the total value from products if available
                    valor: produtos && produtos.length > 0
                        ? produtos.reduce((total, p) => total + (p.preco * p.quantidade), 0)
                        : pedido.valor || 0,
                    produtos: produtos || []
                };
                
                enhancedPedidos.push(enhancedPedido);
            } catch (error) {
                console.error(`Error fetching products for order ${pedido.dataPedido}:`, error);
                enhancedPedidos.push({
                    ...pedido,
                    detalhes: 'Detalhes indisponíveis',
                    valor: pedido.valor || 0,
                    produtos: []
                });
            }
        }
        
        return enhancedPedidos;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

async function fetchProdutosFromPedido(dataPedido) {
    try {
        const response = await fetch(`${API_URL}/api/pedidos/${dataPedido}/produtos`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!response.ok) {
            if (response.status !== 200) {
                return null;
            }
            
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching products data:', error);
        return null;
    }
}

async function reloadUserData() {
    appState.dataLoaded = false;
    appState.userProfile.loaded = false;
    return await loadUserData();
}

async function getUserData() {
    if (!appState.dataLoaded) {
        await loadUserData();
    }
    return {
        user: appState.user,
        estadia: appState.userProfile.estadia,
        quarto: appState.userProfile.quarto,
        fatura: appState.userProfile.fatura,
        pedidos: appState.userProfile.pedidos
    };
}

function getRecentOrders(limit = 3) {
    if (!appState.dataLoaded || !appState.userProfile.pedidos) {
        return [];
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = [...appState.userProfile.pedidos]
        .sort((a, b) => new Date(b.dataPedido) - new Date(a.dataPedido));
    
    // Return limited amount or all if limit is null
    return limit ? sortedOrders.slice(0, limit) : sortedOrders;
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
function initApp() {
    // Check auth and load user data (if not on login page)
    const user = checkAuth();
    
    // For authorized pages, update cart badge and load user data
    if (user) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Load user data in the background
        loadUserData().then(success => {
            if (success) {
                console.log('User data loaded successfully');
                // Dispatch an event that other pages can listen for
                document.dispatchEvent(new CustomEvent('userDataLoaded'));
            }
        });
        
        // Setup event listeners for navigation, search, etc.
        setupEventListeners();
    }
}
document.addEventListener('DOMContentLoaded', initApp);

// Update any references to HTML files to use 'html/' prefix, e.g. 'html/index.html'
