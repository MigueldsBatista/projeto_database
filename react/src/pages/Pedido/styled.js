import styled from "styled-components";

export const OrdersContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

export const OrdersTabs = styled.div`
    display: flex;
    overflow-x: auto;
    background-color: white;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const OrdersTab = styled.button`
    padding: 10px 15px;
    margin-right: 10px;
    background: none;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    cursor: pointer;

    &.active {
        background-color: #007bff;
        color: white;
    }
`;

export const OrderList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

export const OrderCard = styled.div`
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: background-color 0.2s;

    &:active {
        background-color: #f8f9fa;
    }

    .order-info {
        flex: 1;

        .order-date {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }

        .order-items {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 5px;
        }

        .order-price {
            font-size: 16px;
            font-weight: bold;
            color: #007bff;
        }
    }

    .order-status {
        .status-pill {
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            text-align: center;

            &.pending {
                background-color: #ffc107;
                color: white;
            }

            &.in-progress {
                background-color: #17a2b8;
                color: white;
            }

            &.delivered {
                background-color: #28a745;
                color: white;
            }

            &.cancelled {
                background-color: #dc3545;
                color: white;
            }
        }
    }
`;

export const EmptyOrdersMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;

    i {
        font-size: 48px;
        color: #ccc;
        margin-bottom: 20px;
    }

    h3 {
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: bold;
    }

    p {
        margin-bottom: 20px;
        color: #666;
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