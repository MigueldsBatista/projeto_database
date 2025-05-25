import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { roomsService } from '../../services/roomsService';
import { patientsService } from '../../services/patientsService';
import { staysService } from '../../services/staysService';
import { productsService } from '../../services/productsService';
import { productCategoriesService } from '../../services/productCategoriesService';
import { billingService } from '../../services/billingService';
import { ordersService } from '../../services/ordersService';
import { Link } from "react-router-dom";

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h2`
  font-size: var(--font-h2);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: var(--spacing-sm);
`;

const CardLabel = styled.div`
  font-size: var(--font-caption);
  color: var(--text-secondary);
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: var(--spacing-md);
`;

const DashboardHeader = styled.div`
  grid-column: 1 / -1;
  margin-bottom: var(--spacing-md);
`;

const DashboardTitle = styled.h1`
  font-size: var(--font-h1);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-h2);
  color: var(--text-primary);
  margin: var(--spacing-lg) 0 var(--spacing-md);
  grid-column: 1 / -1;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [patientsWithStay, setPatientsWithStay] = useState(0);
  const [roomStats, setRoomStats] = useState({ occupied: 0, available: 0 });
  const [avgStayLength, setAvgStayLength] = useState(0);
  const [avgPatientAge, setAvgPatientAge] = useState(0);
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [currentMonthBilling, setCurrentMonthBilling] = useState(0);
  const [orderThroughput, setOrderThroughput] = useState(0);
  const [avgSpendingPerPatient, setAvgSpendingPerPatient] = useState(0);
  const [mostOrderedByCategory, setMostOrderedByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obter estatísticas de pacientes
        const activeStays = await staysService.getActiveStays();
        setPatientsWithStay(activeStays.length);

        // Obter estatísticas de quartos
        const allRooms = await roomsService.getAll();
        const availableRooms = await roomsService.getAvailable();
        setRoomStats({
          occupied: allRooms.length - availableRooms.length,
          available: availableRooms.length
        });

        // Calcular média de tempo de estadia (mockup por enquanto)
        const avgStay = await staysService.getAverageStayTime();
        setAvgStayLength(avgStay.tempoMedio || 0);

        // Calcular média de idade dos pacientes (mockup por enquanto)
        const avgAge = await patientsService.getAverageAge();
        setAvgPatientAge(avgAge.idadeMedia || 0);

        // Obter produtos por categoria
        const categories = await productCategoriesService.getAll();
        const products = await productsService.getAll();
        
        const categoryMap = categories.reduce((acc, cat) => {
          acc[cat.id] = { name: cat.nome, count: 0 };
          return acc;
        }, {});
        
        products.forEach(product => {
          if (categoryMap[product.categoriaId]) {
            categoryMap[product.categoriaId].count++;
          }
        });
        
        setProductsByCategory(Object.values(categoryMap));

        // Obter faturamento do mês atual
        const billing = await billingService.getCurrentMonthBilling();
        setCurrentMonthBilling(billing.total || 0);

        // Obter throughput de pedidos (mockup por enquanto)
        const ordersThroughput = await ordersService.getOrdersThroughput();
        setOrderThroughput(ordersThroughput.mediaDiaria || 0);

        // Obter gasto médio por paciente
        const avgSpending = await billingService.getAverageSpendingPerPatient();
        console.log("Avg speding", avgSpending);
        
        setAvgSpendingPerPatient(avgSpending.media || 0);

        const mostOrdered = await productsService.getMostOrderedByCategory();
        // Produtos mais pedidos por categoria (mockup por enquanto)
        // setMostOrderedByCategory([
        //   { name: 'Refeições', value: 45 },
        //   { name: 'Bebidas', value: 32 },
        //   { name: 'Lanches', value: 18 },
        //   { name: 'Higiene', value: 15 },
        //   { name: 'Medicamentos', value: 10 }
        // ]);
        console.log("Most ordered", mostOrdered);
        
        setMostOrderedByCategory(mostOrdered.map(item => {
          return {
            name: `${item.nome} (${item.categoria})`,
            value: item.quantidade
            }
        }));

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const roomData = [
    { name: 'Ocupados', value: roomStats.occupied },
    { name: 'Disponíveis', value: roomStats.available }
  ];

  if (loading) {
    return <div>Carregando dados do dashboard...</div>;
  }

  return (
    <div>
      <DashboardHeader>
        <DashboardTitle>Dashboard Administrativo</DashboardTitle>
        <p>Visão geral do Hospital Santa Joana</p>
      </DashboardHeader>

      <SectionTitle>Indicadores de Pacientes</SectionTitle>
      <DashboardContainer>
        <Card>
          <Link to={"/estadias"} style={{ textDecoration: 'none', color: 'inherit' }}>

          <CardTitle>Pacientes com Estadia</CardTitle>
          </Link>
          <CardValue>{patientsWithStay}</CardValue>
          <CardLabel>Pacientes atualmente internados</CardLabel>
        </Card>

        <Card>
      <Link to={"/quartos"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>Ocupação de Quartos</CardTitle>
      </Link>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {roomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card>
          <Link to={"/estadias"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>Tempo Médio de Estadia</CardTitle>
          </Link>
          <CardValue>{avgStayLength}</CardValue>
          <CardLabel>Dias em média por paciente</CardLabel>
        </Card>

        <Card>
          <Link to={"/pacientes"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>Idade Média dos Pacientes</CardTitle>
          </Link>
          <CardValue>{avgPatientAge.toFixed(2)}</CardValue>
          <CardLabel>Anos</CardLabel>
        </Card>
      </DashboardContainer>

      <SectionTitle>Indicadores Financeiros</SectionTitle>
      <DashboardContainer>
        <Card>
          <Link to={"/produtos"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>Produtos por Categoria</CardTitle>
          </Link>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productsByCategory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Quantidade" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card>
          <Link to={"/faturamento"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>Faturamento do Mês</CardTitle>
          </Link>
          <CardValue>R$ {currentMonthBilling.toFixed(2)}</CardValue>
          <CardLabel>Total faturado no mês atual</CardLabel>
        </Card>

        <Card>
          <Link to={"/pedidos"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>Pedidos por Dia</CardTitle>
          </Link>
          <CardValue>{orderThroughput}</CardValue>
          <CardLabel>Média de pedidos diários</CardLabel>
        </Card>

        <Card>
          <Link to={"/pedidos"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>Gasto Médio por Paciente</CardTitle>
          </Link>
          <CardValue>R$ {avgSpendingPerPatient.toFixed(2)}</CardValue>
          <CardLabel>Valor médio por paciente</CardLabel>
        </Card>

        <Card style={{ gridColumn: '1 / -1' }}>
        <Link to={"/categorias"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>Produtos Mais Pedidos por Categoria</CardTitle>
        </Link>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mostOrderedByCategory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Quantidade" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </DashboardContainer>
    </div>
  );
};

// Generated by Copilot
export default Dashboard;