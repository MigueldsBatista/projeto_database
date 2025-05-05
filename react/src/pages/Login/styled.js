import styled from "styled-components";
import { borderColor, primaryBlue, textDisabledColor, textPrimaryColor, textSecondaryColor } from "../../config/colors";
import { fontSize } from "../../config/font";
import { spacing } from "../../config/spacing";
import { borderRadius } from "../../config/border";

export const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${spacing.xl};
    height: 100%;
    justify-content: center;
    .logo{
        align-self: center;
        width: 120px;
        margin-bottom: ${spacing.xl};
    }
    h1{
        font-size: ${fontSize.h1};
        font-weight: 700;
        margin-bottom: ${spacing.sm};
        color: ${primaryBlue};
    }
    .subtitle{
        font-size: ${fontSize.body};
        color: ${textSecondaryColor};
        margin-bottom: ${spacing.xl};
    }
`;

export const LoginForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const InputGroup = styled.div`
    margin-bottom: var(--spacing-lg);

    label {
        display: block;
        margin-bottom: ${spacing.sm};
        font-size: ${fontSize.caption};
        font-weight: 500;
        color: ${textSecondaryColor};
    }

    input {
        width: 100%;
        height: 56px;
        padding: 0 ${spacing.md};
        font-size: ${fontSize.body};
        border: 1px solid ${borderColor};
        border-radius: ${borderRadius.sm};
        background-color: white;
        color: ${textPrimaryColor};
    }

    inpuT::placeholder {
        color: ${textDisabledColor};
    }

    input:focus {
        border-color: ${primaryBlue};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        outline: none;
    }
`;

export const RegisterLink = styled.p`
    text-align: center;
    margin-top: ${spacing.xl};
    color: ${textSecondaryColor};
    font-size: ${fontSize.caption};

`;

export const LoginBiometa = styled.div`
    margin-top: ${spacing.xl};
    display: flex;
    justify-content: center;
`;