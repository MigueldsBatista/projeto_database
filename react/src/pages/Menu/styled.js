import styled from "styled-components";
import { primaryBlue } from "../../config/colors";
import { spacing } from "../../config/spacing";
import { borderRadius } from "../../config/border";


export const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: calc(100% - 210px);
    overflow-y: auto;
    background-color: white;
`;
export const MenuHeaderDivision = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: auto;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);

`;

export const MenuHeader = styled.header`
    display: flex;
    align-items: center;
    background-color: white;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    width: 100%;

    .back-button {
        position: absolute;
        left: 10px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .back-button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }
    
    h2 {
        flex: 1;
        text-align: center;
        font-weight: 700;
    }
    

    .header-actions {
        position: absolute;
        right: 10px;
    }

    .icon-button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }
`;

export const SearchBar = styled.div`
    margin: 10px 0;
    width: 100%;
    background-color: white;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;

    input {
        padding: 10px;
        width: 90%;
        max-width: 400px;
        margin-bottom: 20px;
    }

    input {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
`;

export const CategoryTabs = styled.div`
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; 
    -ms-overflow-style: none; 
    padding: ${spacing.xxs};
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    z-index: 4;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
        display: none;
    }
    
    .tab-item {
        padding: 12px 20px;
        border: 1px solid #ddd;
        border-radius: 25px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        
        &.active {
            background-color: ${primaryBlue};
            color: white;
            border-color: ${primaryBlue};
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }
    }
    
    &::after {
        content: '';
        position: absolute;
        height: 100%;
        pointer-events: none;
    }
    
    &::before {
        content: '';
        position: absolute;
        height: 100%;
        pointer-events: none;
        opacity: 0.8;
        z-index: 1;
    }

    gap: 10px;
    margin-bottom: 20px;
`;

export const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 240px;
    padding-bottom: 40px;
    position: relative;
    z-index: 0;

`;

export const ProductCard = styled.div`
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;

    .product-image img {
        width: 100%;
        height: 150px;
        object-fit: cover;
    }

    .product-info {
        padding: 10px;

        h3 {
            font-size: 16px;
            margin-bottom: 5px;
        }

        .product-description {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }

        .product-price-action {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .product-price {
                font-size: 16px;
                font-weight: bold;
                color: #007bff;
        }
    }
`;

export const AddToCartButton = styled.button`
        background-color: ${primaryBlue};
        color: white;
        border: none;
        border-radius: ${borderRadius.full};
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #0056b3;
        }
`;

export const EmptyState = styled.div`
    text-align: center;
    font-size: 16px;
    color: #666;
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