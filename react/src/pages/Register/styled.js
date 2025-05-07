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
        margin-bottom: ${spacing.xs};
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
        margin-bottom: ${spacing.sm};
    }
`;

export const RegisterForm = styled.form`
`;

export const InputGroup = styled.div`
    margin-bottom: ${spacing.sm};
    label{
        display: block;
        margin-bottom: ${spacing.xs};
        font-size: ${fontSize.caption};
        font-weight: 500;
        color: ${textSecondaryColor};
    }
    ${(props)=> props.variant === 'inline' && `
        padding: ${spacing.xxs};
    `}
    input{
        width: 100%;
        height: 30px;
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

export const LoginLink = styled.div`
    text-align: center;
    margin-top: ${spacing.md};
    color: ${textSecondaryColor};
    font-size: ${fontSize.caption};
    a {
        color: ${primaryBlue};
        text-decoration: none;
        font-weight: 500;
    }
`;

export const HeaderBotarDoLado = styled.div`
    display: flex;
    flex-direction: row;
    align-items: left;
    margin-bottom: ${spacing.xxs};
    .logo {
        width: 80px;
        height: auto;
        margin-right: ${spacing.xs};
    }
`;

export const BotarDoLado = styled.div`
  display: flex;
    flex-direction: row;
    align-items: left;
`;


export const TextContainer = styled.div` 
    display: flex;
    flex-direction: column;
    text-align: left;
    justify-content: left;
    h1 {
        margin-bottom: ${spacing.xs};
    }
`;
