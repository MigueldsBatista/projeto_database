import React from "react";
import { useForm } from "react-hook-form";

import { Container } from "../../styles/GlobalStyles";
import { Form } from './Styled';
import { toast } from "react-toastify";
import axios from "../../services/axios";
import history from "../../services/history";

export default function Postar() {
    const { register, handleSubmit, formState: { errors }, } = useForm();

    async function onSubmit(data) {
        const { titulo, descricao } = data;

        try {
            await axios.post('/post/', { titulo, descricao });
            toast.success('Postagem postada com sucesso');
            history.push('/postagem');
        } catch (e) {
            console.error(e);
            toast.error('Erro ao postar');
        }
    }

    return (
        <Container>
            <h1>Criar Nova Postagem</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="titulo">
                    Titulo:
                    <input type="text" placeholder="Seu titulo"{...register("titulo", {
                            required: "O título é obrigatório",
                            minLength: { value: 1, message: "min de 1 caractere" },
                            maxLength: { value: 50, message: "max de 50 caracteres" },
                        })}/>
                    {errors.titulo && <p>{errors.titulo.message}</p>}
                </label>

                <label htmlFor="descricao">
                    Descrição:
                    <input type="text" placeholder="Sua descrição"{...register("descricao", {
                            required: "A descrição é obrigatória",
                            minLength: { value: 1, message: "min de 1 caractere" },
                            maxLength: { value: 500, message: "max de 500 caracteres" },
                        })}/>
                    {errors.descricao && <p>{errors.descricao.message}</p>}
                </label>
                <button type="submit">Postar</button>
            </Form>
        </Container>
    );
}
