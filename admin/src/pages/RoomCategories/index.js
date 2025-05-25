import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { roomCategoriesService } from '../../services/roomCategoriesService';
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

const CategoryCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
`;

const CategoryCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
`;

const CategoryName = styled.h2`
  font-size: var(--font-h2);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-sm);
`;

const CategoryDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-body);
  flex-grow: 1;
`;

const CategoryDetail = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
  color: var(--text-secondary);
`;

const CategoryActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
  border-top: 1px solid var(--border);
  padding-top: var(--spacing-md);
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

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 100px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const PriceDetail = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-h2);
  color: var(--primary-blue);
  font-weight: 500;
  margin-top: var(--spacing-sm);
`;

const RoomCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    descricao: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await roomCategoriesService.getAll();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar categorias de quartos:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(category =>
    category.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.descricao && category.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openCreateModal = () => {
    setFormData({
      id: null,
      nome: '',
      descricao: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setFormData({
      id: category.id,
      nome: category.nome,
      descricao: category.descricao || ''
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formattedData = {
        ...formData
      };
      
      if (formData.id) {
        await roomCategoriesService.update(formattedData);
      } else {
        await roomCategoriesService.create(formattedData);
      }
      
      fetchCategories();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar categoria de quarto:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await roomCategoriesService.delete(selectedCategory.id);
      fetchCategories();
      closeDeleteModal();
    } catch (error) {
      console.error('Erro ao excluir categoria de quarto:', error);
    }
  };

  if (loading) {
    return <div>Carregando categorias de quartos...</div>;
  }

  return (
    <PageContainer>
      <PageTitle>Gerenciar Categorias de Quartos</PageTitle>
      
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Buscar categorias..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <PrimaryButton onClick={openCreateModal}>
          <i className="fas fa-plus"></i> Nova Categoria
        </PrimaryButton>
      </FilterContainer>
      
      <CategoryCardGrid>
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <CategoryCard key={category.id}>
              <CategoryName>{category.nome}</CategoryName>
              <CategoryDescription>{category.descricao || 'Sem descrição'}</CategoryDescription>
                            
              <CategoryActions>
                <SecondaryButton onClick={() => openEditModal(category)}>
                  <i className="fas fa-edit"></i> Editar
                </SecondaryButton>
                <DangerButton onClick={() => openDeleteModal(category)}>
                  <i className="fas fa-trash"></i> Excluir
                </DangerButton>
              </CategoryActions>
            </CategoryCard>
          ))
        ) : (
          <div>Nenhuma categoria de quarto encontrada</div>
        )}
      </CategoryCardGrid>
      
      {/* Modal de Criação/Edição de Categoria */}
      {isModalOpen && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>
                {formData.id ? 'Editar Categoria de Quarto' : 'Nova Categoria de Quarto'}
              </ModalTitle>
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
      {isDeleteModalOpen && selectedCategory && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Confirmar Exclusão</ModalTitle>
              <CloseButton onClick={closeDeleteModal}>&times;</CloseButton>
            </ModalHeader>
            <p>
              Tem certeza que deseja excluir a categoria <strong>{selectedCategory.nome}</strong>?
              Esta ação não pode ser desfeita e pode afetar quartos associados a esta categoria.
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
export default RoomCategories;