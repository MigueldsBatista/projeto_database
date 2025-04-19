
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const cpf = document.getElementById('cpf').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const birthDate = document.getElementById('birth-date').value;

            // Simple validation
            if (!name || !cpf || !email || !password || !confirmPassword || !birthDate) {
                showToast('Por favor, preencha todos os campos obrigatórios', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('As senhas não coincidem', 'error');
                return;
            }
            
            try {
                showToast('Criando sua conta...', 'info');
                
                console.log(birthDate);
                
                // Create user object for API
                const userData = {
                    nome: name,
                    cpf: cpf.replace(/\D/g, ''), // Remove non-digits
                    email: email,
                    senha: password,
                    dataNascimento: birthDate,
                    telefone: phone ? phone.replace(/\D/g, '') : null, // Remove non-digits
                    endereco: address || null
                };
                
                // Send registration request to backend API
                const response = await fetch(`${API_URL}/api/pacientes/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
                
                const result = await response.json();
                console.log(result);
                
                if (response.ok) {
                    showToast('Conta criada com sucesso!', 'success');
                    
                    // Redirect to login after a short delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                showToast('Erro ao criar conta. Por favor, tente novamente mais tarde.', 'error');
            }
        });
        
        // Add input masks
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                if (value.length > 9) {
                    value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{3})(\d{3})/, '$1.$2.');
                } else if (value.length > 3) {
                    value = value.replace(/(\d{3})/, '$1.');
                }
                e.target.value = value;
            });
        }
        
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                if (value.length > 10) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{2})(\d{4})/, '($1) $2-');
                } else if (value.length > 2) {
                    value = value.replace(/(\d{2})/, '($1) ');
                }
                e.target.value = value;
            });
        }
        
        const birthDateInput = document.getElementById('birth-date');

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

