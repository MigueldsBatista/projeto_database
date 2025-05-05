import styled from "styled-components";

export const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

export const MenuHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .back-button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }

    .icon-button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }
`;

export const SearchBar = styled.div`
    margin-bottom: 20px;

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
    gap: 10px;
    margin-bottom: 20px;

    .tab-item {
        padding: 10px 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        background-color: #f8f9fa;

        &.active {
            background-color: #007bff;
            color: white;
        }
    }
`;

export const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
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

            .product-price {
                font-size: 16px;
                font-weight: bold;
                color: #007bff;
            }

            .add-to-cart-button {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #007bff;
            }
        }
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