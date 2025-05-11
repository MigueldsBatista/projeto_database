import styled from "styled-components";
import { fontSize } from "../../config/font";
import { primaryBlue, secondaryBlue, textPrimaryColor, textSecondaryColor, warningColor } from "../../config/colors";
import { spacing } from "../../config/spacing";
import { borderRadius } from "../../config/border";
import { Link } from "react-router-dom";

export const PatientInfo = styled.div`
    p{
        font-size: ${fontSize.caption};
        color: ${textSecondaryColor};
    }
`;

export const UserAvatar = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: ${primaryBlue};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 16px;
    overflow: hidden;
    cursor: pointer;

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const WelcomeCard = styled.div`
    background-color: ${primaryBlue};
    color: white;
    padding: ${spacing.lg};
    border-radius: ${borderRadius.lg};
    margin-bottom: ${spacing.lg};
    h3 {
        font-size: ${fontSize.h2};
        font-weight: 700;
        margin-bottom: ${fontSize.sm};
    }
`;

export const InvoiceSumary = styled.div`
    background-color: white;
    border-radius: ${borderRadius.lg};
    padding: ${spacing.md};
    margin-bottom: ${spacing.lg};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const SummaryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${spacing.md};
    h3 {
        font-size: ${fontSize.h2};
        font-weight: 700;
    }
`;

export const CustomLink = styled(Link)`
    font-size: ${fontSize.caption};
    color: ${props => props.color || secondaryBlue};
    text-decoration: none;
    ${({ variant }) => variant === "verDetalhes" && `
        font-size: ${fontSize.caption};
        color: ${secondaryBlue};
        `
    }
`;

export const TotalAmount = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: ${textPrimaryColor};
    margin-bottom: ${spacing.xs};
`;

export const Status = styled.div`
    font-size: ${fontSize.caption};
    color: ${textSecondaryColor};
    
    span {
        color: ${props => 
            props.status && props.status.toLowerCase() === 'pendente' ? warningColor : textSecondaryColor
        };
        font-weight: ${props => 
            props.status && props.status.toLowerCase() === 'pendente' ? '500' : 'normal'
        };
    }
`;

export const CategoryMenu = styled.div`
    margin-bottom: ${spacing.lg};
    h3 {
        font-size: ${fontSize.h2};
        font-weight: 700;
        margin-bottom: ${spacing.md};
    }
`;

export const Categories = styled.div`
    display: grid;
    grid-template-columns:repeat(4, 1fr);
    gap: ${spacing.md};
`;

export const CategoriesItem = styled.div`
    display: flex;
    text-decoration: none;
    color: ${primaryBlue};
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const CategoryIcon = styled(Link)`
    width: 64px;
    height: 64px;
    background-color: white;
    border-radius: ${borderRadius.lg};
    display: flex;
    color: ${primaryBlue};

    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing.sm};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    p{
        font-size: ${fontSize.caption};
        color: ${textPrimaryColor};
    }
`;

export const OrdersSection = styled.div`
    margin-bottom: ${spacing.lg};
    h3 {
        font-size: ${fontSize.h2};
        font-weight: 700;
        margin-bottom: ${spacing.md};
    }
`;

export const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${spacing.md};
    h3 {
        font-size: ${fontSize.h2};
        font-weight: 700;
    }
`;

export const OrderList = styled.div`
    padding-top: ${spacing.md};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${spacing.md};
    margin-bottom: ${spacing.lg};
    .order-card {
        cursor: pointer;
    }
`;  



