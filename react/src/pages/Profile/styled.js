import styled from 'styled-components';

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
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;

    img {
        width: 100%;
        height: 100%;
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
