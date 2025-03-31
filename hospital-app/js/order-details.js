document.addEventListener('DOMContentLoaded', function() {
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = parseInt(urlParams.get('id'));
    
    if (!orderId) {
        // No order ID provided, redirect to orders page
        window.location.href = 'orders.html';
        return;
    }
    
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    
    // Get order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        // Order not found, redirect to orders page
        window.location.href = 'orders.html';
        return;
    }
    
    // Update order details in the UI
    document.getElementById('order-id').textContent = order.id;
    document.getElementById('order-date').textContent = formatDate(new Date(order.date));
    
    // Update status
    const statusElement = document.getElementById('order-status');
    statusElement.className = `order-status-large ${order.status}`;
    statusElement.textContent = getStatusText(order.status);
    
    // Render timeline
    renderTimeline(order);
    
    // Render order items
    renderOrderItems(order.items);
    
    // Update order notes
    const orderNotes = document.getElementById('order-notes');
    if (order.notes && order.notes.trim().length > 0) {
        orderNotes.textContent = order.notes;
    } else {
        orderNotes.textContent = 'Sem observações';
    }
    
    // Update totals
    document.getElementById('order-subtotal').textContent = `R$ ${formatCurrency(order.subtotal)}`;
    document.getElementById('order-service-fee').textContent = `R$ ${formatCurrency(order.serviceFee)}`;
    document.getElementById('order-total').textContent = `R$ ${formatCurrency(order.total)}`;
    
    // Add event listeners
    document.getElementById('contact-support-btn').addEventListener('click', function() {
        showToast('Entrando em contato com o suporte...', 'info');
        // In a real app, this would open a chat or call support
    });
    
    document.getElementById('reorder-btn').addEventListener('click', function() {
        // Add the items from this order to the cart
        const newCart = [...order.items];
        localStorage.setItem('cart', JSON.stringify(newCart));
        
        // Redirect to cart
        window.location.href = 'cart.html';
    });
    
    function renderTimeline(order) {
        const timelineContainer = document.getElementById('order-timeline');
        timelineContainer.innerHTML = '';
        
        // Define timeline steps based on order status
        const timeline = [];
        
        // Always add the "Order Placed" step as completed
        timeline.push({
            time: formatDate(new Date(order.date)),
            status: 'Pedido Recebido',
            description: 'Seu pedido foi recebido pelo hospital',
            state: 'completed'
        });
        
        // Add "Order In Preparation" step
        if (order.status === 'in-progress' || order.status === 'delivered') {
            // This step is completed
            timeline.push({
                time: formatRelativeTime(new Date(order.date), 10), // Assume 10 minutes after order placed
                status: 'Em Preparo',
                description: 'Seu pedido está sendo preparado',
                state: 'completed'
            });
        } else if (order.status === 'pending') {
            // This step is next
            timeline.push({
                time: 'Em breve',
                status: 'Em Preparo',
                description: 'Seu pedido será preparado em breve',
                state: 'next'
            });
        }
        
        // Add "Order Delivered" step
        if (order.status === 'delivered') {
            // This step is completed
            timeline.push({
                time: formatRelativeTime(new Date(order.date), 30), // Assume 30 minutes after order placed
                status: 'Entregue',
                description: 'Seu pedido foi entregue com sucesso',
                state: 'completed'
            });
        } else {
            // This step is future
            timeline.push({
                time: 'Em breve',
                status: 'Entregue',
                description: 'Seu pedido será entregue em breve',
                state: 'future'
            });
        }
        
        // Render the timeline
        timeline.forEach((step, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${step.state}`;
            
            if (step.state === 'next') {
                timelineItem.classList.add('active');
            }
            
            timelineItem.innerHTML = `
                <p class="timeline-time">${step.time}</p>
                <p class="timeline-status">${step.status}</p>
                <p class="timeline-description">${step.description}</p>
            `;
            
            timelineContainer.appendChild(timelineItem);
        });
    }
    
    function renderOrderItems(items) {
        const container = document.getElementById('order-items-container');
        container.innerHTML = '';
        
        items.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-image">
                    <img src="${item.image || 'img/products/placeholder.jpg'}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <p class="order-item-name">${item.name}</p>
                    <p class="order-item-quantity">Quantidade: ${item.quantity}</p>
                </div>
                <p class="order-item-price">R$ ${formatCurrency(item.price * item.quantity)}</p>
            `;
            
            container.appendChild(orderItem);
        });
    }
    
    function getStatusText(status) {
        switch (status) {
            case 'pending':
                return 'Pendente';
            case 'in-progress':
                return 'Em Preparo';
            case 'delivered':
                return 'Entregue';
            default:
                return status;
        }
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
    
    function formatRelativeTime(baseDate, minutesLater) {
        const newDate = new Date(baseDate);
        newDate.setMinutes(newDate.getMinutes() + minutesLater);
        return `${newDate.getHours().toString().padStart(2, '0')}:${newDate.getMinutes().toString().padStart(2, '0')}`;
    }
    
    function formatCurrency(value) {
        return value.toFixed(2).replace('.', ',');
    }
    
    function updateCartBadge(count) {
        const badges = document.querySelectorAll('.cart-badge');
        
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
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
});