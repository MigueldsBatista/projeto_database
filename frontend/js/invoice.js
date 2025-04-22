document.addEventListener('DOMContentLoaded', async function() {
    const API_URL = 'http://localhost:8080';
    
    try {
        // Retrieve patient ID from localStorage (assuming it's stored during login or dashboard)
        const pacienteId = localStorage.getItem('pacienteId') || 1; // Fallback to ID 1 if none stored
        
        // Step 1: Get patient details
        const paciente = await fetch(`${API_URL}/api/pacientes/${pacienteId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch patient data');
            return response.json();
        });
        
        // Step 2: Get patient's latest estadia (stay)
        const estadia = await fetch(`${API_URL}/api/pacientes/estadia-ativa/${pacienteId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch estadia data');
            return response.json();
        });
        
        // Step 3: Get fatura (invoice) for this estadia
        const fatura = await fetch(`${API_URL}/api/pacientes/fatura-recente/${pacienteId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch invoice data');
            return response.json();
        });
        
        // Step 4: Get room information
        const quarto = await fetch(`${API_URL}/api/quartos/${estadia.quartoId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch room data');
            return response.json();
        });
        
        // Step 5: Get all orders related to this estadia
        const pedidos = await fetch(`${API_URL}/api/estadias/${estadia.id}/pedidos`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch orders data');
            return response.json();
        });
        
        // Step 6: For each order, get its products
        const ordersWithItems = await Promise.all(
            pedidos.map(async (pedido) => {
                const produtos = await fetch(`${API_URL}/api/pedidos/${pedido.id}/produtos`, {
                    headers: { 'Accept': 'application/json' },
                    mode: 'cors'
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch order items');
                    return response.json();
                });
                
                // Group orders by date
                const date = new Date(pedido.dataPedido);
                return {
                    date: date,
                    id: pedido.id,
                    status: pedido.status,
                    items: produtos.map(produto => ({
                        name: produto.nome,
                        quantity: produto.quantidade,
                        price: produto.preco
                    }))
                };
            })
        );
        
        // Group orders by date
        const groupedOrders = ordersWithItems.reduce((groups, order) => {
            const dateStr = formatDate(order.date);
            if (!groups[dateStr]) {
                groups[dateStr] = {
                    date: order.date,
                    items: []
                };
            }
            
            // Add all items from this order to the day's group
            groups[dateStr].items.push(...order.items);
            return groups;
        }, {});
        
        const invoiceItems = Object.values(groupedOrders);
        
        // Update user info in the UI
        document.getElementById('patient-name').textContent = paciente.nome;
        document.getElementById('patient-room').textContent = quarto.numero;
        
        // Update invoice details
        document.getElementById('invoice-date').textContent = formatDate(new Date(fatura.dataEmissao));
        document.getElementById('invoice-total-value').textContent = formatCurrency(fatura.valorTotal);
        document.getElementById('patient-admission-date').textContent = formatDate(new Date(estadia.dataEntrada));
        
        // Generate invoice items
        renderInvoiceItems(invoiceItems);
        
        // Store user in localStorage for reference in other pages
        localStorage.setItem('user', JSON.stringify({
            id: paciente.id,
            name: paciente.nome, 
            room: quarto.numero
        }));
        
        // Get cart count from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
    } catch (error) {
        console.error('Error loading invoice data:', error);
        showToast('Erro ao carregar os dados da fatura', 'error');
        
    }
    
    // Add event listeners
    document.getElementById('download-invoice-btn').addEventListener('click', function() {
        showToast('Preparando download da fatura...', 'info');
        // Here you could implement a real download functionality
        setTimeout(() => {
            showToast('Fatura enviada para seu email', 'success');
        }, 2000);
    });
    
    document.getElementById('download-pdf-btn').addEventListener('click', function() {
        showToast('Gerando PDF da fatura...', 'info');
        // Here you could implement a real PDF generation
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
