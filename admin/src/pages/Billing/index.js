import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { billingService } from '../../services/billingService';
import { PrimaryButton } from '../../styles/GlobalStyles';

const PageContainer = styled.div`
  padding: var(--spacing-md);
`;

const PageTitle = styled.h1`
  font-size: var(--font-h1);
  margin-bottom: var(--spacing-lg);
`;

const FilterContainer = styled.div`
  display: flex;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  min-width: 150px;
`;

const FilterInput = styled.input`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
`;

const CardTitle = styled.h2`
  font-size: var(--font-h2);
  margin-bottom: var(--spacing-md);
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: var(--spacing-lg);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background-color: var(--primary-blue-light);
  
  th {
    padding: var(--spacing-sm);
    text-align: left;
    color: var(--text-primary);
    font-weight: 500;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--primary-blue-light);
  }
`;

const TableCell = styled.td`
  padding: var(--spacing-sm);
`;

const TotalRow = styled(TableRow)`
  font-weight: bold;
  background-color: var(--primary-blue-light);
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const SummaryCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  
  h3 {
    font-size: var(--font-h3);
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
  }
  
  p {
    font-size: var(--font-h2);
    font-weight: 600;
    color: var(--text-primary);
  }
  
  &.highlighted {
    background-color: var(--primary-blue);
    color: white;
    
    h3 {
      color: rgba(255, 255, 255, 0.8);
    }
    
    p {
      color: white;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  text-align: center;
  
  h3 {
    font-size: var(--font-h3);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
  }
`;

/**
 * Formata um valor para o formato de moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado como moeda brasileira
 */
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '-';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata uma data no formato ISO para o formato brasileiro (dd/mm/yyyy)
 * @param {string} isoDate - Data no formato ISO
 * @returns {string} Data no formato brasileiro
 */
const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR');
};

/**
 * Formata uma data no formato ISO para nome do mês
 * @param {string} isoDate - Data no formato ISO
 * @returns {string} Nome do mês
 */
const formatMonth = (isoDate) => {
  if (!isoDate) return '-';
  
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR', { month: 'long' });
};

/**
 * Customiza o tooltip do gráfico de barras
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}>
        <p style={{ margin: 0 }}><strong>{label}</strong></p>
        <p style={{ margin: 0, color: '#3182CE' }}>
          {`Total: ${formatCurrency(payload[0].value)}`}
        </p>
      </div>
    );
  }

  return null;
};

/**
 * Gera o relatório de faturamento
 * @param {Object[]} data - Dados de faturamento
 * @param {string} groupBy - Tipo de agrupamento ('day', 'month', 'year')
 * @returns {Object[]} Dados formatados para exibição no gráfico
 */
const generateReport = (data, groupBy) => {
  if (!data || data.length === 0) return [];

  const groupedData = {};

  data.forEach(item => {
    let key;
    const start = new Date(item.startDate);
    if (groupBy === 'day') {
      key = start.toLocaleDateString('pt-BR');
    } else if (groupBy === 'month') {
      key = `${start.getMonth() + 1}/${start.getFullYear()}`;
    } else if (groupBy === 'year') {
      key = start.getFullYear().toString();
    }
    if (!groupedData[key]) {
      groupedData[key] = {
        period: key,
        total: 0,
        quantity: 0,
        items: []
      };
    }
    groupedData[key].total += item.total;
    groupedData[key].quantity += 1;
    groupedData[key].items.push(item);
  });

  return Object.values(groupedData);
};

