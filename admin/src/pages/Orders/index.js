import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ordersService } from '../../services/pedidosService';
import { housekeepersService } from '../../services/housekeepersService';
import { PrimaryButton, SecondaryButton, DangerButton } from '../../styles/GlobalStyles';
import { staysService } from '../../services/staysService';

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

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  flex: 1;
  min-width: 200px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  min-width: 150px;
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

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: var(--font-small);
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'PENDENTE':
        return 'var(--accent-yellow)';
      case 'ENTREGUE':
        return 'var(--secondary-green)';
      case 'EM PREPARO':
        return 'var(--primary-blue)';
      case 'CANCELADO':
        return 'var(--accent-red)';
      default:
        return 'var(--text-secondary)';
    }
  }};
  color: white;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  width: 500px;
  max-width: 90%;
  box-shadow: var(--shadow-lg);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ModalTitle = styled.h2`
  font-size: var(--font-h2);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-secondary);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const OrderDetailsContainer = styled.div`
  margin-bottom: var(--spacing-md);
`;

const OrderDetailTitle = styled.h3`
  font-size: var(--font-h3);
  margin-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-xs);
`;

const OrderDetailRow = styled.div`
  display: flex;
  margin-bottom: var(--spacing-xs);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OrderDetailLabel = styled.div`
  font-weight: 500;
  width: 150px;
  color: var(--text-secondary);
`;

const OrderDetailValue = styled.div`
  flex-grow: 1;
`;

const OrderItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-sm);
  
  th, td {
    padding: var(--spacing-xs);
    border: 1px solid var(--border);
    text-align: left;
  }
  
  thead {
    background-color: var(--primary-blue-light);
  }
  
  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border);
`;

const Tab = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-bottom: ${props => props.active ? '3px solid var(--primary-blue)' : 'none'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  color: ${props => props.active ? 'var(--primary-blue)' : 'var(--text-secondary)'};
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-blue-light);
  }
`;

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
 * Traduz o status do pedido para português
 * @param {string} status - Status em formato de constante
 * @returns {string} Status traduzido
 */
