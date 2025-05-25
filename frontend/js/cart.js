document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:8080';
    
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Reference to DOM elements
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-message');
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
    document.getElementById('checkout-btn').addEventListener('click', async function() {
        if (cart.length === 0) {
            showToast('Seu carrinho está vazio', 'error');
            return;
        }
        
        try {
            const checkoutBtn = this;
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            
            // Get patient ID from localStorage
            const pacienteId = localStorage.getItem('pacienteId') || 1;
            
            // Get patient's estadia (stay)
            const estadia = await fetchPacienteEstadia(pacienteId);
            if (!estadia) {
                throw new Error('Não foi possível encontrar uma estadia ativa');
            }
            
            // Get user notes
            const notes = document.getElementById('order-notes').value;
            
            // Create the order object for the backend
            const order = {
                dataEntradaEstadia: estadia.id, // Using estadia ID as required by the API
                status: 'PENDENTE',
                notes: notes // Note: This might not be in your API but can be useful
            };
            
            // Submit the order to the API
            const savedOrder = await submitOrder(order);
            
            // Add items to the order
            const orderItems = await Promise.all(cart.map(item => {
                return submitOrderItem({
                    produtoId: item.id,
                    dataPedido: savedOrder.dataPedido,
                    quantidade: item.quantity
                }
            );
            }));
            
            // Clear cart after successful order
            localStorage.setItem('cart', JSON.stringify([]));
            
            // Save order info for the confirmation page
            localStorage.setItem('lastOrder', JSON.stringify({
                id: savedOrder.dataPedido,
                date: new Date(savedOrder.dataPedido),
                items: cart,
                notes: notes,
                total: calculateTotal()
            }));
            
            // Redirect to order confirmation page
            window.location.href = `order-confirmation.html?id=${encodeURIComponent(savedOrder.dataPedido)}`;
            
        } catch (error) {
            console.error('Error submitting order:', error);
            showToast('Erro ao enviar pedido. Por favor, tente novamente.', 'error');
            
            // Re-enable checkout button
            const checkoutBtn = document.getElementById('checkout-btn');
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = 'Finalizar Pedido';
        }
    });
    
    async function fetchPacienteEstadia(pacienteId) {
        try {
            const response = await fetch(`${API_URL}/api/pacientes/obter-estadia/${pacienteId}`, {
                headers: { 'Accept': 'application/json' },
                mode: 'cors'
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    showToast('Não foi encontrada uma estadia ativa para este paciente', 'error');
                    return null;
                }
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching estadia:', error);
            showToast('Erro ao obter informações da estadia', 'error');
            return null;
        }
    }
    
    async function submitOrder(orderData) {
        try {
            console.log(orderData);
            
            const response = await fetch(`${API_URL}/api/pedidos/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(orderData)
            });
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error submitting order:', error);
            throw error;
        }
    }
    
    async function submitOrderItem(orderItemData) {
        try {
            const response = await fetch(`${API_URL}/api/produto-pedidos/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(orderItemData)
            });
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error submitting order item:', error);
            throw error;
        }
    }
    
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
    
    function calculateTotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    


});