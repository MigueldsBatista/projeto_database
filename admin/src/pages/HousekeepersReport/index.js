import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { housekeepersService } from '../../services/housekeepersService';
import { ordersService } from '../../services/pedidosService';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Badge,
  Input,
  Select,
  SelectItem,
  Button
} from '@nextui-org/react';
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FaSearch } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const NoData = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const STATUS_COLORS = {
  'PENDING': 'warning',
  'IN_PROGRESS': 'primary',
  'COMPLETED': 'success',
  'CANCELLED': 'danger'
};

const STATUS_LABELS = {
  'PENDING': 'Pendente',
  'IN_PROGRESS': 'Em Andamento',
  'COMPLETED': 'Concluído',
  'CANCELLED': 'Cancelado'
};

/**
 * Página de relatório de camareiras que mostra estatísticas e lista de pedidos por camareira
 * @returns {JSX.Element} Componente de relatório de camareiras
 */
const HousekeepersReport = () => {
  const [housekeepers, setHousekeepers] = useState([]);
  const [selectedHousekeeper, setSelectedHousekeeper] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Carrega a lista de camareiras ao iniciar a página
  useEffect(() => {
    const fetchHousekeepers = async () => {
      try {
        const data = await housekeepersService.getAll();
        setHousekeepers(data);
        if (data.length > 0) {
          setSelectedHousekeeper(data[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar camareiras:', error);
      }
    };
    
    fetchHousekeepers();
  }, []);

  // Carrega os pedidos e estatísticas quando uma camareira é selecionada
  useEffect(() => {
    if (!selectedHousekeeper) return;
    
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const stats = await housekeepersService.getOrderStats(selectedHousekeeper);
        setStats(stats);
        
        const ordersData = await ordersService.getByHousekeeper(selectedHousekeeper);
        setOrders(ordersData);
      } catch (error) {
        console.error('Erro ao carregar pedidos da camareira:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [selectedHousekeeper]);

  // Filtra os pedidos com base no termo de busca e filtro de status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toString().includes(searchTerm) || 
      (order.patient && order.patient.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calcula os pedidos da página atual
  const currentPageOrders = filteredOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Prepara dados para o gráfico de status
  const prepareStatusChartData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Pendentes', value: stats.pendingCount, color: '#FFBB28' },
      { name: 'Em Andamento', value: stats.inProgressCount, color: '#0088FE' },
      { name: 'Concluídos', value: stats.completedCount, color: '#00C49F' },
      { name: 'Cancelados', value: stats.cancelledCount, color: '#FF8042' }
    ].filter(item => item.value > 0);
  };

  /**
   * Atualiza a camareira selecionada e reseta a página para 1
   * @param {Event} e Evento de mudança do select
   */
  const handleHousekeeperChange = (e) => {
    setSelectedHousekeeper(e.target.value);
    setPage(1);
  };

  // Função utilitária para formatar datas
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Função utilitária para formatar valores monetários
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <Container>
      <Title>Controle de Pedidos por Camareira</Title>
      
      <FilterContainer>
        <Select 
          placeholder="Selecione uma camareira"
          value={selectedHousekeeper || ''}
          onChange={handleHousekeeperChange}
          style={{ minWidth: '250px' }}
        >
          {housekeepers.map((housekeeper) => (
            <SelectItem key={housekeeper.id} value={housekeeper.id.toString()}>
              {housekeeper.name}
            </SelectItem>
          ))}
        </Select>
      </FilterContainer>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {stats && (
            <StatsContainer>
              <Card>
                <CardHeader>Resumo de Pedidos</CardHeader>
                <Divider />
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div>
                      <h3>Total de Pedidos</h3>
                      <p style={{ fontSize: '24px', textAlign: 'center' }}>{stats.totalOrders}</p>
                    </div>
                    <div>
                      <h3>Pedidos por Dia</h3>
                      <p style={{ fontSize: '24px', textAlign: 'center' }}>{stats.ordersPerDay.toFixed(1)}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>Distribuição por Status</CardHeader>
                <Divider />
                <CardBody>
                  {prepareStatusChartData().length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={prepareStatusChartData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepareStatusChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoData>Não há dados para exibir</NoData>
                  )}
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>Eficiência</CardHeader>
                <Divider />
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div>
                      <h3>Taxa de Conclusão</h3>
                      <p style={{ fontSize: '24px', textAlign: 'center' }}>
                        {stats.totalOrders > 0 
                          ? `${((stats.completedCount / stats.totalOrders) * 100).toFixed(1)}%` 
                          : '0%'}
                      </p>
                    </div>
                    <div>
                      <h3>Tempo Médio</h3>
                      <p style={{ fontSize: '24px', textAlign: 'center' }}>
                        {stats.averageCompletionTime ? `${stats.averageCompletionTime} min` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </StatsContainer>
          )}
          
          <Card>
            <CardHeader>Lista de Pedidos</CardHeader>
            <Divider />
            <CardBody>
              <FilterContainer>
                <Input
                  isClearable
                  placeholder="Buscar por ID ou paciente"
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  startContent={<FaSearch />}
                  style={{ minWidth: '250px' }}
                />
                
                <Select 
                  placeholder="Filtrar por status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <SelectItem key="all" value="all">
                    Todos os status
                  </SelectItem>
                  <SelectItem key="PENDING" value="PENDING">
                    Pendente
                  </SelectItem>
                  <SelectItem key="IN_PROGRESS" value="IN_PROGRESS">
                    Em Andamento
                  </SelectItem>
                  <SelectItem key="COMPLETED" value="COMPLETED">
                    Concluído
                  </SelectItem>
                  <SelectItem key="CANCELLED" value="CANCELLED">
                    Cancelado
                  </SelectItem>
                </Select>
              </FilterContainer>
              
              {filteredOrders.length > 0 ? (
                <>
                  <Table 
                    aria-label="Tabela de pedidos por camareira"
                    bottomContent={
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                          total={Math.ceil(filteredOrders.length / rowsPerPage)}
                          page={page}
                          onChange={setPage}
                        />
                      </div>
                    }
                  >
                    <TableHeader>
                      <TableColumn>ID</TableColumn>
                      <TableColumn>Paciente</TableColumn>
                      <TableColumn>Data</TableColumn>
                      <TableColumn>Quarto</TableColumn>
                      <TableColumn>Valor Total</TableColumn>
                      <TableColumn>Status</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {currentPageOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.paciente ? order.paciente.nome : 'N/A'}</TableCell>
                          <TableCell>{formatDate(order.data)}</TableCell>
                          <TableCell>{order.quarto ? order.quarto.numero : 'N/A'}</TableCell>
                          <TableCell>{formatCurrency(order.valorTotal)}</TableCell>
                          <TableCell>
                            <Badge color={STATUS_COLORS[order.status] || 'default'}>
                              {STATUS_LABELS[order.status] || order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <NoData>Nenhum pedido encontrado para os filtros selecionados</NoData>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </Container>
  );
};

export default HousekeepersReport;