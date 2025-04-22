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
                
                if (!response.ok || response.status !== 201) {
                    // Get error message from API response if available
                    const errorMessage = result.message || 'Erro ao criar conta. Por favor, tente novamente.';
                    showToast(errorMessage, 'error');
                    return;
                }

                const pacienteId = result.id;
                showToast('Conta criada com sucesso!', 'success');
                
                // Check if user already has an active estadia
                try {
                    const estadiaResponse = await fetch(`${API_URL}/api/pacientes/estadia-ativa/${pacienteId}`, {
                        headers: { 'Accept': 'application/json' },
                    });
                    
                    if (estadiaResponse.ok) {
                        // User already has an estadia, redirect to login
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    } else {
                        // Ask if user wants to create an estadia
                        showEstadiaPrompt(pacienteId);
                    }
                } catch (estadiaError) {
                    console.error('Error checking estadia:', estadiaError);
                    // Default to login redirect if there's an error
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
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
    }
    
    function showEstadiaPrompt(pacienteId) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <h2>Bem-vindo ao Hospital Santa Joana!</h2>
            <p>Sua conta foi criada com sucesso.</p>
            <p>Deseja iniciar uma internação hospitalar?</p>
            <div class="modal-actions">
                <button id="btn-skip-estadia" class="btn-secondary">Não, apenas entrar</button>
                <button id="btn-create-estadia" class="btn-primary">Sim, iniciar internação</button>
            </div>
        `;
        
        // Add modal to overlay
        overlay.appendChild(modal);
        
        // Add overlay to body
        document.body.appendChild(overlay);
        
        // Handle skip estadia
        document.getElementById('btn-skip-estadia').addEventListener('click', function() {
            overlay.remove();
            redirectToLogin();
        });
        
        // Handle create estadia
        document.getElementById('btn-create-estadia').addEventListener('click', async function() {
            try {
                this.disabled = true;
                this.textContent = 'Processando...';
                
                const estadiaResponse = await fetch(`${API_URL}/api/pacientes/create-estadia/${pacienteId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (estadiaResponse.ok) {
                    showToast('Internação iniciada com sucesso!', 'success');
                } else {
                    // Handle estadia creation error specifically
                    const errorData = await estadiaResponse.json().catch(() => ({}));
                    let errorMessage = errorData.message || 'Não foi possível iniciar a internação';
                    
                    // Map specific error messages
                    if (errorMessage.includes('não existem quartos disponiveis')) {
                        errorMessage = 'Não há quartos disponíveis no momento. Por favor, entre em contato com a recepção.';
                    }
                    
                    showToast(errorMessage, 'error');
                }
                
                overlay.remove();
                redirectToLogin();
                
            } catch (error) {
                console.error('Error creating estadia:', error);
                showToast('Erro ao iniciar internação. Por favor, tente novamente mais tarde ou entre em contato com a recepção.', 'error');
                overlay.remove();
                redirectToLogin();
            }
        });
    }
    
    async function checkExistingEstadia(pacienteId) {
        try {
            const response = await fetch(`${API_URL}/api/pacientes/estadia-ativa/${pacienteId}`, {
                headers: { 'Accept': 'application/json' },
            });
            
            if (response.ok) {
                const estadia = await response.json();
                return !!estadia; // Return true if estadia exists
            }
            
            return false;
        } catch (error) {
            console.error('Error checking for existing estadia:', error);
            return false;
        }
    }

    function showEstadiaConfirmation(pacienteId) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <h2>Bem-vindo ao Hospital Santa Joana!</h2>
            <p>Sua conta foi criada com sucesso.</p>
            <p>Deseja iniciar uma internação no hospital agora?</p>
            <div class="modal-actions">
                <button id="btn-skip-estadia" class="btn-secondary">Não, apenas entrar</button>
                <button id="btn-create-estadia" class="btn-primary">Sim, iniciar internação</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        
        document.body.appendChild(overlay);
        
        document.getElementById('btn-skip-estadia').addEventListener('click', function() {
            overlay.remove();
            redirectToLogin();
        });
        
        document.getElementById('btn-create-estadia').addEventListener('click', async function() {
            try {
                this.disabled = true;
                this.textContent = 'Processando...';
                
                const estadiaResponse = await fetch(`${API_URL}/api/pacientes/create-estadia/${pacienteId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                overlay.remove();
                
                if (estadiaResponse.ok) {
                    showToast('Internação iniciada com sucesso!', 'success');
                } else {
                    showToast('Não foi possível iniciar a internação.', 'error');
                }
                
                redirectToLogin();
                
            } catch (error) {
                console.error('Error creating estadia:', error);
                showToast('Erro ao iniciar internação. Por favor, tente novamente mais tarde.', 'error');
                overlay.remove();
                redirectToLogin();
            }
        });
    }

    function redirectToLogin() {
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
    
});

