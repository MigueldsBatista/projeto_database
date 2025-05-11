import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../services/axios";
import logo from "../../static/img/hsj_logo.png";
import { App } from "../../styles/GlobalStyles";
import {
import { App, PrimaryButton, SecondaryButton } from "../../styles/GlobalStyles";
import {
    ProfileContainer,
    ProfileHeader,
    ProfilePicture,
    ProfileInfo,
    ProfileSection,
    InfoRow,
    EditForm,
    FormGroup,
    ProfileMenu,
    InfoDiv,
    EditFormDiv,
    PersonalizedButton,
    AccountForm,
    AccountForm2,
} from "./styled";
import { showToast } from "../../utils";
import { FaArrowLeft, FaEdit, FaSave, FaSignOutAlt, FaTimes, FaTrash } from "react-icons/fa";
} from "./styled";
import { showToast } from "../../utils";


const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    
    const numericPhone = phone.replace(/\D/g, "");
    
    if (numericPhone.length === 11) {
        return numericPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (numericPhone.length === 10) {
        return numericPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
        return numericPhone;
    }
};

const formatCpf = (cpf) => {
    if (!cpf) return "";
    
    const numericCpf = cpf.replace(/\D/g, "");
    
    if (numericCpf.length > 9) {
        return numericCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (numericCpf.length > 6) {
        return numericCpf.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
    } else if (numericCpf.length > 3) {
        return numericCpf.replace(/(\d{3})(\d{3})/, "$1.$2");
    } else {
        return numericCpf;
    }
};

export default function Profile() {
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [ID, setID] = useState(null);
    const [quarto, setQuarto] = useState(null);
    const [dataEntrada, setDataEntrada] = useState(null);
    const [cpf, setCpf] = useState(null);

    const fetchEstadiaData = async (pacienteId) => {
        try {
            const response = await axios.get(`/api/pacientes/estadia-ativa/${pacienteId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching estadia data:', error);
            showToast('Não foi possível carregar os dados da estadia', 'error');
            return {};
        }
    };

    const fetchQuartoData = async (quartoId) => {
        if (!quartoId) return {};
        try {
            const response = await axios.get(`/api/quartos/${quartoId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching quarto data:', error);
            showToast('Não foi possível carregar os dados do quarto', 'error');
            return {};
        }
    };

    const loadUserData = async (userId) => {
        try {
            const estadia = await fetchEstadiaData(userId);
            if (estadia && estadia.quartoId) {
                const quarto = await fetchQuartoData(estadia.quartoId);
                if (quarto) {
                    setQuarto(quarto.numero);
                }
                if (estadia.dataEntrada) {
                    setDataEntrada(new Date(estadia.dataEntrada).toLocaleDateString('pt-BR'));
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            showToast('Erro ao carregar informações do Perfil', 'error');
        }
    };
  
    useEffect(() => {

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            history.push("/");
            return;
        }
        setUser(storedUser);
        setName(storedUser.name);
        setEmail(storedUser.email);
        setCpf(formatCpf(storedUser.cpf));
        setPhone(formatPhoneNumber(storedUser.telefone));
        setAddress(storedUser.endereco);
        
        loadUserData(storedUser.id);
        
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/pacientes/${storedUser.id}`);
                let userData = response.data;
                
                if (!userData.name) {
                    userData = { ...userData, name: storedUser.name };
                }
                if (!userData.email) {
                    userData = { ...userData, email: storedUser.email };
                }
                
                setUser(userData);
                setID(userData.id);
                setName(userData.name);
                setEmail(userData.email);
                setCpf(formatCpf(userData.cpf));
                setPhone(formatPhoneNumber(userData.telefone));
                setAddress(userData.endereco);

        setPhone(formatPhoneNumber(storedUser.telefone));
        setAddress(storedUser.endereco);
        
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/pacientes/${storedUser.id}`);
                const userData = response.data;
                setUser(userData);
                setPhone(formatPhoneNumber(userData.telefone));
                setAddress(userData.endereco);

                localStorage.setItem("user", JSON.stringify(userData));
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        };
        
        fetchUserData();
    }, [history]);

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{4})/, "($1) $2-");
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})/, "($1) ");
        }
        setPhone(value);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            showToast("Atualizando informações...", "info");

            const phoneNumeric = phone.replace(/\D/g, "");
            const response = await axios.put(`/api/pacientes/update`, {
                id: user.id,
                telefone: phoneNumeric,
                endereco: address,
            });
            const updatedUser = response.data;
            
            updatedUser.telefone = phoneNumeric;
            
            updatedUser.name = name;
            updatedUser.email = email;
            
            setUser(updatedUser);
            
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            showToast("Informações atualizadas com sucesso!", "success");

            updatedUser.telefone = phoneNumeric;
            
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            showToast("Informações atualizadas com sucesso!", "success");
 
            setPhone(formatPhoneNumber(phoneNumeric));
            setEditMode(false);
        } catch (error) {
            console.error("Erro ao atualizar informações:", error);
            showToast("Erro ao atualizar informações. Tente novamente mais tarde.", "error");
        }
    };

    const handleLogout = () => {
        if (window.confirm("Tem certeza que deseja sair?")) {
            localStorage.removeItem("user");
            localStorage.removeItem("profileImage");
            history.push("/");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("ATENÇÃO: Esta ação é irreversível. Deseja realmente excluir sua conta?")) {
            return;
        }
        try {
            showToast("Excluindo conta...", "info");
            await axios.delete(`/api/pacientes/delete/${user.id}`);
            localStorage.clear();
            showToast("Conta excluída com sucesso!", "success");
            history.push("/");
        } catch (error) {
            console.error("Erro ao excluir conta:", error);
            showToast("Erro ao excluir conta. Tente novamente mais tarde.", "error");
        }
    };

    if (!user) {
        return null;
    }

    return (
        <App>
            <ProfileHeader>
                <a  onClick={() => history.push("/dashboard")} className="back-button">
                    <FaArrowLeft />
                </a>
                <h2>Perfil do usuário</h2>
            </ProfileHeader>
            <ProfileInfo>
                <ProfilePicture>
                {
                    name ? (<span>{name.split(" ").map((n) => n[0]).join("")}</span>) :
                        (<img src={logo} alt="Logo Santa Joana" />)
                }
                {
                    (user.profilePicture || localStorage.getItem("profileImage")) && 
                    (<img src={user.profilePicture || localStorage.getItem("profileImage")} alt="Foto de Perfil" />)
                }
            </ProfilePicture>
                <h3>Informações Pessoais</h3>
            </ProfileInfo>
            <ProfileSection>                    
                {editMode ? (
                <EditFormDiv>
                    <EditForm onSubmit={handleSave}>
                        <FormGroup>
                            <label>Alterar Telefone:</label>
                            <input type="tel" value={phone} onChange={handlePhoneChange} />
                        </FormGroup>
                        <FormGroup>
                            <label>Alterar Endereço:</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </FormGroup>
                        <ProfileMenu>
                            <PersonalizedButton type="button" onClick={handleEditToggle} title="Cancelar edição">
                                <FaTimes/>
                                <span className="button-tooltip">Cancelar</span>
                            </PersonalizedButton>
                            <PersonalizedButton type="submit" title="Salvar alterações">
                                <FaSave/>
                                <span className="button-tooltip">Salvar</span>
                            </PersonalizedButton>
                            <AccountForm>
                                <p>Conta</p>
                                <AccountForm2>
                                    <PersonalizedButton onClick={handleLogout} title="Sair da conta">
                                        <FaSignOutAlt/>
                                        <span className="button-tooltip">Sair</span>
                                    </PersonalizedButton>
                                    <PersonalizedButton onClick={handleDeleteAccount} title="Excluir conta">
                                        <FaTrash/>
                                        <span className="button-tooltip">Excluir</span>
                                    </PersonalizedButton>
                                </AccountForm2>
                            </AccountForm>
                        </ProfileMenu>
                    </EditForm>
                </EditFormDiv>
                ) : (
                    <InfoDiv>
                        <InfoRow>
                            <label>ID:</label>
                            <span>{ID || "Não disponível"}</span>
                        </InfoRow>
                        <InfoRow>
                            <label>Nome:</label>
                            <span>{name || "Não disponível"}</span>
                        </InfoRow>
                           <InfoRow>
                            <label>E-mail:</label>
                            <span>{email || "Não disponível"}</span>
                        </InfoRow>
                        <InfoRow>
                            <label>CPF:</label>
                            <span>{cpf || "Não disponível"}</span>
                        </InfoRow>
                        <InfoRow>
                            <label>Quarto:</label>
                            <span>{quarto || "Não Hospedado"}</span>
                        </InfoRow>
                        <InfoRow>
                            <label>Data entrada:</label>
                            <span>{dataEntrada || "Não Hospedado"}</span>
                        </InfoRow>
                        <InfoRow>
                            <label>Telefone:</label>
                            <span>{phone || "Não disponível"}</span>
                        </InfoRow>
                        <InfoRow>
                            <label>Endereco:</label>
                            <span>{address || "Não disponível"}</span>
                        </InfoRow>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <PersonalizedButton onClick={handleEditToggle} title="Editar perfil">
                                <FaEdit/>
                            </PersonalizedButton>
                        </div>
                    </InfoDiv>
                )}
            </ProfileSection>

            <ProfileContainer>
                <ProfileHeader>
                    <button onClick={() => history.push("/dashboard")} className="back-button">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <h2>Meu Perfil</h2>
                </ProfileHeader>
                <ProfilePicture>
                    <span>{name?.split(" ").map((n) => n[0]).join("")}</span>
                    <img src={user.profilePicture || localStorage.getItem("profileImage") || logo} alt="Foto de Perfil" />
                </ProfilePicture>
                <ProfileInfo>
                    <h3>{name || "Nome Indisponível"}</h3>
                    <p>{email || "Email Indisponível"}</p>
                </ProfileInfo>
                <ProfileSection>
                    <h3>Informações Pessoais</h3>
                    {editMode ? (
                        <EditForm onSubmit={handleSave}>
                            <FormGroup>
                                <label>Telefone:</label>
                                <input type="tel" value={phone} onChange={handlePhoneChange} />
                            </FormGroup>
                            <FormGroup>
                                <label>Endereço:</label>
                                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </FormGroup>
                            <div className="form-actions">
                                <SecondaryButton type="button" onClick={handleEditToggle}>
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton type="submit">Salvar</PrimaryButton>
                            </div>
                        </EditForm>
                    ) : (
                        <>
                            <InfoRow>
                                <label>Telefone:</label>
                                <span>{phone || "Não disponível"}</span>
                            </InfoRow>
                            <InfoRow>
                                <label>Endereço:</label>
                                <span>{address || "Não disponível"}</span>
                            </InfoRow>
                            <PrimaryButton onClick={handleEditToggle}>Editar</PrimaryButton>
                        </>
                    )}
                </ProfileSection>
                <ProfileMenu>
                    <button onClick={handleLogout} className="logout">
                        Sair
                    </button>
                    <button onClick={handleDeleteAccount} className="delete-account">
                        Excluir Conta
                    </button>
                </ProfileMenu>
            </ProfileContainer>
        </App>
    );
}