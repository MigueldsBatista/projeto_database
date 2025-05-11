import styled from 'styled-components';
import { spacing } from '../../config/spacing';
import { borderColor, primaryBlue, secondaryBlue } from '../../config/colors';
import { borderRadius } from '../../config/border';

export const ProfileHeader = styled.header`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${spacing.lg};
    background-color: white;
    border-bottom: 1px solid ${borderColor};
    margin-bottom: ${spacing.md};
    position: relative;

    a{  
        position: absolute;
        left: ${spacing.md};
        cursor: pointer;
    }
    a:hover{
        color: ${primaryBlue};
    }
    
    h2 {
        flex: 1;
        text-align: center;
        font-weight: 700;

export const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

export const ProfileHeader = styled.header`
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;

    .back-button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }

    h2 {
        margin-left: 10px;
    }
`;

export const ProfilePicture = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: ${primaryBlue};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 40px;
    margin-bottom: ${spacing.md};
    overflow: hidden; 
    position: relative;
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;

    img {
        width: 100%;
        height: 100%;
        display:flex;
    }
    

    .edit-icon {
         position: absolute;
        bottom: 0;
        right: 0;
        background-color: ${secondaryBlue};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        object-fit: cover;
    }

    span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: #ccc;
        font-size: 40px;
        font-weight: bold;
        color: #fff;
    }
`;

export const ProfileInfo = styled.div`
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;

    h3 {
        font-size: var(--font-h2);
        font-weight: 700;
        margin-bottom: var(--spacing-xs);

    h3 {
        margin-bottom: 5px;
    }

    p {
        color: #666;
    }
`;

export const ProfileSection = styled.section`
    width: 100%;
    margin-top: 20px;

    h3 {
        margin-bottom: 10px;
    }
`;

export const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 100%;


    label {
        font-weight: bold;
    }
`;

export const EditForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;

    .form-actions {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;

    label {
        margin-bottom: 5px;
    }

    input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
`;

export const ProfileMenu = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${spacing.md};
    margin-top: 20px;

    button {
        display: block;
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .logout {
        background-color: #007bff;
        color: #fff;
    }

    .delete-account {
        background-color: #dc3545;
        color: #fff;
    }
`;

export const InfoDiv = styled.div`
    background-color: white;
    padding: ${spacing.md};
    border: 1px solid ${borderColor};
    border-radius: ${borderRadius.lg};
    margin-left: ${spacing.md};
    margin-right: ${spacing.md};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const EditFormDiv = styled.div`
    background-color: white;
    padding: ${spacing.md};
    border: 1px solid ${borderColor};
    border-radius: ${borderRadius.lg};
    margin-left: ${spacing.md};
    margin-right: ${spacing.md};
`;

export const PersonalizedButton = styled.button`
    background-color: transparent;
    border: none;
    color: ${primaryBlue};
    font-size: 17px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    text-align: center;
    display: flex;
    flex-direction: column;
    &:hover {
        color: ${secondaryBlue};
    }
`;

export const AccountForm = styled.div`
    display: flex;
    flex-direction: column;
    text-align:center;
    border:1px solid ${primaryBlue};
    border-radius: ${borderRadius.lg};  
    color: ${primaryBlue};
`;

export const AccountForm2 = styled.div`
    display: flex;
    flex-direction: row;
`;
