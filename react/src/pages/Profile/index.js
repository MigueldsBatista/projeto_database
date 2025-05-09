import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../services/axios";
import logo from "../../static/img/hsj_logo.png";
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

export default function Profile() {
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        // Recupera os dados do usuário do localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            history.push("/");
            return;
        }
        setUser(storedUser);
        setName(storedUser.name);
        setEmail(storedUser.email);
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
            // Enviar apenas os números para o backend
            const phoneNumeric = phone.replace(/\D/g, "");
            const response = await axios.put(`/api/pacientes/update`, {
                id: user.id,
                telefone: phoneNumeric,
                endereco: address,
            });
            const updatedUser = response.data;
            
            // Garantir que o telefone seja formatado no objeto do usuário
            updatedUser.telefone = phoneNumeric;
            
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            showToast("Informações atualizadas com sucesso!", "success");
            
            // Garantir que o número exibido esteja formatado
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