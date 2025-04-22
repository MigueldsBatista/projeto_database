document.addEventListener('DOMContentLoaded', function() {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || null;
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    console.log('User data:', user);
    

    // Update profile information in UI
    document.getElementById('profile-name').textContent = user.name || 'Nome Indisponível';
    document.getElementById('profile-email').textContent = user.email || 'Email Indisponível';
    
    // Fetch patient data including contact info and room info
    fetchPatientData(user.id);
    
    setupUserInitials(user);
    setupProfilePicture(user);
    setupProfilePictureUpload(user);
    setupEditProfileFunctionality(user);
    setupChangePasswordFunctionality(user);
    setupLogoutButton();
    setupDeleteAccountButton(user);  // Add this line
    
    // Update cart badge
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
});

function setupUserInitials(user) {
    const userInitials = document.getElementById('profile-initials');
    if (!userInitials || !user.name) return;
    
    const nameParts = user.name.split(' ');
    const initials = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
        : nameParts[0].substring(0, 2).toUpperCase();
    
    userInitials.textContent = initials;
}

function setupProfilePicture(user) {
    const profilePicture = user.profilePicture || localStorage.getItem('profileImage');
    const profilePictureContainer = document.getElementById('profile-picture-container');
    
    if (!profilePicture || !profilePictureContainer) return;
    
    // Hide initials when profile picture is displayed
    const initialsElement = document.getElementById('profile-initials');
    if (initialsElement) {
        initialsElement.style.display = 'none';
    }
    
    // Set or update the profile image
    let imgElement = profilePictureContainer.querySelector('img');
    if (!imgElement) {
        imgElement = document.createElement('img');
        imgElement.alt = 'Profile Picture';
        profilePictureContainer.appendChild(imgElement);
    }
    imgElement.src = profilePicture;
}

function setupProfilePictureUpload(user) {
    const editPictureBtn = document.getElementById('edit-picture-btn');
    const fileInput = document.getElementById('profile-picture-input');
    
    if (!editPictureBtn || !fileInput) return;
    
    editPictureBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', async function(e) {
        if (!e.target.files || !e.target.files[0]) return;
        
        const file = e.target.files[0];
        
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showToast('A imagem deve ter no máximo 2MB', 'error');
            return;
        }
        
        // Read file as data URL (base64)
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const base64String = e.target.result;
                updateProfilePictureUI(base64String);
                await saveProfilePicture(user, base64String);
            } catch (error) {
                console.error('Error updating profile picture:', error);
                showToast('Erro ao atualizar foto de perfil', 'error');
            }
        };
        reader.readAsDataURL(file);
    });
}

function updateProfilePictureUI(base64String) {
    const profilePictureContainer = document.getElementById('profile-picture-container');
    if (!profilePictureContainer) return;
    
    // Hide initials when profile picture is displayed
    const initialsElement = document.getElementById('profile-initials');
    if (initialsElement) {
        initialsElement.style.display = 'none';
    }
    
    // Set or update the profile image
    let imgElement = profilePictureContainer.querySelector('img');
    if (!imgElement) {
        imgElement = document.createElement('img');
        imgElement.alt = 'Profile Picture';
        profilePictureContainer.appendChild(imgElement);
    }
    imgElement.src = base64String;
}

async function saveProfilePicture(user, base64String) {
    showToast('Atualizando foto de perfil...', 'info');
    
    // Send to backend based on user role
    const endpoint = user.role === 'camareira' 
        ? `/api/auth/camareiras/profile-picture/${user.id}`
        : `/api/auth/pacientes/profile-picture/${user.id}`;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profilePicture: base64String }),
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.authenticated) {
        showToast('Erro ao atualizar foto de perfil', 'error');
        return;
    }
    
    // Update local storage
    localStorage.setItem('profileImage', base64String);
    
    // Update user object
    user.profilePicture = base64String;
    user.email = result.email;
    localStorage.setItem('user', JSON.stringify(user));
    
    showToast('Foto de perfil atualizada com sucesso!', 'success');
}

async function fetchPatientData(patientId) {
    try {
        const response = await fetch(`${API_URL}/api/pacientes/${patientId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!response.ok) return;
        
        const patient = await response.json();
        
        // Display patient data in view mode
        displayPatientData(patient);
        
        // Fill edit form values
        prefillEditForm(patient);
        
        // After getting patient data, fetch their estadia to get room info
        fetchEstadiaAndRoom(patient.id);
        
    } catch (error) {
        console.error('Error fetching patient data:', error);
    }
}

function displayPatientData(patient) {
    // Format CPF with dots and dash
    const cpf = patient.cpf;
    const formattedCpf = cpf ? 
        `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}` : 
        'Não disponível';
    
    document.getElementById('view-cpf').textContent = formattedCpf;
    
    // Format birth date
    const birthDate = patient.dataNascimento;
    const formattedBirthDate = birthDate ? 
        formatDate(new Date(birthDate)) : 
        'Não disponível';
    
    document.getElementById('view-birth-date').textContent = formattedBirthDate;
    
    // Format phone with parentheses, space and dash
    const phone = patient.telefone;
    let formattedPhone = 'Não disponível';
    if (phone && phone.length >= 10) {
        formattedPhone = `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    } else if (phone) {
        formattedPhone = phone;
    }
    
    document.getElementById('view-phone').textContent = formattedPhone;
    
    // Address
    document.getElementById('view-address').textContent = patient.endereco || 'Não disponível';
}

