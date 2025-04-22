document.addEventListener('DOMContentLoaded', async function() {
    const API_URL = 'http://localhost:8080';
    
    try {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            showToast('ID do produto não encontrado', 'error');
            window.location.href = 'menu.html';
            return;
        }
        
        // Fetch product details from API
        const product = await fetchProductDetails(productId);
        
        // Display product details
        if (product) {
            updateProductUI(product);
        } else {
            showToast('Produto não encontrado', 'error');
            window.location.href = 'menu.html';
        }
        
        // Update cart badge
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Add event listeners
        document.getElementById('add-to-cart-btn').addEventListener('click', function() {
            addToCart(product);
        });
        
        document.getElementById('increase-quantity').addEventListener('click', function() {
            const quantityValue = document.getElementById('quantity-value');
            const currentValue = parseInt(quantityValue.textContent) || 1;
            quantityValue.textContent = currentValue + 1;
        });
        
        document.getElementById('decrease-quantity').addEventListener('click', function() {
            const quantityValue = document.getElementById('quantity-value');
            const currentValue = parseInt(quantityValue.textContent) || 1;
            if (currentValue > 1) {
                quantityValue.textContent = currentValue - 1;
            }
        });
    } catch (error) {
        console.error('Error loading product details:', error);
        showToast('Erro ao carregar detalhes do produto', 'error');
    }
    
    async function fetchProductDetails(productId) {
        try {
            const response = await fetch(`${API_URL}/api/produtos/${productId}`, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.status}`);
            }
            
            const product = await response.json();
            console.log('Received product data:', product);
            return product;
        } catch (error) {
            console.error('Error fetching product details:', error);
            
            // Try to find product in localStorage as fallback
            const allProducts = JSON.parse(localStorage.getItem('menuItems')) || [];
            const product = allProducts.find(p => p.id == productId);
            
            if (product) {
                console.log('Found product in localStorage:', product);
                return product;
            }
            
            return null;
        }
    }
    
    function updateProductUI(product) {
        // Update product header info
        document.getElementById('product-name').textContent = product.nome;
        document.getElementById('product-description').textContent = product.descricao;
        document.getElementById('product-price').textContent = `R$ ${formatCurrency(product.preco)}`;
        
        // Update preparation time if exists
        const prepTimeElement = document.getElementById('prep-time');
        if (prepTimeElement) {
            const prepTime = product.tempoPreparoMinutos || product.tempoPreparo || 15;
            prepTimeElement.textContent = `${prepTime} minutos`;
        }
        
        // Set category if available
        const categoryElement = document.getElementById('product-category');
        if (categoryElement) {
            const categoryName = product.categoria?.nome || product.categoriaNome || "Geral";
            categoryElement.textContent = categoryName;
        }
        
 
        // Create nutritional info section if product has this data
        if (hasNutritionalInfo(product)) {
            createNutritionalInfoSection(product);
        } else {
            // Hide the section if no nutritional info is available
            const nutritionalSection = document.getElementById('nutritional-info-section');
            if (nutritionalSection) {
                nutritionalSection.style.display = 'none';
            }
        }
        
        // Update image if available
        const productImage = document.getElementById('product-image');
        if (productImage) {
            const imageSrc = product.image || 'img/placeholder.png';
            productImage.src = imageSrc;
            productImage.alt = product.nome;
        }
    }
    
    function hasNutritionalInfo(product) {
        return product.caloriasKcal != null || 
               product.proteinasG != null || 
               product.carboidratosG != null || 
               product.gordurasG != null || 
               product.sodioMg != null;
    }
    
    function createNutritionalInfoSection(product) {
        const nutritionalSection = document.getElementById('nutritional-info-section');
        if (!nutritionalSection) return;
        
        // Show the section
        nutritionalSection.style.display = 'block';
        
        // Get the list container
        const infoList = document.getElementById('nutritional-info-list');
        if (!infoList) return;
        
        // Clear existing content
        infoList.innerHTML = '';
        
        // Add items with checks for existence
        if (product.caloriasKcal != null) {
            addNutritionalItem(infoList, 'Calorias', `${product.caloriasKcal} kcal`);
        }
        
        if (product.proteinasG != null) {
            addNutritionalItem(infoList, 'Proteínas', `${product.proteinasG}g`);
        }
        
        if (product.carboidratosG != null) {
            addNutritionalItem(infoList, 'Carboidratos', `${product.carboidratosG}g`);
        }
        
        if (product.gordurasG != null) {
            addNutritionalItem(infoList, 'Gorduras', `${product.gordurasG}g`);
        }
        
        if (product.sodioMg != null) {
            addNutritionalItem(infoList, 'Sódio', `${product.sodioMg}mg`);
        }
    }
    
    function addNutritionalItem(container, label, value) {
        const item = document.createElement('li');
        item.innerHTML = `
            <span class="info-label">${label}:</span>
            <span class="info-value">${value}</span>
        `;
        container.appendChild(item);
    }
    
    function addToCart(product) {
        // Get the current quantity from the span element
        const quantityValue = document.getElementById('quantity-value');
        const quantity = parseInt(quantityValue.textContent) || 1;
        
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.nome,
                price: product.preco,
                image: product.image || 'img/placeholder.png',
                quantity: quantity
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Show toast notification
        showToast(`${quantity}x ${product.nome} adicionado ao carrinho`, 'success');
    }
});