document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', handleLogin);
    
    // Change page title based on URL parameter
    setupPageTitle();
});

/**
 * Handle login form submission
 * @param {Event} e - Form submission event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Simple validation
    if (!email || !password) {
        showToast('Por favor, preencha todos os campos', 'error');
        showLoginError(errorMessage, 'Por favor, preencha todos os campos');
        return;
    }
    
    try {
        showToast('Autenticando...', 'info');
        
        // First try patient login
        const patientResponse = await fetch(`${API_URL}/api/auth/pacientes/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha: password }),
        });
        
        let userData = await patientResponse.json();
        
        // If patient login failed, try staff login
        if (!userData.authenticated && patientResponse.status === 401) {
            userData = await tryStaffLogin(email, password);
        }
        
        if (!userData.authenticated) {
            showLoginError(errorMessage, 'Email ou senha incorretos');
            return;
        }
        
        // Login successful
        handleSuccessfulLogin(userData);
        
    } catch (error) {
        console.error('Error during login:', error);
        showToast('Erro ao fazer login. Por favor, tente novamente.', 'error');
        showLoginError(errorMessage, 'Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
}

/**
 * Try to authenticate as staff member
 * @param {string} email - Staff email
 * @param {string} password - Staff password
 * @returns {Object} Authentication response
 */
async function tryStaffLogin(email, password) {
    const staffResponse = await fetch(`${API_URL}/api/auth/camareiras/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }),
    });
    
    return await staffResponse.json();
}

/**
 * Display login error in the UI
 * @param {HTMLElement} errorMessageElement - The error container
 * @param {string} message - The error message to show
 */
function showLoginError(errorMessageElement, message) {
    // If there's an error element in the form, use it
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
        return;
    }
    
    // Otherwise, create a new error element
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.marginTop = '10px';
    errorDiv.style.textAlign = 'center';
    
    // Find the submit button and insert the error message before it
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        loginForm.insertBefore(errorDiv, submitBtn);
    } else {
        loginForm.appendChild(errorDiv);
    }
}

/**
 * Handle successful login
 * @param {Object} userData - The authenticated user data
 */
async function handleSuccessfulLogin(userData) {
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Store profile picture if available
    if (userData.profilePicture) {
        localStorage.setItem('profileImage', userData.profilePicture);
    }
    
    showToast('Login realizado com sucesso!', 'success');
    
    // If user is a patient, check for active estadia
    if (userData.role !== 'camareira') {
        try {
            // Check if user has an active estadia
            const estadiaResponse = await fetch(`${API_URL}/api/pacientes/estadia-ativa/${userData.id}`, {
                headers: { 'Accept': 'application/json' },
            });
            
            if (!estadiaResponse.ok) {
                // No active estadia found, show estadia prompt
                setTimeout(() => {
                    showEstadiaPrompt(userData.id);
                }, 1000);
                return; // Exit function early to prevent immediate redirect
            }
        } catch (error) {
            console.error('Error checking estadia:', error);
            // Continue with normal login flow on error
        }
    }
    
    // Redirect based on user role (only if we didn't show estadia prompt)
    const redirectUrl = userData.role === 'camareira' ? 'staff-dashboard.html' : 'dashboard.html';
    setTimeout(() => { window.location.href = redirectUrl; }, 1000);
}

/**
 * Show prompt asking if user wants to create an estadia
 * @param {number} pacienteId - ID of the patient
 */
function showEstadiaPrompt(pacienteId) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <h2>Bem-vindo ao Hospital Santa Joana!</h2>
        <p>Você não possui uma internação ativa no momento.</p>
        <p>Deseja iniciar uma internação hospitalar?</p>
        <div class="modal-actions">
            <button id="btn-skip-estadia" class="btn-secondary">Não, continuar sem internação</button>
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
        redirectToDashboard();
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
                overlay.remove();
                redirectToDashboard();
            } else {
                // Handle estadia creation error specifically
                const errorData = await estadiaResponse.json().catch(() => ({}));
                let errorMessage = errorData.message || 'Não foi possível iniciar a internação';
                
                // Map specific error messages
                if (errorMessage.includes('não existem quartos disponiveis')) {
                    errorMessage = 'Não há quartos disponíveis no momento. Por favor, entre em contato com a recepção.';
                }
                
                showToast(errorMessage, 'error');
                // Even with error, we should allow the user to continue
                setTimeout(() => {
                    overlay.remove();
                    redirectToDashboard();
                }, 3000);
            }
        } catch (error) {
            console.error('Error creating estadia:', error);
            showToast('Erro ao iniciar internação. Por favor, tente novamente mais tarde ou entre em contato com a recepção.', 'error');
            setTimeout(() => {
                overlay.remove();
                redirectToDashboard();
            }, 3000);
        }
    });
}

/**
 * Redirect to dashboard
 */
function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

/**
 * Setup page title based on URL parameters
 */
function setupPageTitle() {
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('type');
    const pageTitle = document.querySelector('.login-container h1');
    const loginForm = document.getElementById('login-form');
    
    if (!pageTitle || userType !== 'staff') return;
    
    pageTitle.textContent = 'Login Funcionário';
    document.title = 'Santa Joana - Login Funcionário';
    
    if (loginForm) {
        loginForm.dataset.userType = 'staff';
    }
}