import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { productsService } from '../../services/productsService';
import { productCategoriesService } from '../../services/productCategoriesService';
import { PrimaryButton, SecondaryButton, DangerButton } from '../../styles/GlobalStyles';

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
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  flex: 1;
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

const Input = styled.input`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 80px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const Status = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: var(--font-small);
  font-weight: 500;
  background-color: ${props => props.isActive ? 'var(--secondary-green)' : 'var(--accent-red)'};
  color: white;
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    descricao: '',
    preco: '',
    categoriaId: '',
    ativo: true,
    tempoPreparoMinutos: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productCategoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setFormData({
      id: null,
      nome: '',
      descricao: '',
      preco: '',
      categoriaId: categories.length > 0 ? categories[0].id : '',
      ativo: true,
      tempoPreparoMinutos: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      id: product.id,
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco,
      categoriaId: product.categoriaId,
      ativo: product.ativo,
      tempoPreparoMinutos: product.tempoPreparoMinutos || ''
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        preco: parseFloat(formData.preco),
        categoriaId: parseInt(formData.categoriaId),
        tempoPreparoMinutos: formData.tempoPreparoMinutos ? parseInt(formData.tempoPreparoMinutos) : null
      };
      if (formData.id) {
        await productsService.update(formattedData);
      } else {
        await productsService.create(formattedData);
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await productsService.delete(selectedProduct.id);
      fetchProducts();
      closeDeleteModal();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  if (loading) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <PageContainer>
      <PageTitle>Gerenciar Produtos</PageTitle>
      
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <PrimaryButton onClick={openCreateModal}>
          <i className="fas fa-plus"></i> Novo Produto
        </PrimaryButton>
      </FilterContainer>
      
      <Table>
        <TableHeader>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Tempo Preparo (min)</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </TableHeader>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.nome}</TableCell>
                <TableCell>{product.descricao}</TableCell>
                <TableCell>R$ {product.preco.toFixed(2)}</TableCell>
                <TableCell>
                  {categories.find(cat => cat.id === product.categoriaId)?.nome || 'Sem categoria'}
                </TableCell>
                <TableCell>{product.tempoPreparoMinutos ?? '-'}</TableCell>
                <TableCell>
                  <Status isActive={product.ativo}>
                    {product.ativo ? 'Ativo' : 'Inativo'}
                  </Status>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <SecondaryButton onClick={() => openEditModal(product)}>
                      <i className="fas fa-edit"></i>
                    </SecondaryButton>
                    <DangerButton onClick={() => openDeleteModal(product)}>
                      <i className="fas fa-trash"></i>
                    </DangerButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="8" style={{ textAlign: 'center' }}>
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
      
      {/* Modal de Criação/Edição de Produto */}
      {isModalOpen && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>{formData.id ? 'Editar Produto' : 'Novo Produto'}</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="descricao">Descrição</Label>
                <TextArea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  name="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="categoriaId">Categoria</Label>
                <Select
                  id="categoriaId"
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.nome}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="tempoPreparoMinutos">Tempo de Preparo (minutos)</Label>
                <Input
                  id="tempoPreparoMinutos"
                  name="tempoPreparoMinutos"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.tempoPreparoMinutos}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    name="ativo"
                    checked={formData.ativo}
                    onChange={handleInputChange}
                  />
                  {' '}Produto ativo
                </Label>
              </FormGroup>
              <ButtonsContainer>
                <SecondaryButton type="button" onClick={closeModal}>
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
      
      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && selectedProduct && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Confirmar Exclusão</ModalTitle>
              <CloseButton onClick={closeDeleteModal}>&times;</CloseButton>
            </ModalHeader>
            <p>
              Tem certeza que deseja excluir o produto <strong>{selectedProduct.nome}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <ButtonsContainer>
              <SecondaryButton onClick={closeDeleteModal}>
                Cancelar
              </SecondaryButton>
              <DangerButton onClick={handleDelete}>
                Excluir
              </DangerButton>
            </ButtonsContainer>
          </Modal>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
};

// Generated by Copilot
export default Products;