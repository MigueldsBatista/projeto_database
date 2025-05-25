import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { roomsService } from '../../services/roomsService';
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
`;

const RoomCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  position: relative;
  border-left: 5px solid ${props => props.isAvailable ? 'var(--secondary-green)' : 'var(--accent-red)'};
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const RoomNumber = styled.h2`
  font-size: var(--font-h2);
  color: var(--text-primary);
  margin: 0;
`;

const RoomStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: var(--font-small);
  font-weight: 500;
  background-color: ${props => props.isAvailable ? 'var(--secondary-green)' : 'var(--accent-red)'};
  color: white;
`;

const RoomDetail = styled.div`
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: var(--font-caption);
`;

const RoomActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
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

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    numero: '',
    andar: '',
    categoriaId: '',
    disponivel: true
  });

  useEffect(() => {
    fetchRooms();
    fetchCategories();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await roomsService.getAll();
      setRooms(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await roomCategoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias de quartos:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRooms = rooms.filter(room =>
    room.numero.toString().includes(searchTerm) ||
    room.andar.toString().includes(searchTerm)
  );

  const openCreateModal = () => {
    setFormData({
      id: null,
      numero: '',
      andar: '',
      categoriaId: categories.length > 0 ? categories[0].id : '',
      disponivel: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setFormData({
      id: room.id,
      numero: room.numero,
      andar: room.andar,
      categoriaId: room.categoriaId,
      disponivel: room.disponivel
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRoom(null);
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
        numero: parseInt(formData.numero),
        andar: parseInt(formData.andar),
        categoriaId: parseInt(formData.categoriaId)
      };
      
      if (formData.id) {
        await roomsService.update(formattedData);
      } else {
        await roomsService.create(formattedData);
      }
      
      fetchRooms();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar quarto:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await roomsService.delete(selectedRoom.id);
      fetchRooms();
      closeDeleteModal();
    } catch (error) {
      console.error('Erro ao excluir quarto:', error);
    }
  };

  if (loading) {
    return <div>Carregando quartos...</div>;
  }

  return (
    <PageContainer>
      <PageTitle>Gerenciar Quartos</PageTitle>
      
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Buscar quartos por número ou andar..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <PrimaryButton onClick={openCreateModal}>
          <i className="fas fa-plus"></i> Novo Quarto
        </PrimaryButton>
      </FilterContainer>
      
      <CardGrid>
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => {
            const category = categories.find(c => c.id === room.categoriaId);
            return (
              <RoomCard key={room.id} isAvailable={room.disponivel}>
                <RoomHeader>
                  <RoomNumber>Quarto {room.numero}</RoomNumber>
                  <RoomStatus isAvailable={room.disponivel}>
                    {room.disponivel ? 'Disponível' : 'Ocupado'}
                  </RoomStatus>
                </RoomHeader>
                
                <RoomDetail>
                  <i className="fas fa-building"></i>
                  <span>Andar: {room.andar}</span>
                </RoomDetail>
                
                <RoomDetail>
                  <i className="fas fa-door-open"></i>
                  <span>Categoria: {category ? category.nome : 'Não definida'}</span>
                </RoomDetail>
                
                <RoomActions>
                  <SecondaryButton onClick={() => openEditModal(room)}>
                    <i className="fas fa-edit"></i>
                  </SecondaryButton>
                  <DangerButton onClick={() => openDeleteModal(room)}>
                    <i className="fas fa-trash"></i>
                  </DangerButton>
                </RoomActions>
              </RoomCard>
            );
          })
        ) : (
          <div>Nenhum quarto encontrado</div>
        )}
      </CardGrid>
      
      {/* Modal de Criação/Edição de Quarto */}
      {isModalOpen && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>{formData.id ? 'Editar Quarto' : 'Novo Quarto'}</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="numero">Número do Quarto</Label>
                <Input
                  id="numero"
                  name="numero"
                  type="number"
                  value={formData.numero}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="andar">Andar</Label>
                <Input
                  id="andar"
                  name="andar"
                  type="number"
                  value={formData.andar}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="categoriaId">Categoria do Quarto</Label>
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
                <Label>
                  <input
                    type="checkbox"
                    name="disponivel"
                    checked={formData.disponivel}
                    onChange={handleInputChange}
                  />
                  {' '}Quarto disponível
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
      {isDeleteModalOpen && selectedRoom && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Confirmar Exclusão</ModalTitle>
              <CloseButton onClick={closeDeleteModal}>&times;</CloseButton>
            </ModalHeader>
            <p>
              Tem certeza que deseja excluir o quarto <strong>{selectedRoom.numero}</strong>?
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
export default Rooms;