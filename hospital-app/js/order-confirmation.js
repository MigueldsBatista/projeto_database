document.addEventListener('DOMContentLoaded', function() {
// Get order ID from URL
const urlParams = new URLSearchParams(window.location.search);
const orderId = parseInt(urlParams.get('id'));

if (!orderId) {
    // No order ID provided, redirect to orders page
    window.location.href = 'orders.html';
    return;
}

// Get cart count from localStorage (should be 0 after order)
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
document.getElementById('order-total').textContent = `R$ ${formatCurrency(order.total)}`;

// Add event listeners for buttons
document.getElementById('view-order-btn').addEventListener('click', function() {
    window.location.href = `order-details.html?id=${order.id}`;
});

document.getElementById('home-btn').addEventListener('click', function() {
    window.location.href = 'dashboard.html';
});

function formatDate(date) {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
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