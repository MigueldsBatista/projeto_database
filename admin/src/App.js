import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyles';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProductsPage from './pages/Products';
import CategoriesPage from './pages/Categories';
import RoomsPage from './pages/Rooms';
import RoomCategoriesPage from './pages/RoomCategories';
import PatientsPage from './pages/Patients';
import OrdersPage from './pages/Orders';
import StaysPage from './pages/Stays';
import BillingPage from './pages/Billing';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/quartos" element={<RoomsPage />} />
              <Route path="/categorias-quartos" element={<RoomCategoriesPage />} />
              <Route path="/pacientes" element={<PatientsPage />} />
              <Route path="/pedidos" element={<OrdersPage />} />
              <Route path="/estadias" element={<StaysPage />} />
              <Route path="/faturamento" element={<BillingPage />} />
            </Routes>
          </MainContent>
        </div>
      </AppContainer>
    </Router>
  );
}

export default App;
