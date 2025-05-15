import styled from "styled-components";
import { spacing } from "../../config/spacing";
import { borderColor, primaryBlue } from "../../config/colors";

export const CartContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

export const CartHeader = styled.header`
    display: flex;
        flex-direction: row;
        align-items: center;
        padding: ${spacing.md};
        background-color: white;
        border-bottom: 1px solid ${borderColor};
        margin-bottom: ${spacing.xxs};
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
        }
    
        .back-button {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
`;

export const CartItemsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const CartItem = styled.div`
    display: flex;
    gap: 15px;

    .cart-item-image img {
        width: 80px;
        height: 80px;
        object-fit: cover;
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-quantity-control {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;

export const CartSummary = styled.div`
    margin-top: 20px;
`;

export const CartTotalRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 10px;
`;

export const CartNotes = styled.div`
    margin-bottom: 20px;

    textarea {
        width: 100%;
        height: 80px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
`;

export const EmptyCartMessage = styled.div`
    text-align: center;

    i {
        font-size: 50px;
        margin-bottom: 10px;
    }

    h3 {
        margin-bottom: 10px;
    }
`;