document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        // No product ID provided, redirect to menu page
        window.location.href = 'menu.html';
        return;
    }
    
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    
    // Get product data from localStorage
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    const product = menuItems.find(item => item.id === productId);
    
    if (!product) {
        // Product not found, redirect to menu page
        window.location.href = 'menu.html';
        return;
    }
    
    // Update product details in the UI
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = formatCurrency(product.price);
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    
    // Set category name
    let categoryName = 'Geral';
    switch(product.category) {
        case 'breakfast':
            categoryName = 'Café da Manhã';
            break;
        case 'lunch':
            categoryName = 'Almoço';
            break;
        case 'dinner':
            categoryName = 'Jantar';
            break;
        case 'dessert':
            categoryName = 'Sobremesa';
            break;
    }
    document.getElementById('product-category').textContent = categoryName;
    
    // Set estimated prep time based on category
    let prepTime = '30 minutos';
    if (product.category === 'breakfast') {
        prepTime = '15 minutos';
    } else if (product.category === 'dessert') {
        prepTime = '10 minutos';
    }
    document.getElementById('prep-time').textContent = prepTime;
    
    // Add nutritional info for food items
    if (['breakfast', 'lunch', 'dinner', 'dessert'].includes(product.category)) {
        document.getElementById('nutritional-info-section').style.display = 'block';
        const nutritionalInfoList = document.getElementById('nutritional-info-list');
        
        // Generate some sample nutritional info
        const nutritionalInfo = [
            { label: 'Calorias', value: `${Math.floor(Math.random() * 500 + 100)} kcal` },
            { label: 'Proteínas', value: `${Math.floor(Math.random() * 20 + 5)}g` },
            { label: 'Carboidratos', value: `${Math.floor(Math.random() * 50 + 10)}g` },
            { label: 'Gorduras', value: `${Math.floor(Math.random() * 20 + 2)}g` },
            { label: 'Sódio', value: `${Math.floor(Math.random() * 500 + 50)}mg` }
        ];
        
        nutritionalInfo.forEach(info => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="info-label">${info.label}:</span>
                <span class="info-value">${info.value}</span>
            `;
            nutritionalInfoList.appendChild(listItem);
        });
    }
    
    // Quantity control
    let quantity = 1;
    const quantityValue = document.getElementById('quantity-value');
    
    document.getElementById('decrease-quantity').addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
        }
    });
    
    document.getElementById('increase-quantity').addEventListener('click', function() {
        quantity++;
        quantityValue.textContent = quantity;
    });
    
    // Add to cart button
    document.getElementById('add-to-cart-btn').addEventListener('click', function() {
        // Get current cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Show success message
        showToast(`${quantity}x ${product.name} adicionado ao carrinho`, 'success');
        
        // Reset quantity
        quantity = 1;
        quantityValue.textContent = quantity;
    });
    
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