import styled from "styled-components";
import { borderColor, darkBlue, primaryBlue, secondaryBlue, sucessColor, textPrimaryColor, textSecondaryColor, warningColor} from "../../config/colors";
import { spacing } from "../../config/spacing";

export const InvoiceHeader = styled.header`
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

export const InvoiceTotalCard = styled.div`
    background: linear-gradient(to bottom, #00205B, #1E3A8A, #3B82F6);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: left;

    
    h5 {
        margin: 0 0 8px 0;
        font-weight: 600;
        font-size: 16px;
        color: #FFFFFF;
        text-align: left;
    }
    
    p {
        margin: 0 0 5px 0;
        color: #FFFFFF;
        font-weight: 700;
        font-size: 32px;
        text-align: left;
    }
    
    span {
        display: inline-block;
        font-size: 14px;
        font-weight: bold;
        padding: 6px 16px;
        border-radius: 20px;
        color: #fff;
        
        &.pending {
            background-color: ${warningColor};
            color: #fff;
        }

        &.paid {
            background-color: ${sucessColor};
            color: #fff;
        }
    }
`;

export const InvoiceSummary = styled.div`
    border: 1px solid ${borderColor};
    margin-bottom: 20px;
    background-color: white;
    padding: 20px;
    border-radius: 8px;

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
    padding: 20px;

`;

export const InvoiceTitle = styled.div`
    border-radius: 8px;
    border: 1px solid  ${borderColor};
    background-color: #f8f9fa;
    margin-bottom:20px;

    h3{
        color: ${textPrimaryColor};
        font-size: 16px;
        font-weight: 700;
        padding-top: 10px;
        padding-left: 10px;
    }

    p{
        font-size: 14px;
        color: ${textSecondaryColor};
        margin: 0;
        padding-left: 10px;
        padding-bottom: 10px;
    }
`;