function prefillEditForm(patient) {
    // Fill phone input
    const phoneInput = document.getElementById('edit-phone');
    if (phoneInput && patient.telefone) {
        phoneInput.value = patient.telefone;
    }
    
    // Fill address input
    const addressInput = document.getElementById('edit-address');
    if (addressInput && patient.endereco) {
        addressInput.value = patient.endereco;
    }
}

function setupEditProfileFunctionality(user) {
    const editBtn = document.getElementById('edit-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const viewMode = document.getElementById('profile-view-mode');
    const editMode = document.getElementById('profile-edit-mode');
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            viewMode.style.display = 'none';
            editMode.style.display = 'block';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            viewMode.style.display = 'block';
            editMode.style.display = 'none';
        });
    }
    
    const profileForm = document.getElementById('profile-edit-mode');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const telefone = document.getElementById('edit-phone').value.replace(/\D/g, '');
            const endereco = document.getElementById('edit-address').value;
            
            try {
                showToast('Atualizando seus dados...', 'info');
                
                const response = await fetch(`${API_URL}/api/pacientes/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        id: user.id,
                        nome: user.name,
                        email: user.email,
                        telefone: telefone,
                        endereco: endereco
                    }),
                });
                
                if (response.ok) {

                    const updatedPatient = await response.json();
                    console.log('Updated patient:', updatedPatient);
                    
                    // Update the view mode display
                    displayPatientData(updatedPatient);
                    
                    // Switch back to view mode
                    viewMode.style.display = 'block';
                    editMode.style.display = 'none';
                    
                    showToast('Informações atualizadas com sucesso!', 'success');
                } else {
                    const error = await response.json();
                    showToast(error.message || 'Erro ao atualizar informações', 'error');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                showToast('Erro ao atualizar informações', 'error');
            }
        });
    }
    
    // Add mask to phone input
    const phoneInput = document.getElementById('edit-phone');
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

function setupChangePasswordFunctionality(user) {
    const changeBtn = document.getElementById('change-password-btn');
    const cancelBtn = document.getElementById('cancel-password-btn');
    const passwordForm = document.getElementById('password-change-form');
    
    if (changeBtn && passwordForm) {
        changeBtn.addEventListener('click', function() {
            passwordForm.style.display = 'block';
        });
    }
    
    if (cancelBtn && passwordForm) {
        cancelBtn.addEventListener('click', function() {
            passwordForm.style.display = 'none';
            passwordForm.reset();
        });
    }
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (newPassword !== confirmPassword) {
                showToast('As novas senhas não coincidem', 'error');
                return;
            }
            
            try {
                showToast('Atualizando senha...', 'info');
                
                const response = await fetch(`${API_URL}/api/auth/pacientes/update/password`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        id: user.id,
                        senhaAtual: currentPassword,
                        novaSenha: newPassword
                    }),
                });
                
                if (response.status === 204) {
                    // Reset the form and hide it
                    passwordForm.reset();
                    passwordForm.style.display = 'none';
                    
                    showToast('Senha atualizada com sucesso!', 'success');
                } else {
                    const error = await response.json();
                    showToast(error.message || 'Erro ao atualizar senha', 'error');
                }
            } catch (error) {
                console.error('Error updating password:', error);
                showToast('Erro ao atualizar senha', 'error');
            }
        });
    }
}

async function fetchEstadiaAndRoom(patientId) {
    try {
        const estadiaResponse = await fetch(`${API_URL}/api/pacientes/estadia-ativa/${patientId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!estadiaResponse.ok) return;
        
        const estadia = await estadiaResponse.json();
        if (!estadia || !estadia.quartoId) return;
        
        const roomResponse = await fetch(`${API_URL}/api/quartos/${estadia.quartoId}`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!roomResponse.ok) return;
        
        const room = await roomResponse.json();
        
        // Update room display
        const profileRoomElement = document.getElementById('profile-room');
        if (profileRoomElement && room) {
            profileRoomElement.textContent = `Quarto ${room.numero}`;
        }
    } catch (error) {
        console.error('Error fetching estadia/room data:', error);
    }
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', function() {
        if (!confirm('Tem certeza que deseja sair?')) return;
        
        // Clear user data
        localStorage.removeItem('user');
        localStorage.removeItem('profileImage');
        
        // Redirect to login
        window.location.href = 'login.html';
    });
}

// Add the new function for delete account functionality
function setupDeleteAccountButton(user) {
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (!deleteAccountBtn) return;
    
    deleteAccountBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Show confirmation dialog with warning
        const isConfirmed = confirm('ATENÇÃO: Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente. Deseja realmente excluir sua conta?');
        
        if (!isConfirmed) return;
        
        try {
            showToast('Excluindo conta...', 'info');
            
            const response = await fetch(`${API_URL}/api/pacientes/delete/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                showToast('Conta excluída com sucesso', 'success');
                
                // Clear all user data from localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('profileImage');
                localStorage.removeItem('cart');
                localStorage.removeItem('pacienteId');
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                const errorData = await response.json().catch(() => ({}));
                showToast(errorData.message || 'Erro ao excluir conta', 'error');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            showToast('Erro ao excluir conta. Por favor, tente novamente mais tarde.', 'error');
        }
    });
}

