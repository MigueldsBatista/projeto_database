import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: white;
  border-right: 1px solid var(--border);
  height: 100vh;
  padding-top: 20px;
`;

const Logo = styled.div`
  padding: 0 var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  
  img {
    width: 80%;
  }
`;

const NavMenu = styled.nav`
  margin-top: var(--spacing-md);
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-secondary);
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    background-color: var(--primary-blue-light);
    color: var(--primary-blue);
  }
  
  &.active {
    color: var(--primary-blue);
    background-color: var(--primary-blue-light);
    font-weight: 500;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background-color: var(--primary-blue);
    }
  }
`;

const NavIcon = styled.i`
  width: 20px;
  margin-right: var(--spacing-md);
`;

const NavLabel = styled.span`
  
`;

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <SidebarContainer>
      <Logo>
        <img src="/assets/images/logo_santa_joana.png" alt="Hospital Santa Joana" />
      </Logo>
      <NavMenu>
        <NavItem to="/" className={isActive('/')}>
          <NavIcon className="fas fa-chart-line"></NavIcon>
          <NavLabel>Dashboard</NavLabel>
        </NavItem>
        <NavItem to="/produtos" className={isActive('/produtos')}>
          <NavIcon className="fas fa-utensils"></NavIcon>
          <NavLabel>Produtos</NavLabel>
        </NavItem>
        <NavItem to="/categorias" className={isActive('/categorias')}>
          <NavIcon className="fas fa-tags"></NavIcon>
          <NavLabel>Categorias</NavLabel>
        </NavItem>
        <NavItem to="/quartos" className={isActive('/quartos')}>
          <NavIcon className="fas fa-bed"></NavIcon>
          <NavLabel>Quartos</NavLabel>
        </NavItem>
        <NavItem to="/categorias-quartos" className={isActive('/categorias-quartos')}>
          <NavIcon className="fas fa-door-open"></NavIcon>
          <NavLabel>Categorias de Quartos</NavLabel>
        </NavItem>
        <NavItem to="/pacientes" className={isActive('/pacientes')}>
          <NavIcon className="fas fa-hospital-user"></NavIcon>
          <NavLabel>Pacientes</NavLabel>
        </NavItem>
        <NavItem to="/pedidos" className={isActive('/pedidos')}>
          <NavIcon className="fas fa-clipboard-list"></NavIcon>
          <NavLabel>Pedidos</NavLabel>
        </NavItem>
        <NavItem to="/estadias" className={isActive('/estadias')}>
          <NavIcon className="fas fa-hospital"></NavIcon>
          <NavLabel>Estadias</NavLabel>
        </NavItem>
        <NavItem to="/faturamento" className={isActive('/faturamento')}>
          <NavIcon className="fas fa-file-invoice-dollar"></NavIcon>
          <NavLabel>Faturamento</NavLabel>
        </NavItem>

      </NavMenu>
    </SidebarContainer>
  );
};

export default Sidebar;