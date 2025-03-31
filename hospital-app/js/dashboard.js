document.addEventListener('DOMContentLoaded', function() {
    // Update user info from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Paciente', room: '000' };
    document.getElementById('patient-name').textContent = user.name;
    document.getElementById('room-number').textContent = user.room;
    
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
});

function updateCartBadge(count) {
    const badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}