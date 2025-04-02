document.addEventListener('DOMContentLoaded', function() {
    // Sample invoice data if none exists
    const invoiceData = {
        total: 320.50,
        status: 'pending',
        date: new Date(),
        items: [
            {
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                items: [
                    { name: 'Café da manhã', quantity: 1, price: 18.90 },
                    { name: 'Almoço', quantity: 1, price: 32.90 },
                    { name: 'Jantar', quantity: 1, price: 28.50 },
                    { name: 'Água Mineral', quantity: 3, price: 3.50 }
                ]
            },
            {
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                items: [
                    { name: 'Café da manhã', quantity: 1, price: 18.90 },
                    { name: 'Almoço', quantity: 1, price: 32.90 },
                    { name: 'Jantar', quantity: 1, price: 28.50 },
                    { name: 'Suco Natural', quantity: 2, price: 7.90 },
                    { name: 'Kit Higiene', quantity: 1, price: 18.50 }
                ]
            },
            {
                date: new Date(), // Today
                items: [
                    { name: 'Café da manhã', quantity: 1, price: 18.90 },
                    { name: 'Almoço', quantity: 1, price: 32.90 },
                    { name: 'Água Mineral', quantity: 2, price: 3.50 }
                ]
            }
        ]
    };
    
    // Update user info from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Maria Silva', room: '302' };
    document.getElementById('patient-name').textContent = user.name;
    document.getElementById('patient-room').textContent = user.room;
    
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    
    // Update invoice details
    document.getElementById('invoice-date').textContent = formatDate(invoiceData.date);
    document.getElementById('invoice-total-value').textContent = formatCurrency(invoiceData.total);
    document.getElementById('patient-admission-date').textContent = formatDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)); // 3 days ago
    
    // Generate invoice items
    renderInvoiceItems(invoiceData.items);
    
    // Add event listeners
    document.getElementById('download-invoice-btn').addEventListener('click', function() {
        showToast('Preparando download da fatura...', 'info');
        setTimeout(() => {
            showToast('Fatura enviada para seu email', 'success');
        }, 2000);
    });
    
    document.getElementById('download-pdf-btn').addEventListener('click', function() {
        showToast('Gerando PDF da fatura...', 'info');
        setTimeout(() => {
            showToast('PDF enviado para seu email', 'success');
        }, 2000);
    });
    
    document.getElementById('help-btn').addEventListener('click', function() {
        showToast('Conectando ao suporte...', 'info');
        setTimeout(() => {
            alert('Para qualquer dúvida sobre sua fatura, por favor entre em contato com a equipe de atendimento ao cliente do Hospital Santa Joana pelo telefone (81) 3216-5555.');
        }, 1000);
    });
    
    function renderInvoiceItems(days) {
        const container = document.getElementById('invoice-items-container');
        container.innerHTML = '';
        
        days.forEach(day => {
            const dayTotal = day.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            const dayGroup = document.createElement('div');
            dayGroup.className = 'invoice-day-group';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'invoice-day-header';
            dayHeader.textContent = formatDate(new Date(day.date));
            
            dayGroup.appendChild(dayHeader);
            
            // Add each item
            day.items.forEach(item => {
                const invoiceItem = document.createElement('div');
                invoiceItem.className = 'invoice-item';
                invoiceItem.innerHTML = `
                    <span class="invoice-item-name">${item.name}</span>
                    <span class="invoice-item-quantity">x${item.quantity}</span>
                    <span class="invoice-item-price">R$ ${formatCurrency(item.price * item.quantity)}</span>
                `;
                
                dayGroup.appendChild(invoiceItem);
            });
            
            // Add day total
            const dayTotalElement = document.createElement('div');
            dayTotalElement.className = 'invoice-day-total';
            dayTotalElement.innerHTML = `
                <span>Total do dia</span>
                <span>R$ ${formatCurrency(dayTotal)}</span>
            `;
            
            dayGroup.appendChild(dayTotalElement);
            container.appendChild(dayGroup);
        });
    }
    
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('pt-BR', options);
    }
    
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