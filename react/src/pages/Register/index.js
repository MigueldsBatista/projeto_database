import React, { useState } from "react";

// import  history  from '../../services/history'
// import { toast } from "react-toastify";
// import { Container } from "../../styles/GlobalStyles";
import axios from '../../services/axios';

// import { isEmail } from "validator";

import logo from "../../static/img/hsj_logo.png";
import { useHistory } from "react-router-dom";
import { App, PrimaryButton } from "../../styles/GlobalStyles";
import { InputGroup, LoginContainer, RegisterForm } from "./styled";
import { showToast } from "../../utils";

export default function Register() {
    const history = useHistory();

    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleCpfChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-");
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})/, "$1.$2.");
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})/, "$1.");
        }
        setCpf(value);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !cpf || !email || !password || !confirmPassword || !birthDate) {
            showToast("Por favor, preencha todos os campos obrigatórios", "error");
            return;
        }

        if (password !== confirmPassword) {
            showToast("As senhas não coincidem", "error");
            return;
        }

        const userData = {
            nome: name,
            cpf: cpf.replace(/\D/g, ""),
            email,
            senha: password,
            dataNascimento: birthDate,
            telefone: phone ? phone.replace(/\D/g, "") : null,
            endereco: address || null,
        };

        try {
            showToast("Criando sua conta...", "info");
            const response = await axios.post('/api/pacientes/create', userData);
            const result = response.data;

            if (!response.ok || response.status !== 201) {
                const errorMessage = result.message || "Erro ao criar conta. Por favor, tente novamente.";
                showToast(errorMessage, "error");
                return;
            }

            showToast("Conta criada com sucesso!", "success");
            history.push("/login");
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            showToast("Erro inesperado. Tente novamente mais tarde.", "error");
        }
    };

    return (
        <App className="screen active">
            <LoginContainer>
                <img src={logo} alt="Hospital Santa Joana" className="logo" />
                <h1>Criar Conta</h1>
                <p className="subtitle">Preencha os dados para se cadastrar</p>
                <RegisterForm onSubmit={handleSubmit}>
                    <InputGroup>
                        <label htmlFor="name">Nome Completo</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="cpf">CPF</label>
                        <input type="text" id="cpf" value={cpf} onChange={handleCpfChange} required />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="address">Endereço</label>
                        <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} required />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="phone">Telefone</label>
                        <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} required />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="birth-date">Data de Nascimento</label>
                        <input type="date" id="birth-date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="confirm-password">Confirmar Senha</label>
                        <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    </InputGroup>
                    <PrimaryButton type="submit" className="btn-primary">Criar Conta</PrimaryButton>
                </RegisterForm>
            </LoginContainer>
        </App>
    );
}
