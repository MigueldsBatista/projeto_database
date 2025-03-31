document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Reference to DOM elements
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('cart-subtotal');
    const serviceFeeElement = document.getElementById('cart-service-fee');
    const totalElement = document.getElementById('cart-total');
    
    // Update the cart display
    updateCartDisplay();
    
    // Clear cart button
    document.getElementById('clear-cart-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
                // Clear cart data
                localStorage.setItem('cart', JSON.stringify([]));
                
                // Update display
                updateCartDisplay();
                
                // Show toast
                showToast('Carrinho esvaziado com sucesso', 'success');
            }
        } else {
            showToast('Seu carrinho já está vazio', 'info');
        }
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        const notes = document.getElementById('order-notes').value;
        
        // Create order object
        const order = {
            id: Date.now(),
            date: new Date(),
            items: cart,
            notes: notes,
            subtotal: calculateSubtotal(),
            serviceFee: calculateServiceFee(),
            total: calculateTotal(),
            status: 'pending'
        };
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Redirect to order confirmation
        window.location.href = `order-confirmation.html?id=${order.id}`;
    });
    
    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItemsContainer.innerHTML = '';
            cartSummary.style.display = 'none';
            emptyCartMessage.style.display = 'block';
        } else {
            // Show cart items
            renderCartItems(cart);
            cartSummary.style.display = 'block';
            emptyCartMessage.style.display = 'none';
            
            // Update totals
            subtotalElement.textContent = `R$ ${formatCurrency(calculateSubtotal())}`;
            serviceFeeElement.textContent = `R$ ${formatCurrency(calculateServiceFee())}`;
            totalElement.textContent = `R$ ${formatCurrency(calculateTotal())}`;
        }
        
        // Update cart badge
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    }
    
    function renderCartItems(items) {
        cartItemsContainer.innerHTML = '';
        
        items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">R$ ${formatCurrency(item.price)}</p>
                    <div class="cart-quantity-control">
                        <button class="quantity-button decrease" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-button increase" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="icon-button remove" data-id="${item.id}" style="margin-left: 16px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners for quantity controls
        document.querySelectorAll('.quantity-button.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                updateItemQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.quantity-button.increase').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                updateItemQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.icon-button.remove').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                removeItem(id);
            });
        });
    }
    
    function updateItemQuantity(id, change) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(item => item.id === id);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                // Remove item if quantity is 0 or less
                removeItem(id);
            } else {
                // Save updated cart
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    }
    
    function removeItem(id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Filter out the item to remove
        cart = cart.filter(item => item.id !== id);
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update display
        updateCartDisplay();
        
        // Show toast
        showToast('Item removido do carrinho', 'success');
    }
    
    function calculateSubtotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function calculateServiceFee() {
        // 10% service fee
        return calculateSubtotal() * 0.1;
    }
    
    function calculateTotal() {
        return calculateSubtotal() + calculateServiceFee();
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