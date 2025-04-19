document.addEventListener('DOMContentLoaded', function() {
    // if (!localStorage.getItem('orders')) {
    //     const sampleOrders = [
    //         {
    //             id: 1,
    //             date: new Date(Date.now() - 2 * 60 * 60 * 1000), 
    //             items: [
    //                 { id: 1, name: 'Café da manhã', price: 18.90, quantity: 1 },
    //                 { id: 10, name: 'Água Mineral', price: 3.50, quantity: 2 }
    //             ],
    //             notes: "",
    //             subtotal: 25.90,
    //             serviceFee: 2.59,
    //             total: 28.49,
    //             status: 'delivered'
    //         },
    //         {
    //             id: 2,
    //             date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    //             items: [
    //                 { id: 6, name: 'Jantar Leve', price: 18.90, quantity: 1 },
    //                 { id: 11, name: 'Suco Natural', price: 7.90, quantity: 1 },
    //                 { id: 8, name: 'Pudim de Leite', price: 8.50, quantity: 1 }
    //             ],
    //             notes: "Sem sal no jantar, por favor.",
    //             subtotal: 35.30,
    //             serviceFee: 3.53,
    //             total: 38.83,
    //             status: 'delivered'
    //         },
    //         {
    //             id: 3,
    //             date: new Date(), // Now
    //             items: [
    //                 { id: 4, name: 'Almoço Executivo', price: 27.90, quantity: 1 },
    //                 { id: 10, name: 'Água Mineral', price: 3.50, quantity: 1 }
    //             ],
    //             notes: "Sem pimenta, por favor.",
    //             subtotal: 31.40,
    //             serviceFee: 3.14,
    //             total: 34.54,
    //             status: 'pending'
    //         }
    //     ];
        
    //     localStorage.setItem('orders', JSON.stringify(sampleOrders));
    // }
    
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    
    // Display all orders initially
    displayOrders('all');
    
    // Tab click event listeners
    document.querySelectorAll('.orders-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            
            // Update active tab
            document.querySelectorAll('.orders-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Display filtered orders
            displayOrders(status);
        });
    });
    
    function displayOrders(status) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const container = document.getElementById('orders-container');
        const emptyMessage = document.getElementById('empty-orders-message');
        
        let filteredOrders;
        
        if (status === 'all') {
            filteredOrders = orders;
        } else {
            filteredOrders = orders.filter(order => order.status === status);
        }
        
        if (filteredOrders.length === 0) {
            container.innerHTML = '';
            emptyMessage.style.display = 'flex';
        } else {
            emptyMessage.style.display = 'none';
            renderOrders(filteredOrders);
        }
    }
    
    function renderOrders(orders) {
        const container = document.getElementById('orders-container');
        container.innerHTML = '';
        
        // Sort orders by date, newest first
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        orders.forEach(order => {
            const mainItems = order.items.slice(0, 2);
            const additionalCount = order.items.length - 2;
            
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.setAttribute('data-id', order.id);
            
            // Use the standardized functions from app.js
            const statusClass = getStatusClass(order.status);
            const statusText = getStatusText(order.status);
            
            orderCard.innerHTML = `
                <div class="order-info">
                    <p class="order-date">${formatDate(new Date(order.date))}</p>
                    <p class="order-items">
                        ${mainItems.map(item => item.name).join(', ')}
                        ${additionalCount > 0 ? ` e mais ${additionalCount} item(s)` : ''}
                    </p>
                    <p class="order-price">R$ ${formatCurrency(order.total)}</p>
                </div>
                <div class="order-status">
                    <span class="status-pill ${statusClass}">${statusText}</span>
                </div>
            `;
            
            container.appendChild(orderCard);
            
            // Add click event to view order details
            orderCard.addEventListener('click', function() {
                window.location.href = `order-details.html?id=${order.id}`;
            });
        });
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
});