import React from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.header`
  background-color: white;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  border-bottom: 1px solid var(--border);
`;

const Title = styled.h1`
  font-size: var(--font-h2);
  color: var(--text-primary);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <Title>Hospital Santa Joana - Admin</Title>
      <UserInfo>
        <UserName>Administrador</UserName>
        <UserAvatar>
          <i className="fas fa-user"></i>
        </UserAvatar>
      </UserInfo>
    </NavbarContainer>
  );
};

export default Navbar;