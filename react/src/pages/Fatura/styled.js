import styled from "styled-components";

export const InvoiceContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-bottom: 20px;
    min-height: 100%;
`;

export const InvoiceHeader = styled.header`
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

export const InvoiceTotalCard = styled.div`
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    text-align: center;

    .invoice-total-label {
        font-size: 16px;
        font-weight: bold;
        color: #6c757d;
    }

    .invoice-total-value {
        font-size: 24px;
        font-weight: bold;
        color: #007bff;
        margin: 10px 0;
    }

    .invoice-status {
        font-size: 14px;
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 5px;
        display: inline-block;

        &.pending {
            background-color: #ffc107;
            color: #fff;
        }

        &.paid {
            background-color: #28a745;
            color: #fff;
        }
    }
`;

export const InvoiceSummary = styled.div`
    margin-bottom: 20px;

    h3 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .invoice-patient-info {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .patient-info-row {
            display: flex;
            justify-content: space-between;

            .patient-info-label {
                font-weight: bold;
                color: #6c757d;
            }

            .patient-info-value {
                color: #343a40;
            }
        }
    }
`;

export const InvoiceItemsSection = styled.div`
    margin-bottom: 20px;

    h3 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }
`;

export const InvoiceDayGroup = styled.div`
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    background-color: #f8f9fa;
`;

export const InvoiceDayHeader = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 10px;
`;

export const InvoiceItem = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;

    .invoice-item-name {
        font-weight: bold;
        color: #343a40;
    }

    .invoice-item-quantity {
        color: #6c757d;
    }

    .invoice-item-price {
        font-weight: bold;
        color: #28a745;
    }
`;

export const InvoiceDayTotal = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-top: 10px;
    border-top: 1px solid #dee2e6;
    padding-top: 10px;

    span {
        color: #343a40;
    }
`;

export const PaymentInfo = styled.div`
    margin-bottom: 20px;

    h3 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .patient-info-row {
        display: flex;
        justify-content: space-between;

        .patient-info-label {
            font-weight: bold;
            color: #6c757d;
        }

        .patient-info-value {
            color: #343a40;
        }
    }

    .invoice-payment-note {
        margin-top: 10px;
        font-size: 14px;
        color: #6c757d;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;

    button {
        flex: 1;
    }
`;

export const InvoiceContent = styled.div`
    overflow-y: auto;
    flex-grow: 1;
    padding-bottom: 20px;
`;