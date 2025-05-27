document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user')) || null;
        
        if (!user) {
            // If no user data, redirect to login page
            window.location.href = 'html/login.html';
            return;
        }
        
        // Store patient ID for other pages
        localStorage.setItem('pacienteId', user.id);
        
        // Update UI with basic patient info that we already have
        document.getElementById('patient-name').textContent = user.name || 'Nome Indisponível';
        
        // Try to load data from app state first
        if (appState.dataLoaded) {
            updateDashboardFromAppState();
        } else {
            // Listen for user data loaded event
            document.addEventListener('userDataLoaded', updateDashboardFromAppState);
            
            // Show loading indicators
            showLoadingState();
            
            // Trigger data loading if not already in progress
            loadUserData();
        }
        
        // Setup user avatar and event handlers
        setupUserAvatar(user.name);
        setupLogoutButton();
        setupQuickActions();
        
        // Update cart badge
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showToast('Erro ao carregar informações do dashboard', 'error');
    }
});

// Update dashboard UI using data from app state
function updateDashboardFromAppState() {
    const { user, estadia, quarto, fatura, pedidos } = appState.userProfile;
    
    // Update room display
    if (quarto) {
        document.getElementById('room-number').textContent = quarto.numero;
    } else {
        document.getElementById('room-number').textContent = 'N/A';
    }
    
    // Update dashboard widgets
    updateDashboardSummary(appState.user, estadia, fatura);
    
    // Display recent orders
    displayRecentOrders(getRecentOrders(3));
    
    // Hide any loading indicators
    hideLoadingState();
}

// Show loading indicators while data is being fetched
function showLoadingState() {
    const loadingElements = document.querySelectorAll('.loading-placeholder');
    loadingElements.forEach(el => el.style.display = 'block');
}

// Hide loading indicators
function hideLoadingState() {
    const loadingElements = document.querySelectorAll('.loading-placeholder');
    loadingElements.forEach(el => el.style.display = 'none');
}

// UI Update Functions
function updateDashboardSummary(paciente, estadia, fatura) {
    // Update patient status indicator
    const statusElement = document.getElementById('patient-status');
    if (statusElement) {
        const status = paciente.status || 'Status Indisponível';
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
    } else {
        // Handle case where estadia is not available
        const admissionDateElement = document.getElementById('admission-date');
        if (admissionDateElement) {
            admissionDateElement.textContent = 'N/A';
        }
        
        const stayDurationElement = document.getElementById('stay-duration');
        if (stayDurationElement) {
            stayDurationElement.textContent = 'N/A';
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
    } else {
        // Handle case where fatura is not available
        const invoiceStatusElement = document.getElementById('invoice-status');
        if (invoiceStatusElement) {
            invoiceStatusElement.textContent = 'N/A';
            invoiceStatusElement.className = 'status-badge status-default';
        }
        
        const invoiceTotalElement = document.getElementById('invoice-total-value');
        if (invoiceTotalElement) {
            invoiceTotalElement.textContent = 'R$ 0,00';
        }
    }
}

function displayRecentOrders(orders) {
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
                <p class="order-date">${formatRelativeDate(new Date(order.dataPedido))}</p>
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
            window.location.href = `html/order-details.html?id=${order.id || order.dataPedido}`;
        });
    });
    
    // Add "View All" button if there are more than 3 orders
    if (orders.length > 3) {
        const viewAllBtn = document.createElement('a');
        viewAllBtn.href = 'html/orders.html';
        viewAllBtn.className = 'btn-text view-all-btn';
        viewAllBtn.textContent = 'Ver todos os pedidos';
        recentOrdersContainer.appendChild(viewAllBtn);
    }
}

function setupQuickActions() {
    // Add event listeners for quick action buttons
    const newOrderBtn = document.getElementById('new-order-btn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', () => {
            window.location.href = 'html/menu.html';
        });
    }
    
    const viewInvoiceBtn = document.getElementById('view-invoice-btn');
    if (viewInvoiceBtn) {
        viewInvoiceBtn.addEventListener('click', () => {
            window.location.href = 'html/invoice.html';
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
                window.location.href = 'html/login.html';
            }
        });
    }
}







