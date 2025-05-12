import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../services/axios";
import logo from "../../static/img/hsj_logo.png";
import { App, BiometricButton, PrimaryButton } from "../../styles/GlobalStyles";
import { InputGroup, LoginBiometa, LoginContainer, LoginForm, RegisterLink } from "./styled";
import { toast } from "react-toastify";
import { CustomLink } from "../../styles/GlobalStyles";
import { FaFingerprint } from "react-icons/fa";
import { primaryBlue } from "../../config/colors";

export default function Login() {
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Por favor, preencha todos os campos");
            return;
        }

        try {
            toast.info("Autenticando...");
            const patientResponse = await axios.post("/api/auth/pacientes/login", {
                email,
                senha: password,
            });

            if (patientResponse.data.authenticated) {
                handleSuccessfulLogin(patientResponse.data);
                return;
            }
            const staffResponse = await axios.post("/api/auth/camareiras/login", {
                email,
                senha: password,
            });

            if (staffResponse.data.authenticated) {
                handleSuccessfulLogin(staffResponse.data);
                return;
            }
            toast.error("Email ou senha incorretos");
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            toast.error("Erro ao conectar com o servidor. Tente novamente mais tarde.");
        }
    };

    const handleSuccessfulLogin = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));

        if (userData.profilePicture) {
            localStorage.setItem("profileImage", userData.profilePicture);
        }

        toast.success("Login realizado com sucesso!");
      
        const redirectUrl = userData.role === "camareira" ? "/staff-dashboard" : "/dashboard";
        history.push(redirectUrl);
    };

    return (
        <App className="screen active">
            <LoginContainer>
                <img src={logo} alt="Hospital Santa Joana" className="logo" />
                <h1>Bem-vindo</h1>
                <p className="subtitle">Faça login para acessar seus serviços</p>
                <LoginForm onSubmit={handleSubmit}>
                    <InputGroup>
                        <label htmlFor="email">E-mail do Paciente</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu email"
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            required
                        />
                    </InputGroup>
                    <PrimaryButton type="submit" className="btn-primary">
                        Entrar
                    </PrimaryButton>
                </LoginForm>
                <CustomLink variant="forgot" to="/forgotPassword">
                    Esqueci minha senha
                </CustomLink>
                <LoginBiometa>
                    <BiometricButton>
                        <FaFingerprint color={primaryBlue} size={24}/>
                        <span>Login com biometria</span>
                    </BiometricButton>
                </LoginBiometa>
                <RegisterLink>
                    Não tem uma conta? <CustomLink variant="register" to="/register">Crie agora</CustomLink>
                </RegisterLink>
            </LoginContainer>
        </App>
    );
}