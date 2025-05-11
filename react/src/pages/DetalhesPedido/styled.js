import styled from "styled-components";

export const OrderDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

export const OrderHeader = styled.header`
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
`;

export const OrderStatus = styled.div`
    margin-bottom: 20px;

    .order-status-large {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;

        &.pending {
            background-color: #fef3c7;
            color: #92400e;
        }

        &.in-progress {
            background-color: #dbeafe;
            color: #1e40af;
        }

        &.delivered {
            background-color: #d1fae5;
            color: #065f46;
        }

        &.cancelled {
            background-color: #fee2e2;
            color: #b91c1c;
        }
    }
`;

export const OrderItemsList = styled.div`
    margin-bottom: 20px;
`;

export const OrderItemRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eaeaea;

    .item-info {
        flex: 1;

        h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
        }

        p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }
    }

    .item-quantity {
        font-size: 14px;
        color: #666;
    }

    .item-price {
        font-weight: 500;
        font-size: 16px;
    }
`;

export const OrderNotesSection = styled.div`
    margin-bottom: 20px;

    p {
        font-size: 14px;
        color: #666;
        font-style: italic;
    }
`;

export const OrderTotalSection = styled.div`
    margin-bottom: 20px;

    .order-total-row {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        font-size: 16px;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;

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