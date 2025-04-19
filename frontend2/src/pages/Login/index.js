import React from "react";
import { useForm } from 'react-hook-form';
import { Container } from "../../styles/GlobalStyles";
import { Form } from './Styled'
import { useDispatch } from "react-redux";
import { loginRequest } from '../../store/modules/auth/authSlice';
import { get } from 'lodash';
import { isEmail } from "validator";

export default function Login(props) {
    const dispatch = useDispatch();
    const prevPath = get(props, 'location.state.prevPath', '/postagem');

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        dispatch(loginRequest({ ...data, prevPath }));
    };

    return (
        <Container>
            <h1>Login</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">
                    Email:
                    <input type="email" placeholder="Seu email" {...register("email", {
                        required: "Email é obrigatório",
                        validate: value => isEmail(value) || "Email inválido"
                    })} />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </label>
                <label htmlFor="password">
                    Senha:
                    <input type="password" placeholder="Sua senha" {...register("password", {
                        required: "Senha é obrigatória",
                        minLength: {
                            value: 6,
                            message: "min 6 caracteres"
                        },
                        maxLength: {
                            value: 50,
                            message: "max 50 caracteres"
                        }
                    })} />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </label>
                <button type="submit">Acessar</button>
            </Form>
        </Container>
    );
}
