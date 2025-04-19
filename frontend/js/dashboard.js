document.addEventListener('DOMContentLoaded', async function() {
    try {

        const user = JSON.parse(localStorage.getItem('user')) || null;
        

        if (!user) throw new Error('Failed to load patient data');
        
        // Store patient ID for other pages
        localStorage.setItem('pacienteId', user.id);
        
        // Fetch related data
        const estadia = await fetchPacienteEstadia(user.id);
        const quarto = estadia ? await fetchQuarto(estadia.quartoId) : null;
        const fatura = await fetchPacienteFatura(user.id);

        if (!fatura) throw new Error('Failed to load invoice data');

        if (!quarto) {
            throw new Error('Failed to load room data');
        }
    
        console.log(user);
        console.log(estadia);
        console.log(fatura);

        // Update UI with basic patient info
        document.getElementById('patient-name').textContent = user.name;
        document.getElementById('room-number').textContent = quarto ? quarto.numero : 'N/A';
        
        // Update dashboard widgets
        updateDashboardSummary(user, estadia, fatura);
        
        // Fetch recent orders
        const pedidos = await fetchRecentOrders(user.id);

        // Process orders and fetch product details for each
        const enhancedPedidos = [];
        
        for (const pedido of pedidos) {
            // Fetch products for this order
            const produtos = await fetchProdutosFromPedido(pedido.dataPedido);
            
            // Create enhanced order with details
            const enhancedPedido = {
            ...pedido,
            // Format details as product names separated by commas
            detalhes: produtos && produtos.length > 0 
                ? produtos.map(p => p.nome).join(', ')
                : 'Sem produtos',
            // Calculate or use the total value from products if available
            valor: produtos && produtos.length > 0
                ? produtos.reduce((total, p) => total + (p.preco * p.quantidade), 0)
                : pedido.valor || 0
            };
            
            enhancedPedidos.push(enhancedPedido);
        }
        
        // Display the enhanced orders
        displayRecentOrders(enhancedPedidos);
        
        // Update cart badge
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Setup user profile avatar
        setupUserAvatar(user.name);
        
        // Add event listeners for logout
        setupLogoutButton();
        
        // Add event listeners for quick actions
        setupQuickActions();
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showToast('Erro ao carregar informações do dashboard', 'error');
    }
});

