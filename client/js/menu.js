document.addEventListener('DOMContentLoaded', async function() {
    const API_URL = 'http://localhost:8080';
    let allProducts = [];
    
    try {
        console.log('Loading menu data...');
        
        // Fetch product categories and products from API
        const categories = await fetchCategories();
        console.log('Categories loaded:', categories);
        
        allProducts = await fetchProducts();
        localStorage.setItem('menuItems', JSON.stringify(allProducts));

        console.log('Products loaded:', allProducts);
        
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
        
        displayProducts(activeCategory);
        
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
        
        document.getElementById('clear-search').addEventListener('click', function() {
            document.getElementById('search-input').value = '';
            this.style.display = 'none';
            
            // Reset to active category
            const activeCategory = document.querySelector('.tab-item.active').getAttribute('data-category');
            displayProducts(activeCategory);
        });
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    } catch (error) {
        console.error('Error loading menu data:', error);
        showToast('Erro ao carregar os produtos. Usando dados offline.', 'error');
        
    }
    
    async function fetchCategories() {
        try {
            console.log('Fetching categories from:', `${API_URL}/api/categoria-produto`);
            const response = await fetch(`${API_URL}/api/categoria-produto`, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors'
            });
            if (!response.ok) {
                console.error('Failed to fetch categories. Status:', response.status);
                throw new Error(`Failed to fetch categories: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    async function fetchProducts() {
        try {
            console.log('Fetching products from:', `${API_URL}/api/produtos`);
            const response = await fetch(`${API_URL}/api/produtos`, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors'
            });
            
            if (!response.ok) {
                console.error('Failed to fetch products. Status:', response.status);
                throw new Error(`Failed to fetch products: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Ensure categoriaId is properly handled
            const processedData = data.map(product => {
                return {
                    ...product,
                    // Ensure categoriaId is a number or null
                    categoriaId: product.categoriaId || 
                               (product.categoria ? product.categoria.id : null)
                };
            });
            
            console.log('Processed product data:', processedData);
            return processedData;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }
    
    function updateCategoryTabs(categories) {
        const tabsContainer = document.querySelector('.category-tabs');
        if (!tabsContainer) return;
        // Limpa tabs existentes
        tabsContainer.innerHTML = '';
        // Adiciona tab "Todos"
        const allTab = document.createElement('button');
        allTab.className = 'tab-item';
        allTab.setAttribute('data-category', 'all');
        allTab.textContent = 'Todos';
        tabsContainer.appendChild(allTab);
        // Adiciona tabs dinâmicas
        categories.forEach(category => {
            const tab = document.createElement('button');
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
            const categoryIdNum = parseInt(categoryId);
            filteredItems = allProducts.filter(item => {
                return (
                    item.categoriaId === categoryIdNum ||
                    (item.categoria && item.categoria.id === categoryIdNum)
                );
            });
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
            const imageSrc = item.image || '../img/placeholder.png';
            
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
    
});