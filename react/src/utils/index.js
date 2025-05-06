export function showToast(message, type = 'default', duration = 3000) {
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

export function updateCartBadge(count) {
    const badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

export function formatCurrency(value) {
    return Number(value).toFixed(2).replace('.', ',');
}

export function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export function formatDateTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatRelativeDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
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

export function getStatusText(status) {
    if (!status) return 'Desconhecido';
    
    // Convert to uppercase for case-insensitive comparison
    const upperStatus = status.toUpperCase();
    
    switch(upperStatus) {
        case 'PENDENTE':
        case 'PENDING':
            return 'Pendente';
        case 'EM_PREPARO':
        case 'EM PREPARO':
        case 'IN-PROGRESS':
        case 'IN_PROGRESS':
            return 'Em Preparo';
        case 'ENTREGUE':
        case 'DELIVERED':
            return 'Entregue';
        case 'CANCELADO':
        case 'CANCELLED':
        case 'CANCELED':
            return 'Cancelado';
        default:
            return status;
    }
}

export function getStatusClass(status) {
    if (!status) return 'status-default';
    
    // Convert to uppercase for case-insensitive comparison
    const upperStatus = status.toUpperCase();
    
    switch(upperStatus) {
        case 'PENDENTE':
        case 'PENDING':
            return 'pending';
        case 'EM_PREPARO':
        case 'EM PREPARO':
        case 'IN-PROGRESS':
        case 'IN_PROGRESS':
            return 'in-progress';
        case 'ENTREGUE':
        case 'DELIVERED':
            return 'delivered';
        case 'CANCELADO':
        case 'CANCELLED':
        case 'CANCELED':
            return 'cancelled';
        default:
            return 'status-default';
    }
}

export function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Skip authentication check on auth pages
    const isAuthPage = window.location.pathname.includes('login.html') || 
                       window.location.pathname.includes('register.html');
    
    if (!user && !isAuthPage) {
        window.location.href = 'login.html';
        return null;
    }
    
    return user;
}

function getFormattedOrderId(timestamp) {
    // Extract a shorter, more readable order number from the timestamp
    // Format: last 4 digits of timestamp + first 2 chars of the hour
    const date = new Date(timestamp);
    const lastDigits = timestamp.toString().slice(-4);
    const hourPart = date.getHours().toString().padStart(2, '0');
    const formattedOrderId = `#${lastDigits}${hourPart}`;
    
    return formattedOrderId;
}