// Fetch Functions
const fetchPaciente = async (pacienteId) => {
    try {
        const response = await fetch(`${API_URL}/api/pacientes/${pacienteId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching patient data:', error);
        showToast('Não foi possível obter dados do paciente', 'error');
        return null;
    }
};

const fetchPacienteEstadia = async (pacienteId) => {
    try {
        const response = await fetch(`${API_URL}/api/pacientes/estadia-recente/${pacienteId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('No active estadia found for patient');
                return null;
            }
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching estadia data:', error);
        showToast('Não foi possível obter dados da estadia', 'error');
        return null;
    }
};

const fetchPacienteFatura = async (pacienteId) => {
    try {
        const response = await fetch(`${API_URL}/api/pacientes/fatura-recente/${pacienteId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('No invoice found for patient');
                return null;
            }
            
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching invoice data:', error);
        showToast('Não foi possível obter dados da fatura', 'error');
        return null;
    }
};


const fetchProdutosFromPedido = async (dataPedido) => {
    try {
        const response = await fetch(`${API_URL}/api/pedidos/${dataPedido}/produtos`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) {
            if (response.status != 200) {
                return null;
            }
            
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error('Error fetching invoice data:', error);
        showToast('Não foi possível obter dados dos produtos', 'error');
        return null;
    }
};

const fetchQuarto = async (quartoId) => {
    if (!quartoId) return null;
    
    try {
        const response = await fetch(`${API_URL}/api/quartos/${quartoId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching room data:', error);
        showToast('Não foi possível obter dados do quarto', 'error');
        return null;
    }
};

const fetchRecentOrders = async (pacienteId) => {
    try {
        const response = await fetch(`${API_URL}/api/pacientes/${pacienteId}/pedidos`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return await response.json();

    }
    catch (error) {
        console.error('Error fetching recent orders:', error);
        showToast('Não foi possível obter pedidos recentes', 'error');
        return [];
    }

};

// UI Update Functions
function updateDashboardSummary(paciente, estadia, fatura) {
    // Update patient status indicator
    const statusElement = document.getElementById('patient-status');
    if (statusElement) {
        const status = paciente.status;
        statusElement.textContent = status;
        statusElement.className = `status-badge ${status === 'Internado' ? 'status-active' : 'status-inactive'}`;
    }
    
    // Update stay information if available
    if (estadia) {
        const admissionDateElement = document.getElementById('admission-date');
        if (admissionDateElement) {
            admissionDateElement.textContent = formatDate(new Date(estadia.dataEntrada));
        }
        
        const stayDurationElement = document.getElementById('stay-duration');
        if (stayDurationElement) {
            const now = new Date();
            const admissionDate = new Date(estadia.dataEntrada);
            const days = Math.floor((now - admissionDate) / (1000 * 60 * 60 * 24));
            stayDurationElement.textContent = `${days} dia${days !== 1 ? 's' : ''}`;
        }
    }
    
    // Update invoice information if available
    if (fatura) {
        const invoiceStatusElement = document.getElementById('invoice-status');
        if (invoiceStatusElement) {
            const status = fatura.statusPagamento;
            invoiceStatusElement.textContent = status;
            invoiceStatusElement.className = `status-badge ${status === 'Pendente' ? 'status-warning' : 'status-success'}`;
        }
        
        const invoiceTotalElement = document.getElementById('invoice-total-value');
        if (invoiceTotalElement) {
            invoiceTotalElement.textContent = `R$ ${formatCurrency(fatura.valorTotal || 0)}`;
        }
    }
}

function displayRecentOrders(orders, products) {
    const recentOrdersContainer = document.getElementById('recent-orders');
    
    if (!recentOrdersContainer) return;
    
    recentOrdersContainer.innerHTML = '';
    
    if (!orders || orders.length === 0) {
        recentOrdersContainer.innerHTML = '<div class="empty-state">Nenhum pedido recente</div>';
        return;
    }


    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.dataPedido) - new Date(a.dataPedido));
    
    // Take only the 3 most recent orders
    const recentOrders = orders.slice(0, 3);
    
    recentOrders.forEach(order => {
        // Create order card with same structure as orders.js
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.setAttribute('data-id', order.id || order.dataPedido);
        
        // Use the standardized status functions from app.js
        const statusClass = getStatusClass(order.status);
        console.log(statusClass);
        
        const statusText = getStatusText(order.status);
        
        // Create the card with the same structure as orders.js
        orderCard.innerHTML = `
            <div class="order-info">
                <p class="order-date">${formatDate(new Date(order.dataPedido))}</p>
                <p class="order-items">
                    ${order.detalhes || 'Detalhes não disponíveis'}
                </p>
                <p class="order-price">R$ ${formatCurrency(order.valor || 0)}</p>
            </div>
            <div class="order-status">
                <span class="status-pill ${statusClass}">${statusText}</span>
            </div>
        `;
        
        recentOrdersContainer.appendChild(orderCard);
        
        // Add click event to view order details
        orderCard.addEventListener('click', function() {
            window.location.href = `order-details.html?id=${order.id || order.dataPedido}`;
        });
    });
    
    // Add "View All" button if there are more than 3 orders
    if (orders.length > 3) {
        const viewAllBtn = document.createElement('a');
        viewAllBtn.href = 'orders.html';
        viewAllBtn.className = 'btn-text view-all-btn';
        viewAllBtn.textContent = 'Ver todos os pedidos';
        recentOrdersContainer.appendChild(viewAllBtn);
    }
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

function setupQuickActions() {
    // Add event listeners for quick action buttons
    const newOrderBtn = document.getElementById('new-order-btn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', () => {
            window.location.href = 'menu.html';
        });
    }
    
    const viewInvoiceBtn = document.getElementById('view-invoice-btn');
    if (viewInvoiceBtn) {
        viewInvoiceBtn.addEventListener('click', () => {
            window.location.href = 'invoice.html';
        });
    }
    
    const contactStaffBtn = document.getElementById('contact-staff-btn');
    if (contactStaffBtn) {
        contactStaffBtn.addEventListener('click', () => {
            showToast('Chamando equipe de atendimento...', 'info');
            setTimeout(() => {
                showToast('Sua chamada foi registrada. Um atendente virá em breve.', 'success');
            }, 2000);
        });
    }
}

// Setup User Avatar
function setupUserAvatar(userName) {
    const userAvatar = document.getElementById('profile-avatar');
    const userInitials = document.getElementById('user-initials');
    
    if (userAvatar && userInitials) {
        // Set user initials
        const nameParts = userName.split(' ');
        const initials = nameParts.length > 1 
            ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
            : nameParts[0].substring(0, 2).toUpperCase();
        userInitials.textContent = initials;
        
        // Check if user has a profile image from authentication
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const profileImage = user.profilePicture || localStorage.getItem('profileImage');
        
        if (profileImage) {
            // Remove any existing images
            userAvatar.querySelectorAll('img').forEach(img => img.remove());
            
            // Add new image
            const img = document.createElement('img');
            img.src = profileImage;
            img.alt = 'Profile';
            userAvatar.appendChild(img);
            userInitials.style.display = 'none';
        } else {
            // Ensure initials are shown if no image
            userInitials.style.display = 'flex';
        }
    }
}

// Setup Logout Button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Show confirmation dialog
            if (confirm('Tem certeza que deseja sair?')) {
                // Clear user data (but keep cart and orders)
                localStorage.removeItem('user');
                localStorage.removeItem('profileImage');
                
                // Redirect to login
                window.location.href = 'login.html';
            }
        });
    }
}

// Helper Functions
function updateCartBadge(count) {
    const badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function formatDate(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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