const translateOrderStatus = (status) => {
  switch (status) {
    case 'PENDENTE':
      return 'Pendente';
    case 'EM PREPARO':
      return 'Em Andamento';
    case 'ENTREGUE':
      return 'Concluído';
    case 'CANCELADO':
      return 'Cancelado';
    default:
      return status;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    camareiraId: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchHousekeepers();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await ordersService.getAll();
      const mapped = await Promise.all(
        data.map(async order => {
          const estadia = await staysService.getById(order.dataEntradaEstadia);
          
          let camareira = { nome: null };
          if (order.camareiraId && order.camareiraId !== 0) {
            camareira = await housekeepersService.getById(order.camareiraId);
          }
          
          console.log('estadia', estadia);
          console.log('camareira', camareira);
          
          return {
            ...order,
            pacienteNome: estadia.pacienteNome,
            quartoNumero: estadia.quartoNumero,
            camareiraNome: camareira.nome,
          };
        })
      );
      console.log('mapped', mapped);
      setOrders(mapped);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setLoading(false);
    }
  };
  const fetchHousekeepers = async () => {
    try {
      const data = await housekeepersService.getAll();
      setHousekeepers(data);
    } catch (error) {
      console.error('Erro ao carregar camareiras:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' ||
      (order.pacienteNome && order.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    
    let matchesTab = true;
    if (currentTab === 'withHousekeeper') {
      matchesTab = order.camareiraId !== null && order.camareiraId !== 0;
    } else if (currentTab === 'withoutHousekeeper') {
      matchesTab = order.camareiraId === null || order.camareiraId === 0;
    }
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setFormData({
      ...formData,
      status: order.status
    });
    setIsStatusModalOpen(true);
  };

  const openAssignModal = (order) => {
    setSelectedOrder(order);
    setFormData({
      ...formData,
      camareiraId: order.camareiraId || ''
    });
    setIsAssignModalOpen(true);
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedOrder(null);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedOrder(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await ordersService.updateStatus(selectedOrder.id, formData.status);
      await fetchOrders();
      closeStatusModal();
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await ordersService.assignHousekeeper({
        ...selectedOrder,
        camareiraId: formData.camareiraId ? parseInt(formData.camareiraId) : null
      });
      await fetchOrders();
      closeAssignModal();
    } catch (error) {
      console.error('Erro ao associar camareira ao pedido:', error);
    }
  };

  if (loading) {
    return <div>Carregando pedidos...</div>;
  }

  return (
    <PageContainer>
      <PageTitle>Gerenciar Pedidos</PageTitle>
      
      <TabsContainer>
        <Tab 
          active={currentTab === 'all'} 
          onClick={() => handleTabChange('all')}
        >
          Todos os Pedidos
        </Tab>
        <Tab 
          active={currentTab === 'withHousekeeper'} 
          onClick={() => handleTabChange('withHousekeeper')}
        >
          Com Camareira
        </Tab>
        <Tab 
          active={currentTab === 'withoutHousekeeper'} 
          onClick={() => handleTabChange('withoutHousekeeper')}
        >
          Sem Camareira

        </Tab>
      </TabsContainer>
      
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Buscar pedidos por paciente ou ID..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="">Todos os Status</option>
          <option value="Pendente">Pendentes</option>
          <option value="Em Preparo">Em Preparo</option>
          <option value="Entregue">Concluídos</option>
          <option value="Cancelado">Cancelados</option>
        </FilterSelect>
      </FilterContainer>
      
      <Table>
        <TableHeader>
          <tr>
            <th>Paciente</th>
            <th>Quarto</th>
            <th>Data do Pedido</th>
            <th>Status</th>
            <th>Camareira</th>
            <th>Ações</th>
          </tr>
        </TableHeader>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.pacienteNome || `ID: ${order.pacienteId}`}</TableCell>
                <TableCell>{order.quartoNumero || `ID: ${order.quartoId}`}</TableCell>
                <TableCell>{formatDate(order.id)}</TableCell>
                <TableCell>
                  <Badge status={order.status}>
                    {translateOrderStatus(order.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.camareiraNome || (order.camareiraId ? `ID: ${order.camareiraId}` : '-')}
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <SecondaryButton title="Ver Detalhes" onClick={() => openViewModal(order)}>
                      <i className="fas fa-eye"></i>
                    </SecondaryButton>
                    <PrimaryButton title="Atualizar Status" onClick={() => openStatusModal(order)}>
                      <i className="fas fa-clock"></i>
                    </PrimaryButton>
                    <PrimaryButton title="Associar Camareira" onClick={() => openAssignModal(order)}>
                      <i className="fas fa-user-plus"></i>
                    </PrimaryButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7" style={{ textAlign: 'center' }}>
                Nenhum pedido encontrado
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
      
      {/* Modal de Atualização de Status */}
      {isStatusModalOpen && selectedOrder && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Atualizar Status do Pedido</ModalTitle>
              <CloseButton onClick={closeStatusModal}>&times;</CloseButton>
            </ModalHeader>
            <p>
              Pedido #{selectedOrder.id} - {selectedOrder.pacienteNome || `ID: ${selectedOrder.pacienteId}`}
            </p>
            <Form onSubmit={handleStatusSubmit}>
              <FormGroup>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM PREPARO">Em Preparo</option>
                  <option value="ENTREGUE">Concluído</option>
                  <option value="CANCELADO">Cancelado</option>
                </Select>
              </FormGroup>
              <ButtonsContainer>
                <SecondaryButton type="button" onClick={closeStatusModal}>
                  Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit">
                  Salvar
                </PrimaryButton>
              </ButtonsContainer>
            </Form>
          </Modal>
        </ModalBackdrop>
      )}
      
      {/* Modal de Associação de Camareira */}
      {isAssignModalOpen && selectedOrder && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Associar Camareira ao Pedido</ModalTitle>
              <CloseButton onClick={closeAssignModal}>&times;</CloseButton>
            </ModalHeader>
            <p>
              Pedido #{selectedOrder.id} - {selectedOrder.pacienteNome || `ID: ${selectedOrder.pacienteId}`}
            </p>
            <Form onSubmit={handleAssignSubmit}>
              <FormGroup>
                <Label htmlFor="camareiraId">Camareira</Label>
                <Select
                  id="camareiraId"
                  name="camareiraId"
                  value={formData.camareiraId}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione uma camareira</option>
                  {housekeepers.map(housekeeper => (
                    <option key={housekeeper.id} value={housekeeper.id}>
                      {housekeeper.nome}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <ButtonsContainer>
                <SecondaryButton type="button" onClick={closeAssignModal}>
                  Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit">
                  Salvar
                </PrimaryButton>
              </ButtonsContainer>
            </Form>
          </Modal>
        </ModalBackdrop>
      )}
      
      {/* Modal de Visualização de Detalhes do Pedido */}
      {isViewModalOpen && selectedOrder && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Detalhes do Pedido</ModalTitle>
              <CloseButton onClick={closeViewModal}>&times;</CloseButton>
            </ModalHeader>
            
            <OrderDetailsContainer>
              <OrderDetailTitle>Informações Gerais</OrderDetailTitle>
              
              <OrderDetailRow>
                <OrderDetailLabel>Pedido #</OrderDetailLabel>
                <OrderDetailValue>{selectedOrder.id}</OrderDetailValue>
              </OrderDetailRow>
              
              <OrderDetailRow>
                <OrderDetailLabel>Data</OrderDetailLabel>
                <OrderDetailValue>{formatDate(selectedOrder.id)}</OrderDetailValue>
              </OrderDetailRow>
              
              <OrderDetailRow>
                <OrderDetailLabel>Status</OrderDetailLabel>
                <OrderDetailValue>
                  <Badge status={selectedOrder.status}>
                    {translateOrderStatus(selectedOrder.status)}
                  </Badge>
                </OrderDetailValue>
              </OrderDetailRow>
            </OrderDetailsContainer>
            
            <OrderDetailsContainer>
              <OrderDetailTitle>Paciente e Quarto</OrderDetailTitle>
              
              <OrderDetailRow>
                <OrderDetailLabel>Paciente</OrderDetailLabel>
                <OrderDetailValue>
                  {selectedOrder.pacienteNome || `ID: ${selectedOrder.pacienteId}`}
                </OrderDetailValue>
              </OrderDetailRow>
              
              <OrderDetailRow>
                <OrderDetailLabel>Quarto</OrderDetailLabel>
                <OrderDetailValue>
                  {selectedOrder.quartoNumero || `ID: ${selectedOrder.quartoId}`}
                </OrderDetailValue>
              </OrderDetailRow>
            </OrderDetailsContainer>
            
            <OrderDetailsContainer>
              <OrderDetailTitle>Camareira</OrderDetailTitle>
              
              <OrderDetailRow>
                <OrderDetailLabel>Responsável</OrderDetailLabel>
                <OrderDetailValue>
                  {selectedOrder.camareiraNome || 
                   (selectedOrder.camareiraId ? `ID: ${selectedOrder.camareiraId}` : 'Não atribuída')}
                </OrderDetailValue>
              </OrderDetailRow>
            </OrderDetailsContainer>
            
            {selectedOrder.produtos && selectedOrder.produtos.length > 0 && (
              <OrderDetailsContainer>
                <OrderDetailTitle>Produtos</OrderDetailTitle>
                <OrderItemsTable>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço Unit.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.produtos.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nomeProduto || `ID: ${item.produtoId}`}</td>
                        <td>{item.quantidade}</td>
                        <td>{formatCurrency(item.preco)}</td>
                        <td>{formatCurrency(item.quantidade * item.preco)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                      <td style={{ fontWeight: 'bold' }}>
                        {formatCurrency(selectedOrder.produtos.reduce((sum, item) => 
                          sum + (item.quantidade * item.preco), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </OrderItemsTable>
              </OrderDetailsContainer>
            )}
            
            {selectedOrder.observacao && (
              <OrderDetailsContainer>
                <OrderDetailTitle>Observações</OrderDetailTitle>
                <p>{selectedOrder.observacao}</p>
              </OrderDetailsContainer>
            )}
            
            <ButtonsContainer>
              <SecondaryButton onClick={closeViewModal}>
                Fechar
              </SecondaryButton>
              <PrimaryButton onClick={() => {
                closeViewModal();
                openStatusModal(selectedOrder);
              }}>
                Atualizar Status
              </PrimaryButton>
              <PrimaryButton onClick={() => {
                closeViewModal();
                openAssignModal(selectedOrder);
              }}>
                Associar Camareira
              </PrimaryButton>
            </ButtonsContainer>
          </Modal>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
};

// Generated by Copilot
export default Orders;