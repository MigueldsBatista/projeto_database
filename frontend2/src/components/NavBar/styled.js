import styled from 'styled-components';

export const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: var(--spacing-sm) var(--spacing-md);
    border-top: 1px solid var(--border);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    position: fixed;
    inset: auto 0 0;
    z-index: 10;
    .nav-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: var(--text-secondary);
      font-size: 12px;
      position: relative;
      padding: var(--spacing-sm) 0;
    }
    .nav-item:i{
      font-size: 20px;
      margin-bottom: 4px;
    }
    .nav-item.active{
      color: var(--primary-blue);
      font-weight: 500;
    }
    .nav-item .badge {
      position: absolute;
      top: 0;
      right: -5px;
      background-color: var(--error);
      color: white;
      font-size: 10px;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 var(--spacing-xs);
    }
`;
