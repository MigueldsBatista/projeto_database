document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Get order ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        
        if (!orderId) {
            showToast('ID do pedido não encontrado', 'error');
            window.history.back();
            return;
        }
        
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user')) || null;
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        // Try to find the order in app state first
        if (typeof appState !== 'undefined' && appState.dataLoaded) {
            const order = appState.userProfile.pedidos.find(p => p.dataPedido === orderId);
            if (order) {
                displayOrderDetails(order);
            } else {
                // Order not found in app state, fetch it directly
                await fetchAndDisplayOrderDetails(orderId);
            }
        } else {
            // Show loading indicator (already in HTML)
            
            // Listen for user data loaded event
            document.addEventListener('userDataLoaded', function() {
                if (typeof appState !== 'undefined' && appState.userProfile && appState.userProfile.pedidos) {
                    const order = appState.userProfile.pedidos.find(p => p.dataPedido === orderId);
                    if (order) {
                        displayOrderDetails(order);
                    } else {
                        // Order not found in app state, fetch it directly
                        fetchAndDisplayOrderDetails(orderId);
                    }
                }
            });
            
            // Trigger data loading if not already in progress
            if (typeof loadUserData === 'function') {
                loadUserData();
            } else {
                // Fallback: fetch order directly if app.js not loaded correctly
                fetchAndDisplayOrderDetails(orderId);
            }
        }
        
        // Update cart badge
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (typeof updateCartBadge === 'function') {
            updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        }
    } catch (error) {
        console.error('Error loading order details:', error);
        if (typeof showToast === 'function') {
            showToast('Erro ao carregar detalhes do pedido', 'error');
        }
        
        // Ensure the container exists before trying to update it
        const container = document.getElementById('order-details-container');
        if (container) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Erro ao carregar pedido</h3><p>Não foi possível encontrar os detalhes deste pedido</p></div>';
        }
    }
});

async function fetchAndDisplayOrderDetails(orderId) {
    try {
        // Fetch order details directly
        const response = await fetch(`${API_URL}/api/pedidos/${orderId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch order: ${response.status}`);
        }
        
        const order = await response.json();
        
        // Fetch products for this order
        const produtosResponse = await fetch(`${API_URL}/api/pedidos/${orderId}/produtos`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!produtosResponse.ok) {
            throw new Error(`Failed to fetch products: ${produtosResponse.status}`);
        }
        
        const produtos = await produtosResponse.json();
        
        // Calculate total using the same method as in dashboard.js
        const total = produtos.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        
        // Combine data
        const orderWithProducts = {
            ...order,
            produtos: produtos,
            valor: total,
            detalhes: produtos.map(p => p.nome).join(', ')
        };
        
        // Display order details
        displayOrderDetails(orderWithProducts);
    } catch (error) {
        console.error('Error fetching order details:', error);
        if (typeof showToast === 'function') {
            showToast('Erro ao carregar detalhes do pedido', 'error');
        }
        
        // Ensure the container exists before trying to update it
        const container = document.getElementById('order-details-container');
        if (container) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Erro ao carregar pedido</h3><p>Não foi possível encontrar os detalhes deste pedido</p></div>';
        }
    }
}

function displayOrderDetails(order) {
    const container = document.getElementById('order-details-container');
    const orderDateElement = document.getElementById('order-date');
    const statusElement = document.getElementById('order-status');
    const orderId = document.getElementById('order-id');
    // Check if required elements exist
    if (!container) {
        console.error('Error: order-details-container not found in the page');
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Update order header if element exists
    if (orderDateElement) {
        orderDateElement.textContent = typeof formatDateTime === 'function' 
            ? formatDateTime(new Date(order.dataPedido)) 
            : new Date(order.dataPedido).toLocaleString();
    }
    
    // Update order status if element exists
    if (statusElement) {
        // Use the utility functions from utils.js
        const statusClass = typeof getStatusClass === 'function' 
            ? getStatusClass(order.status) 
            : 'status-default';
            
        console.log(statusClass);
        
        const statusText = typeof getStatusText === 'function'
            ? getStatusText(order.status)
            : order.status || 'Desconhecido';
            
        statusElement.className = `status-pill ${statusClass}`;
        statusElement.textContent = statusText;
    }
    
    // Update order ID if element exists
    if (orderId) {
        // Extract a shorter, more readable order number from the timestamp
        // Format: last 4 digits of timestamp + first 2 chars of the hour
        const timestamp = order.dataPedido;
        const date = new Date(timestamp);
        const lastDigits = timestamp.toString().slice(-4);
        const hourPart = date.getHours().toString().padStart(2, '0');
        const formattedOrderId = `#${lastDigits}${hourPart}`;
        
        orderId.textContent = formattedOrderId;
    }

    // Create products list
    if (order.produtos && order.produtos.length > 0) {
        const itemsList = document.createElement('div');
        itemsList.className = 'order-items-list';
        
        order.produtos.forEach(product => {
            const itemRow = document.createElement('div');
            itemRow.className = 'order-item-row';
            itemRow.innerHTML = `
                <div class="item-info">
                    <h4>${product.nome}</h4>
                    <p>${product.descricao || ''}</p>
                </div>
                <div class="item-quantity">${product.quantidade}x</div>
                <div class="item-price">R$ ${typeof formatCurrency === 'function' 
                    ? formatCurrency(product.preco * product.quantidade)
                    : (product.preco * product.quantidade).toFixed(2).replace('.', ',')}</div>
            `;
            itemsList.appendChild(itemRow);
        });
        
        container.appendChild(itemsList);
        
        // Add order total - using same calculation as dashboard.js
        const total = order.valor || order.produtos.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

        const totalRow = document.createElement('div');
        totalRow.className = 'order-total';
        totalRow.innerHTML = `
            <span>Total</span>
            <span>R$ ${typeof formatCurrency === 'function' 
                ? formatCurrency(total)
                : total.toFixed(2).replace('.', ',')}</span>
        `;
        container.appendChild(totalRow);
    } else {
        container.innerHTML = '<div class="empty-state">Este pedido não possui itens</div>';
    }
}

// Use utils.js functions if available, otherwise define fallbacks
if (typeof formatDateTime !== 'function') {
    function formatDateTime(date) {
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

if (typeof formatCurrency !== 'function') {
    function formatCurrency(value) {
        return value.toFixed(2).replace('.', ',');
    }
}

if (typeof updateCartBadge !== 'function') {
    function updateCartBadge(count) {
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
}

if (typeof showToast !== 'function') {
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
}