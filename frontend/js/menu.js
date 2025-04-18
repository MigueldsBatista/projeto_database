document.addEventListener('DOMContentLoaded', async function() {
    const API_URL = 'http://localhost:8080';
    let allProducts = [];
    
    try {
        // Fetch product categories and products from API
        const categories = await fetchCategories();
        allProducts = await fetchProducts();
        
        // Update category tabs dynamically if we have categories
        if (categories && categories.length > 0) {
            updateCategoryTabs(categories);
        }
        
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        // Set active tab based on URL parameter or default to 'all'
        const activeCategory = categoryParam || 'all';
        const activeTab = document.querySelector(`.tab-item[data-category="${activeCategory}"]`);
        if (activeTab) activeTab.classList.add('active');
        
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
                const filteredItems = allProducts.filter(item => 
                    item.nome.toLowerCase().includes(searchTerm) || 
                    item.descricao.toLowerCase().includes(searchTerm)
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
    } catch (error) {
        console.error('Error loading menu data:', error);
        showToast('Erro ao carregar os produtos. Usando dados offline.', 'error');
        
        // Fallback to offline data if API fails
        loadOfflineData();
    }
    
    async function fetchCategories() {
        try {
            const response = await fetch(`${API_URL}/api/categoria-produto`, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors'
            });
            
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return null;
        }
    }
    
    async function fetchProducts() {
        try {
            const response = await fetch(`${API_URL}/api/produtos`, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors'
            });
            
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }
    
    function updateCategoryTabs(categories) {
        const tabsContainer = document.querySelector('.tabs-container');
        if (!tabsContainer) return;
        
        // Keep the "All" tab as the first item
        const allTab = tabsContainer.querySelector('.tab-item[data-category="all"]');
        
        // Clear existing tabs except "All"
        tabsContainer.innerHTML = '';
        if (allTab) tabsContainer.appendChild(allTab);
        
        // Add category tabs
        categories.forEach(category => {
            const tab = document.createElement('div');
            tab.className = 'tab-item';
            tab.setAttribute('data-category', category.id.toString());
            tab.textContent = category.nome;
            
            tabsContainer.appendChild(tab);
        });
    }
    
    function displayProducts(categoryId) {
        let filteredItems;
        
        if (categoryId === 'all') {
            filteredItems = allProducts;
        } else {
            // Filter by category ID
            filteredItems = allProducts.filter(item => 
                item.categoriaId === parseInt(categoryId) || item.categoriaId === null
            );
        }
        
        renderProducts(filteredItems);
    }
    
    function renderProducts(items) {
        const container = document.getElementById('products-container');
        container.innerHTML = '';
        
        if (!items || items.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum produto encontrado</div>';
            return;
        }
        
        items.forEach(item => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-id', item.id);
            
            // Use placeholder image if no image available
            const imageSrc = item.image || 'img/products/placeholder.jpg';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${imageSrc}" alt="${item.nome}">
                </div>
                <div class="product-info">
                    <h3>${item.nome}</h3>
                    <p class="product-description">${item.descricao}</p>
                    <div class="product-price-action">
                        <p class="product-price">R$ ${formatCurrency(item.preco)}</p>
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
                name: product.nome,
                price: product.preco,
                image: product.image || 'img/products/placeholder.jpg',
                quantity: 1
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Show toast notification
        showToast(`${product.nome} adicionado ao carrinho`, 'success');
    }
    
    // Fallback to offline data if API fails
    function loadOfflineData() {
        const offlineProducts = [
            {
                id: 1,
                nome: 'Café da Manhã Completo',
                descricao: 'Pão, manteiga, queijo, presunto, café e suco',
                preco: 19.90,
                image: 'img/products/breakfast.jpg',
                categoriaId: 1
            },
            {
                id: 2,
                nome: 'Café com Leite',
                descricao: '300ml',
                preco: 5.50,
                image: 'img/products/coffee.jpg',
                categoriaId: 1
            },
            {
                id: 3,
                nome: 'Pão com Manteiga',
                descricao: '2 unidades',
                preco: 4.50,
                image: 'img/products/bread.jpg',
                categoriaId: 1
            },
            {
                id: 4,
                nome: 'Almoço Executivo',
                descricao: 'Arroz, feijão, proteína do dia e salada',
                preco: 27.90,
                image: 'img/products/lunch.jpg',
                categoriaId: 2
            },
            {
                id: 5,
                nome: 'Filé de Frango Grelhado',
                descricao: 'Com arroz, legumes e purê',
                preco: 32.90,
                image: 'img/products/chicken.jpg',
                categoriaId: 2
            },
            {
                id: 6,
                nome: 'Jantar Leve',
                descricao: 'Sopa do dia com pão integral',
                preco: 18.90,
                image: 'img/products/dinner.jpg',
                categoriaId: 3
            },
            {
                id: 7,
                nome: 'Omelete com Salada',
                descricao: 'Omelete com legumes e salada verde',
                preco: 22.50,
                image: 'img/products/omelet.jpg',
                categoriaId: 3
            },
            {
                id: 8,
                nome: 'Pudim de Leite',
                descricao: 'Porção individual',
                preco: 8.50,
                image: 'img/products/pudding.jpg',
                categoriaId: 4
            },
            {
                id: 9,
                nome: 'Salada de Frutas',
                descricao: 'Frutas da estação',
                preco: 7.90,
                image: 'img/products/fruits.jpg',
                categoriaId: 4
            },
            {
                id: 10,
                nome: 'Água Mineral',
                descricao: 'Garrafa 500ml',
                preco: 3.50,
                image: 'img/products/water.jpg',
                categoriaId: 5
            },
            {
                id: 11,
                nome: 'Suco Natural',
                descricao: 'Laranja ou maçã, 300ml',
                preco: 7.90,
                image: 'img/products/juice.jpg',
                categoriaId: 5
            }
        ];
        
        const offlineCategories = [
            { id: 1, nome: 'Café da Manhã', descricao: 'Itens de café da manhã' },
            { id: 2, nome: 'Almoço', descricao: 'Itens de almoço' },
            { id: 3, nome: 'Jantar', descricao: 'Itens de jantar' },
            { id: 4, nome: 'Sobremesas', descricao: 'Sobremesas e doces' },
            { id: 5, nome: 'Bebidas', descricao: 'Bebidas diversas' }
        ];
        
        // Update UI with offline data
        allProducts = offlineProducts;
        updateCategoryTabs(offlineCategories);
        
        // Set active tab based on URL parameter or default to 'all'
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        const activeCategory = categoryParam || 'all';
        const activeTab = document.querySelector(`.tab-item[data-category="${activeCategory}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        // Display products based on selected category
        displayProducts(activeCategory);
    }
    
    function updateCartBadge(count) {
        const badges = document.querySelectorAll('.cart-badge');
        
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
    
    function formatCurrency(value) {
        return Number(value).toFixed(2).replace('.', ',');
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