import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { staysService } from '../../services/staysService';
import { patientsService } from '../../services/patientsService';
import { roomsService } from '../../services/roomsService';
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

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: var(--font-small);
  font-weight: 500;
  background-color: ${props => props.active ? 'var(--primary-blue)' : 'var(--secondary-green)'};
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
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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

const FormRow = styled.div`
  display: flex;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  & > * {
    flex: 1;
  }
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

const InfoContainer = styled.div`
  background-color: var(--primary-blue-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const InfoTitle = styled.h3`
  font-size: var(--font-h3);
  margin-bottom: var(--spacing-xs);
`;

const PatientSearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const PatientSearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid var(--border);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: var(--shadow-md);
`;

const PatientSearchItem = styled.div`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  
  &:hover {
    background-color: var(--primary-blue-light);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ErrorMessage = styled.div`
  color: var(--accent-red);
  font-size: var(--font-caption);
  margin-top: var(--spacing-xs);
`;

const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR');
};

const formatDateForInput = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const Stays = () => {
  const [stays, setStays] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientResults, setPatientResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [isPatientSearchFocused, setIsPatientSearchFocused] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [selectedStay, setSelectedStay] = useState(null);
  const [formData, setFormData] = useState({
    pacienteId: '',
    pacienteNome: '',
    quartoId: '',
    dataSaida: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchStays();
    fetchAvailableRooms();
    fetchAllRooms();
    fetchPatients();
  }, []);

  const fetchStays = async () => {
    try {
      const data = await staysService.getAll();
      setStays(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar estadias:', error);
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const data = await roomsService.getAvailable();
      setAvailableRooms(data);
    } catch (error) {
      console.error('Erro ao carregar quartos disponíveis:', error);
    }
  };

  const fetchAllRooms = async () => {
    try {
      const data = await roomsService.getAll();
      setRooms(data);
    } catch (error) {
      console.error('Erro ao carregar todos os quartos:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await patientsService.getAll();
      setPatients(data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredStays = stays.filter(stay =>
    (stay.pacienteNome && stay.pacienteNome.toLowerCase().includes(searchTerm)) ||
    (stay.quartoNumero && stay.quartoNumero.toString().includes(searchTerm)) ||
    stay.id.toString().includes(searchTerm)
  );

  const openCreateModal = () => {
    setFormData({
      pacienteId: '',
      pacienteNome: '',
      quartoId: '',
      dataSaida: '',
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const openFinishModal = (stay) => {
    setSelectedStay(stay);
    setIsFinishModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setPatientSearchTerm('');
    setPatientResults([]);
  };

  const closeFinishModal = () => {
    setIsFinishModalOpen(false);
    setSelectedStay(null);
  };

  const handlePatientSearch = (e) => {
    const query = e.target.value;
    setPatientSearchTerm(query);
    
    if (query.length >= 2) {
      const results = patients.filter(patient => 
        patient.nome.toLowerCase().includes(query.toLowerCase()) ||
        (patient.cpf && patient.cpf.includes(query))
      );
      setPatientResults(results);
    } else {
      setPatientResults([]);
    }
  };

  const handlePatientSelect = (patient) => {
    setFormData({
      ...formData,
      pacienteId: patient.id,
      pacienteNome: patient.nome
    });
    setPatientSearchTerm(patient.nome);
    setPatientResults([]);
    
    if (formErrors.pacienteId) {
      setFormErrors({
        ...formErrors,
        pacienteId: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.pacienteId) {
      errors.pacienteId = 'Selecione um paciente';
    }
    
    if (!formData.quartoId) {
      errors.quartoId = 'Selecione um quarto';
    }
    

    
    return errors;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const newStay = {
        pacienteId: parseInt(formData.pacienteId),
        quartoId: parseInt(formData.quartoId),
        dataSaida: formData.dataSaida || null
      };
      
      await staysService.create(newStay);
      await fetchStays();
      await fetchAvailableRooms();
      closeCreateModal();
    } catch (error) {
      console.error('Erro ao criar estadia:', error);
    }
  };

  const handleFinishSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await staysService.finishStay(selectedStay);
      await fetchStays();
      await fetchAvailableRooms();
      closeFinishModal();
    } catch (error) {
      console.error('Erro ao finalizar estadia:', error);
    }
  };

  if (loading) {
    return <div>Carregando estadias...</div>;
  }

  return (
    <PageContainer>
      <PageTitle>Gerenciar Estadias</PageTitle>
      
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Buscar estadias por paciente ou quarto..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <PrimaryButton onClick={openCreateModal}>
          <i className="fas fa-plus"></i> Nova Estadia
        </PrimaryButton>
      </FilterContainer>
      
      <Table>
        <TableHeader>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Quarto</th>
            <th>Data de Entrada</th>
            <th>Data de Saída</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </TableHeader>
        <tbody>
          {filteredStays.length > 0 ? (
            filteredStays.map(stay => (
              <TableRow key={stay.id}>
                <TableCell>{stay.id}</TableCell>
                <TableCell>{stay.pacienteNome || `Paciente ID: ${stay.pacienteId}`}</TableCell>
                <TableCell>{stay.quartoNumero || `Quarto ID: ${stay.quartoId}`}</TableCell>
                <TableCell>{formatDate(stay.dataEntrada)}</TableCell>
                <TableCell>{formatDate(stay.dataSaida)}</TableCell>
                <TableCell>
                  <Badge active={!stay.dataSaida}>
                    {stay.dataSaida ? 'Concluída' : 'Ativa'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    {!stay.dataSaida && (
                      <PrimaryButton onClick={() => openFinishModal(stay)}>
                        <i className="fas fa-check-circle"></i> Finalizar
                      </PrimaryButton>
                    )}
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7" style={{ textAlign: 'center' }}>
                Nenhuma estadia encontrada
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
      
      {isCreateModalOpen && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Nova Estadia</ModalTitle>
              <CloseButton onClick={closeCreateModal}>&times;</CloseButton>
            </ModalHeader>
            
            <InfoContainer>
              <InfoTitle>Quartos Disponíveis: {availableRooms.length}</InfoTitle>
              <p>Selecione um paciente e um quarto para criar uma nova estadia.</p>
            </InfoContainer>
            
            <Form onSubmit={handleCreateSubmit}>
              <FormGroup>
                <Label htmlFor="paciente">Paciente</Label>
                <PatientSearchContainer>
                  <Input
                    id="paciente"
                    type="text"
                    placeholder="Buscar paciente por nome ou CPF"
                    value={patientSearchTerm}
                    onChange={handlePatientSearch}
                    onFocus={() => setIsPatientSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsPatientSearchFocused(false), 200)}
                  />
                  {isPatientSearchFocused && patientResults.length > 0 && (
                    <PatientSearchResults>
                      {patientResults.map(patient => (
                        <PatientSearchItem
                          key={patient.id}
                          onClick={() => handlePatientSelect(patient)}
                        >
                          {patient.nome} - CPF: {patient.cpf}
                        </PatientSearchItem>
                      ))}
                    </PatientSearchResults>
                  )}
                </PatientSearchContainer>
                {formData.pacienteId && (
                  <div style={{ marginTop: 'var(--spacing-xs)' }}>
                    <Badge active>Paciente selecionado: {formData.pacienteNome}</Badge>
                  </div>
                )}
                {formErrors.pacienteId && <ErrorMessage>{formErrors.pacienteId}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="quartoId">Quarto</Label>
                <Select
                  id="quartoId"
                  name="quartoId"
                  value={formData.quartoId}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um quarto disponível</option>
                  {availableRooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Quarto {room.numero} - Andar {room.andar}
                    </option>
                  ))}
                </Select>
                {formErrors.quartoId && <ErrorMessage>{formErrors.quartoId}</ErrorMessage>}
              </FormGroup>
              
              
              <ButtonsContainer>
                <SecondaryButton type="button" onClick={closeCreateModal}>
                  Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit">
                  Criar Estadia
                </PrimaryButton>
              </ButtonsContainer>
            </Form>
          </Modal>
        </ModalBackdrop>
      )}
      
      {isFinishModalOpen && selectedStay && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Finalizar Estadia</ModalTitle>
              <CloseButton onClick={closeFinishModal}>&times;</CloseButton>
            </ModalHeader>
            <p>
              Tem certeza que deseja finalizar a estadia do paciente{' '}
              <strong>{selectedStay.pacienteNome || `ID: ${selectedStay.pacienteId}`}</strong>{' '}
              no quarto <strong>{selectedStay.quartoNumero || `ID: ${selectedStay.quartoId}`}</strong>?
            </p>
            <p>
              A data de saída será registrada como hoje ({formatDate(new Date())}).
            </p>
            <ButtonsContainer>
              <SecondaryButton onClick={closeFinishModal}>
                Cancelar
              </SecondaryButton>
              <PrimaryButton onClick={handleFinishSubmit}>
                Confirmar
              </PrimaryButton>
            </ButtonsContainer>
          </Modal>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
};

export default Stays;