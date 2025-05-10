import styled from "styled-components";

export const ProductDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

export const ProductImage = styled.div`
    width: 100%;
    height: 240px;
    overflow: hidden;
    margin-bottom: 20px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const ProductDetailsCard = styled.div`
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const ProductName = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;

export const ProductPrice = styled.p`
    font-size: 24px;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 20px;
`;

export const ProductDescription = styled.p`
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
`;

export const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .quantity-label {
        margin-right: 10px;
        font-weight: 500;
    }

    .quantity-button {
        background: none;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
    }

    .quantity-value {
        margin: 0 10px;
        font-size: 16px;
    }
`;

export const NutritionalInfoSection = styled.div`
    margin-bottom: 20px;

    h3 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }
`;

export const InfoList = styled.ul`
    list-style: none;
    padding: 0;
`;

export const InfoItem = styled.li`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .info-label {
        color: #666;
    }

    .info-value {
        font-weight: bold;
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