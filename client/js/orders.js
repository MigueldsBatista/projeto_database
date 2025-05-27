document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user')) || null;
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        // Try to load data from app state first
        if (appState.dataLoaded) {
            displayOrders(appState.userProfile.pedidos);
        } else {
            // Show loading indicator
            document.getElementById('orders-container').innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>Carregando pedidos...</p></div>';
            
            // Listen for user data loaded event
            document.addEventListener('userDataLoaded', function() {
                displayOrders(appState.userProfile.pedidos);
            });
            
            loadUserData();
        }
        
        setupFilterTabs();
        
        // Update cart badge
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    } catch (error) {
        console.error('Error initializing orders page:', error);
        showToast('Erro ao carregar pedidos', 'error');
    }
});

function setupFilterTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    if (!tabs.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter orders
            const filter = this.getAttribute('data-filter');
            filterOrders(filter);
        });
    });
}

function filterOrders(filter) {
    if (!appState.dataLoaded) return;
    
    let filteredOrders;
    
    if (filter === 'all') {
        filteredOrders = appState.userProfile.pedidos;
    } else {
        filteredOrders = appState.userProfile.pedidos.filter(order => 
            getStatusClass(order.status).toLowerCase() === filter.toLowerCase()
        );
    }
    
    displayOrders(filteredOrders);
}

function displayOrders(orders) {
    const container = document.getElementById('orders-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<div class="empty-state">Você ainda não fez nenhum pedido</div>';
        return;
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.dataPedido) - new Date(a.dataPedido)
    );
    
    sortedOrders.forEach(order => {
        const orderCard = createOrderCard(order);
        container.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.setAttribute('data-id', order.dataPedido);
    
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    
    orderCard.innerHTML = `
        <div class="order-info">
            <p class="order-date">${formatRelativeDate(new Date(order.dataPedido))}</p>
            <p class="order-items">${order.detalhes || 'Detalhes não disponíveis'}</p>
            <p class="order-price">R$ ${formatCurrency(order.valor || 0)}</p>
        </div>
        <div class="order-status">
            <span class="status-pill ${statusClass}">${statusText}</span>
        </div>
    `;
    
    // Add click event to view order details
    orderCard.addEventListener('click', function() {
        window.location.href = `order-details.html?id=${order.dataPedido}`;
    });
    
    return orderCard;
}

