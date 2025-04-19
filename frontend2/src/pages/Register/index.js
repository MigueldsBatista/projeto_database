import React, { useState } from "react";

import  history  from '../../services/history'
import { toast } from "react-toastify";
import { Container } from "../../styles/GlobalStyles";
import { Form } from './Styled'
import axios from '../../services/axios';

import { isEmail } from "validator";

export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        let formErrors = false;
        if (nome.length < 3 || nome.length > 255) {
            formErrors = true;
            toast.error('nome deve ter entre 3 a 255 caracteres');
        }
        if (!isEmail(email)) {
            formErrors = true;
            toast.error('Email Invalido');
        }
        if (password.length < 6 || password.length > 50) {
            formErrors = true;
            toast.error('senha deve ter entre 6 a 50 caracteres');
        }
        if (formErrors) {
            return;
        }
        else {
            try {
                await axios.post('/users/', {
                    nome, password, email
                })
                toast.success(`${nome} cadastrado com sucesso`);
                history.push('/');
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <Container>
            <h1>Crie sua conta</h1>
            <Form onSubmit={handleSubmit}>
                <label htmlFor="nome">
                    Nome:
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
                </label>
                <label htmlFor="email">
                    Email:
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu email" />
                </label>
                <label htmlFor="password">
                    Senha:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" />
                </label>
                <button type="submit"> Criar minha conta</button>
            </Form>
        </Container>
    );
}
