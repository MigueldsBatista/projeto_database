document.addEventListener('DOMContentLoaded', function() {
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (!orderId) {
        console.warn('No order ID provided in URL');
        // Don't redirect immediately, show a message instead
        showToast('ID do pedido não encontrado', 'error');
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 3000); // Give time to read the toast
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (typeof updateCartBadge === 'function') {
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    } else {
        console.warn('updateCartBadge function not found');
    }
    
    let order = null;
    
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    if (lastOrder && (lastOrder.id === orderId || lastOrder.dataPedido === orderId)) {
        order = lastOrder;
        console.log('Found order in lastOrder', order);
    }
    
    if (!order && typeof appState !== 'undefined' && appState.dataLoaded && appState.userProfile) {
        order = appState.userProfile.pedidos?.find(p => p.dataPedido === orderId);
        console.log('Found order in appState', order);
    }
    
    if (!order) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        order = orders.find(o => o.id === orderId || o.dataPedido === orderId);
        console.log('Found order in orders array', order);
    }
    
    if (!order) {
        console.warn('Order not found with ID:', orderId);
        showToast('Pedido não encontrado', 'error');
        
        document.getElementById('order-id').textContent = 'Desconhecido';
        document.getElementById('order-date').textContent = formatDateTime(new Date());
        document.getElementById('order-total').textContent = 'R$ 0,00';
        
        document.getElementById('view-order-btn').textContent = 'Ver Todos os Pedidos';
        document.getElementById('view-order-btn').addEventListener('click', function() {
            window.location.href = 'orders.html';
        });
        
        document.getElementById('home-btn').addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
        
        return;
    }
    
    document.getElementById('order-id').textContent = getFormattedOrderId(order.id);
    document.getElementById('order-date').textContent = formatDateTime(new Date(order.date || order.dataPedido));
    
    let total = 0;

    total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('order-total').textContent = `R$ ${formatCurrency(total)}`;
    
    document.getElementById('view-order-btn').addEventListener('click', function() {
        // Use the same ID format when navigating to order details
        const idToUse = order.dataPedido || order.id;
        window.location.href = `order-details.html?id=${idToUse}`;
    });
    
    document.getElementById('home-btn').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });
});


