const API_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Get or set patient ID from localStorage 
        const storedPacienteId = localStorage.getItem('pacienteId');
        
        const pacienteId = storedPacienteId ? parseInt(storedPacienteId) : 1;
        
        // Fetch patient data
        const paciente = await fetchPaciente(pacienteId);
        if (!paciente) throw new Error('Failed to load patient data');
        
        // Store patient ID for other pages
        localStorage.setItem('pacienteId', paciente.id);
        
        // Fetch related data
        const estadia = await fetchPacienteEstadia(paciente.id);
        const quarto = estadia ? await fetchQuarto(estadia.quartoId) : null;
        const fatura = await fetchPacienteFatura(paciente.id);

        if (!fatura) throw new Error('Failed to load invoice data');

        if (!quarto) {
            throw new Error('Failed to load room data');
        }
    
        console.log(paciente);
        console.log(estadia);
        console.log(fatura);
        // Update UI with basic patient info
        document.getElementById('patient-name').textContent = paciente.nome;
        document.getElementById('room-number').textContent = quarto ? quarto.numero : 'N/A';
        
        // Update dashboard widgets
        updateDashboardSummary(paciente, estadia, fatura);
        
        // Fetch recent orders
        const pedidos = await fetchRecentOrders(paciente.id);
        displayRecentOrders(pedidos);
        
        // Update cart badge
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        
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
        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
        return await response.json();
    } catch (error) {
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
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        const statusClass = getStatusClass(order.status);
        
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-date">${formatDateTime(new Date(order.dataPedido))}</span>
                <span class="status-badge ${statusClass}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-footer">
                <a href="order-details.html?id=${encodeURIComponent(order.dataPedido)}" class="btn btn-outline">Ver Detalhes</a>
            </div>
        `;
        
        recentOrdersContainer.appendChild(orderCard);
    });
    
    // Add "View All" button if there are more than 3 orders
    if (orders.length > 3) {
        const viewAllBtn = document.createElement('a');
        viewAllBtn.href = 'orders.html';
        viewAllBtn.className = 'btn btn-text view-all-btn';
        viewAllBtn.textContent = 'Ver todos os pedidos';
        recentOrdersContainer.appendChild(viewAllBtn);
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

function getStatusText(status) {
    const statusMap = {
        'PENDENTE': 'Pendente',
        'EM_PREPARO': 'Em Preparo',
        'ENTREGUE': 'Entregue',
        'CANCELADO': 'Cancelado'
    };
    
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const classMap = {
        'PENDENTE': 'status-warning',
        'EM_PREPARO': 'status-info',
        'ENTREGUE': 'status-success',
        'CANCELADO': 'status-danger'
    };
    
    return classMap[status] || 'status-default';
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