const Billing = () => {
  const [billingData, setBillingData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState('day');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 3).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [summaryData, setSummaryData] = useState({
    totalBilling: 0,
    invoiceCount: 0,
    averageBilling: 0
  });

  useEffect(() => {
    fetchBillingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (billingData.length > 0) {
      const filtered = filterDataByDateRange(billingData);
      const report = generateReport(filtered, groupBy);
      setReportData(report);
      
      // Calcular dados de resumo
      const total = report.reduce((sum, item) => sum + item.total, 0);
      const count = report.reduce((sum, item) => sum + item.quantity, 0);
      setSummaryData({
        totalBilling: total,
        invoiceCount: count,
        averageBilling: count > 0 ? total / count : 0
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingData, groupBy, dateRange]);

  const fetchBillingData = async () => {
    try {
      const data = await billingService.getBillingByPeriod(
        dateRange.startDate, 
        dateRange.endDate
      );
      setBillingData(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados de faturamento:', error);
      setLoading(false);
    }
  };

  const handleGroupByChange = (e) => {
    setGroupBy(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchBillingData();
  };

  const filterDataByDateRange = (data) => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);
    return data.filter(item => {
      const itemDate = new Date(item.startDate);
      return itemDate >= start && itemDate <= end;
    });
  };

  // Formatar dados para exibição na tabela por formato de agrupamento
  const getGroupLabel = () => {
    switch (groupBy) {
      case 'day':
        return 'Dia';
      case 'month':
        return 'Mês';
      case 'year':
        return 'Ano';
      default:
        return 'Período';
    }
  };

  if (loading) {
    return <div>Carregando dados de faturamento...</div>;
  }

  return (
    <PageContainer>
      <PageTitle>Faturamento por Período</PageTitle>
      
      <Card>
        <form onSubmit={handleFilterSubmit}>
          <FilterContainer>
            <FilterGroup>
              <FilterLabel htmlFor="startDate">Data Inicial</FilterLabel>
              <FilterInput
                id="startDate"
                name="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={handleDateChange}
                required
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel htmlFor="endDate">Data Final</FilterLabel>
              <FilterInput
                id="endDate"
                name="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={handleDateChange}
                required
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel htmlFor="groupBy">Agrupar por</FilterLabel>
              <FilterSelect
                id="groupBy"
                value={groupBy}
                onChange={handleGroupByChange}
              >
                <option value="day">Dia</option>
                <option value="month">Mês</option>
                <option value="year">Ano</option>
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
              <PrimaryButton type="submit">
                <i className="fas fa-filter"></i> Filtrar
              </PrimaryButton>
            </FilterGroup>
          </FilterContainer>
        </form>
      </Card>
      
      <SummaryCards>
        <SummaryCard className="highlighted">
          <h3>Faturamento Total</h3>
          <p>{formatCurrency(summaryData.totalBilling)}</p>
        </SummaryCard>
        
        <SummaryCard>
          <h3>Número de Faturas</h3>
          <p>{summaryData.invoiceCount}</p>
        </SummaryCard>
        
        <SummaryCard>
          <h3>Valor Médio</h3>
          <p>{formatCurrency(summaryData.averageBilling)}</p>
        </SummaryCard>
      </SummaryCards>
      
      {reportData.length > 0 ? (
        <>
          <Card>
            <CardTitle>Faturamento por {getGroupLabel()}</CardTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis 
                    tickFormatter={(value) => value.toLocaleString('pt-BR')}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="total" name="Faturamento" fill="#3182CE" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
          
          <Card>
            <CardTitle>Detalhamento do Faturamento</CardTitle>
            <Table>
              <TableHeader>
                <tr>
                  <th>{getGroupLabel()}</th>
                  <th>Quantidade de Faturas</th>
                  <th>Total Faturado</th>
                </tr>
              </TableHeader>
              <tbody>
                {reportData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.period}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
                <TotalRow>
                  <TableCell>Total</TableCell>
                  <TableCell>{summaryData.invoiceCount}</TableCell>
                  <TableCell>{formatCurrency(summaryData.totalBilling)}</TableCell>
                </TotalRow>
              </tbody>
            </Table>
          </Card>
        </>
      ) : (
        <Card>
          <EmptyState>
            <h3>Sem dados no período selecionado</h3>
            <p>Tente selecionar um período diferente ou verificar se há faturas registradas no sistema.</p>
          </EmptyState>
        </Card>
      )}
    </PageContainer>
  );
};

// Generated by Copilot
export default Billing;