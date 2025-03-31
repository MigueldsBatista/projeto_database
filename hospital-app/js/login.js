document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const cpf = document.getElementById('cpf').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (cpf && password) {
        // Store user in localStorage
        const user = {
            id: 1,
            name: 'Maria Silva',
            room: '302'
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        showToast('Por favor, preencha todos os campos', 'error');
    }
});