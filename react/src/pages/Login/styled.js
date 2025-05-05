import styled from "styled-components";

export const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const LoginForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;

    label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
    }

    input {
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
        outline: none;

        &:focus {
            border-color: #007bff;
        }
    }
`;