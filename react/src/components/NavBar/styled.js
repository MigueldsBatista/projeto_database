import styled from 'styled-components';
import { spacing } from '../../config/spacing';
import { borderColor, errorColor, primaryBlue, textSecondaryColor } from '../../config/colors';
 
 export const Nav = styled.nav`
     display: flex;
     justify-content: space-between;
     background-color: white;
     padding: ${spacing.xs} ${spacing.lg};
     border-top: 1px solid ${borderColor};
     box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
     position: fixed;
     inset: auto 0 0;
     z-index: 10;
     bottom: -1px;
     .nav-item{
       display: flex;
       flex-direction: column;
       align-items: center;
       text-decoration: none;
       color: ${textSecondaryColor};
       font-size: 12px;
       position: relative;
       padding: ${spacing.xxs} 0;
     }
     .nav-item:i{
       font-size: 20px;
       margin-bottom: 4px;
     }
     .nav-item.active{
       color: ${primaryBlue};
       font-weight: 500;
     }
     .nav-item .badge {
       position: absolute;
       top: 0;
       right: -5px;
       background-color: ${errorColor};
       color: white;
       font-size: 10px;
       min-width: 18px;
       height: 18px;
       border-radius: 9px;
       display: flex;
       align-items: center;
       justify-content: center;
       padding: 0 ${spacing.xxs};
     }
 `;