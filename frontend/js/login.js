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
function handleSuccessfulLogin(userData) {
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Store profile picture if available
    if (userData.profilePicture) {
        localStorage.setItem('profileImage', userData.profilePicture);
    }
    
    showToast('Login realizado com sucesso!', 'success');
    
    // Redirect based on user role
    const redirectUrl = userData.role === 'camareira' ? 'staff-dashboard.html' : 'dashboard.html';
    setTimeout(() => { window.location.href = redirectUrl; }, 1000);
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