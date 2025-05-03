import styled from 'styled-components'

import { spacing } from '../../config/spacing';
import { borderColor, primaryBlue, secondaryBlue, textDisabledColor, textPrimaryColor, textSecondaryColor } from '../../config/colors';
import { fontSize } from '../../config/font';
import { borderRadius } from '../../config/border';
 
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

export const RegisterForm = styled.form``;

export const InputGroup = styled.div`
    margin-bottom: ${spacing.lg};
    label{
        display: block;
        margin-bottom: ${spacing.sm};
        font-size: ${fontSize.caption};
        font-weight: 500;
        color: ${textSecondaryColor};
    }
    input{
        width: 100%;
        height: 56px;
        padding: 0 ${spacing.md};
        font-size: ${fontSize.body};
        border: 1px solid ${borderColor};
        border-radius: ${borderRadius.sm};
        background-color: white;
        color: ${textPrimaryColor};
    }
    input::placeholder{
        color: ${textDisabledColor};
    }
    input:focus{
        border-color: ${secondaryBlue};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        outline: none;
    }
`;

export const RegisterLink = styled.div`
`;

export const LoginLink = styled.div`
`;
