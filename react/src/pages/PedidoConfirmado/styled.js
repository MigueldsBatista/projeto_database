import styled from "styled-components";

export const ConfirmationContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

export const SuccessAnimation = styled.div`
    font-size: 50px;
    color: #28a745;
    margin-bottom: 20px;

    i {
        animation: pop 0.5s ease-in-out;
    }

    @keyframes pop {
        0% {
            transform: scale(0.5);
        }
        100% {
            transform: scale(1);
        }
    }
`;

export const OrderInfoCard = styled.div`
    width: 100%;
    max-width: 400px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;

    .order-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        .label {
            font-weight: bold;
            color: #6c757d;
        }

        .value {
            color: #343a40;
        }
    }
`;

export const DeliveryTime = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;

    i {
        font-size: 20px;
        color: #007bff;
    }

    p {
        font-size: 16px;
        color: #343a40;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;

    button {
        flex: 1;
    }
`;

export const BottomNav = styled.nav`
    display: flex;
    justify-content: space-around;
    margin-top: 20px;

    .nav-item {
        text-align: center;
        color: #007bff;
        text-decoration: none;

        &.active {
            font-weight: bold;
        }

        i {
            font-size: 20px;
            margin-bottom: 5px;
        }
    }
`;