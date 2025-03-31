document.addEventListener('DOMContentLoaded', function() {
    // Menu items data
    const menuItems = [
        {
            id: 1,
            name: 'Café da Manhã Completo',
            description: 'Pão, manteiga, queijo, presunto, café e suco',
            price: 19.90,
            image: 'img/products/breakfast.jpg',
            category: 'breakfast'
        },
        {
            id: 2,
            name: 'Café com Leite',
            description: '300ml',
            price: 5.50,
            image: 'img/products/coffee.jpg',
            category: 'breakfast'
        },
        {
            id: 3,
            name: 'Pão com Manteiga',
            description: '2 unidades',
            price: 4.50,
            image: 'img/products/bread.jpg',
            category: 'breakfast'
        },
        {
            id: 4,
            name: 'Almoço Executivo',
            description: 'Arroz, feijão, proteína do dia e salada',
            price: 27.90,
            image: 'img/products/lunch.jpg',
            category: 'lunch'
        },
        {
            id: 5,
            name: 'Filé de Frango Grelhado',
            description: 'Com arroz, legumes e purê',
            price: 32.90,
            image: 'img/products/chicken.jpg',
            category: 'lunch'
        },
        {
            id: 6,
            name: 'Jantar Leve',
            description: 'Sopa do dia com pão integral',
            price: 18.90,
            image: 'img/products/dinner.jpg',
            category: 'dinner'
        },
        {
            id: 7,
            name: 'Omelete com Salada',
            description: 'Omelete com legumes e salada verde',
            price: 22.50,
            image: 'img/products/omelet.jpg',
            category: 'dinner'
        },
        {
            id: 8,
            name: 'Pudim de Leite',
            description: 'Porção individual',
            price: 8.50,
            image: 'img/products/pudding.jpg',
            category: 'dessert'
        },
        {
            id: 9,
            name: 'Salada de Frutas',
            description: 'Frutas da estação',
            price: 7.90,
            image: 'img/products/fruits.jpg',
            category: 'dessert'
        },
        {
            id: 10,
            name: 'Água Mineral',
            description: 'Garrafa 500ml',
            price: 3.50,
            image: 'img/products/water.jpg',
            category: 'all'
        },
        {
            id: 11,
            name: 'Suco Natural',
            description: 'Laranja ou maçã, 300ml',
            price: 7.90,
            image: 'img/products/juice.jpg',
            category: 'all'
        }
    ];
    
    // Save menu items to localStorage
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Set active tab based on URL parameter or default to 'all'
    const activeCategory = categoryParam || 'all';
    document.querySelector(`.tab-item[data-category="${activeCategory}"]`).classList.add('active');
    
    // Display products based on selected category
    displayProducts(activeCategory);
    
    // Tab click event listeners
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            document.querySelectorAll('.tab-item').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Display filtered products
            displayProducts(category);
        });
    });
    
    // Search toggle
    document.getElementById('search-toggle').addEventListener('click', function() {
        const searchBar = document.getElementById('search-bar');
        searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
        if (searchBar.style.display === 'block') {
            document.getElementById('search-input').focus();
        }
    });
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm) {
            document.getElementById('clear-search').style.display = 'block';
            
            // Filter products by search term
            const filteredItems = menuItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm)
            );
            
            renderProducts(filteredItems);
        } else {
            document.getElementById('clear-search').style.display = 'none';
            
            // Reset to active category
            const activeCategory = document.querySelector('.tab-item.active').getAttribute('data-category');
            displayProducts(activeCategory);
        }
    });
    
    // Clear search
    document.getElementById('clear-search').addEventListener('click', function() {
        document.getElementById('search-input').value = '';
        this.style.display = 'none';
        
        // Reset to active category
        const activeCategory = document.querySelector('.tab-item.active').getAttribute('data-category');
        displayProducts(activeCategory);
    });
    
    // Update cart badge
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    
    function displayProducts(category) {
        let filteredItems;
        
        if (category === 'all') {
            filteredItems = menuItems;
        } else {
            filteredItems = menuItems.filter(item => item.category === category || item.category === 'all');
        }
        
        renderProducts(filteredItems);
    }
    
    function renderProducts(items) {
        const container = document.getElementById('products-container');
        container.innerHTML = '';
        
        items.forEach(item => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-id', item.id);
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="product-info">
                    <h3>${item.name}</h3>
                    <p class="product-description">${item.description}</p>
                    <div class="product-price-action">
                        <p class="product-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        <button class="add-to-cart-button">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(productCard);
            
            // Add click event to the product card
            productCard.querySelector('.add-to-cart-button').addEventListener('click', function(e) {
                e.stopPropagation();
                addToCart(item);
            });
            
            // Add click event to the entire card for details view
            productCard.addEventListener('click', function() {
                window.location.href = `product-details.html?id=${item.id}`;
            });
        });
    }
    
    function addToCart(product) {
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Show toast notification
        showToast(`${product.name} adicionado ao carrinho`, 'success');
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