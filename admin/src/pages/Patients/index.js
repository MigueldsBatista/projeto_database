import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { patientsService } from '../../services/patientsService';
import { PrimaryButton, SecondaryButton } from '../../styles/GlobalStyles';

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
  background-color: ${props => props.status === 'INTERNADO' ? 'var(--primary-blue)' : 
                               props.status === 'ALTA' ? 'var(--secondary-green)' : 'var(--accent-yellow)'};
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

const ModalContent = styled.div`
  margin-bottom: var(--spacing-md);
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const PatientDetailCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
`;

const PatientDetailSection = styled.div`
  margin-bottom: var(--spacing-md);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PatientDetailTitle = styled.h3`
  font-size: var(--font-h2);
  margin-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-xs);
`;

const PatientDetailRow = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xs);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
`;

const PatientDetailItem = styled.div`
  flex: 1;
`;

const PatientDetailLabel = styled.div`
  font-weight: 500;
  color: var(--text-secondary);
  font-size: var(--font-caption);
`;

const PatientDetailValue = styled.div`
  font-size: var(--font-body);
`;

const StayHistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-sm);
  
  th, td {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--border);
    text-align: left;
  }
  
  thead {
    background-color: var(--primary-blue-light);
    
    th {
      font-weight: 500;
    }
  }
  
  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
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
 * Calcula a idade com base na data de nascimento
 * @param {string} birthDate - Data de nascimento
 * @returns {number} Idade em anos
 */
const calculateAge = (birthDate) => {
  if (!birthDate) return '-';
  
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
  const [isStayHistoryModalOpen, setIsStayHistoryModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [stayHistory, setStayHistory] = useState([]);
  const [loadingStayHistory, setLoadingStayHistory] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await patientsService.getAll();
      setPatients(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter(patient =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  );

  const openPatientDetailsModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const openDischargeModal = (patient) => {
    setSelectedPatient(patient);
    setIsDischargeModalOpen(true);
  };

  const openStayHistoryModal = async (patient) => {
    setSelectedPatient(patient);
    setIsStayHistoryModalOpen(true);
    setLoadingStayHistory(true);
    
    try {
      const history = await patientsService.getStaysHistory(patient.id);
      setStayHistory(history);
      setLoadingStayHistory(false);
    } catch (error) {
      console.error('Erro ao carregar histórico de estadias:', error);
      setStayHistory([]);
      setLoadingStayHistory(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const closeDischargeModal = () => {
    setIsDischargeModalOpen(false);
    setSelectedPatient(null);
  };

  const closeStayHistoryModal = () => {
    setIsStayHistoryModalOpen(false);
    setSelectedPatient(null);
    setStayHistory([]);
  };

  const handleDischarge = async () => {
    try {
      await patientsService.discharge(selectedPatient.id);
      fetchPatients();
      closeDischargeModal();
    } catch (error) {
      console.error('Erro ao dar alta ao paciente:', error);
    }
  };

  if (loading) {
    return <div>Carregando pacientes...</div>;
  }

  return (
    <PageContainer>
      <PageTitle>Gerenciar Pacientes</PageTitle>
      
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Buscar pacientes por nome ou CPF..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </FilterContainer>
      
      <Table>
        <TableHeader>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Idade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </TableHeader>
        <tbody>
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.nome}</TableCell>
                <TableCell>{patient.cpf}</TableCell>
                <TableCell>{formatDate(patient.dataNascimento)}</TableCell>
                <TableCell>{calculateAge(patient.dataNascimento)} anos</TableCell>
                <TableCell>
                  <Badge status={patient.status}>{patient.status}</Badge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <SecondaryButton title="Detalhes" onClick={() => openPatientDetailsModal(patient)}>
                      <i className="fas fa-eye"></i>
                    </SecondaryButton>
                    <SecondaryButton title="Histórico de Estadias" onClick={() => openStayHistoryModal(patient)}>
                      <i className="fas fa-history"></i>
                    </SecondaryButton>
                    {patient.status === 'INTERNADO' && (
                      <PrimaryButton title="Dar Alta" onClick={() => openDischargeModal(patient)}>
                        <i className="fas fa-check-circle"></i>
                      </PrimaryButton>
                    )}
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7" style={{ textAlign: 'center' }}>
                Nenhum paciente encontrado
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
      
      {/* Modal de Detalhes do Paciente */}
      {isModalOpen && selectedPatient && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Detalhes do Paciente</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalContent>
              <PatientDetailCard>
                <PatientDetailSection>
                  <PatientDetailTitle>Informações Pessoais</PatientDetailTitle>
                  <PatientDetailRow>
                    <PatientDetailItem>
                      <PatientDetailLabel>Nome</PatientDetailLabel>
                      <PatientDetailValue>{selectedPatient.nome}</PatientDetailValue>
                    </PatientDetailItem>
                    <PatientDetailItem>
                      <PatientDetailLabel>CPF</PatientDetailLabel>
                      <PatientDetailValue>{selectedPatient.cpf}</PatientDetailValue>
                    </PatientDetailItem>
                  </PatientDetailRow>
                  
                  <PatientDetailRow>
                    <PatientDetailItem>
                      <PatientDetailLabel>Data de Nascimento</PatientDetailLabel>
                      <PatientDetailValue>{formatDate(selectedPatient.dataNascimento)}</PatientDetailValue>
                    </PatientDetailItem>
                    <PatientDetailItem>
                      <PatientDetailLabel>Idade</PatientDetailLabel>
                      <PatientDetailValue>{calculateAge(selectedPatient.dataNascimento)} anos</PatientDetailValue>
                    </PatientDetailItem>
                  </PatientDetailRow>
                  
                  <PatientDetailRow>
                    <PatientDetailItem>
                      <PatientDetailLabel>Telefone</PatientDetailLabel>
                      <PatientDetailValue>{selectedPatient.telefone || '-'}</PatientDetailValue>
                    </PatientDetailItem>
                    <PatientDetailItem>
                      <PatientDetailLabel>Email</PatientDetailLabel>
                      <PatientDetailValue>{selectedPatient.email || '-'}</PatientDetailValue>
                    </PatientDetailItem>
                  </PatientDetailRow>
                </PatientDetailSection>
                
                <PatientDetailSection>
                  <PatientDetailTitle>Endereço</PatientDetailTitle>
                  <PatientDetailRow>
                    <PatientDetailItem>
                      <PatientDetailLabel>Logradouro</PatientDetailLabel>
                      <PatientDetailValue>{selectedPatient.endereco || '-'}</PatientDetailValue>
                    </PatientDetailItem>

                  </PatientDetailRow>
                  

                </PatientDetailSection>
                
                <PatientDetailSection>
                  <PatientDetailTitle>Status</PatientDetailTitle>
                  <PatientDetailRow>
                    <PatientDetailItem>
                      <PatientDetailLabel>Situação Atual</PatientDetailLabel>
                      <PatientDetailValue>
                        <Badge status={selectedPatient.status}>
                          {selectedPatient.status}
                        </Badge>
                      </PatientDetailValue>
                    </PatientDetailItem>
                  </PatientDetailRow>
                </PatientDetailSection>
              </PatientDetailCard>
            </ModalContent>
            <ButtonsContainer>
              <SecondaryButton onClick={closeModal}>
                Fechar
              </SecondaryButton>
            </ButtonsContainer>
          </Modal>
        </ModalBackdrop>
      )}
      
      {/* Modal de Confirmação de Alta */}
      {isDischargeModalOpen && selectedPatient && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Confirmar Alta</ModalTitle>
              <CloseButton onClick={closeDischargeModal}>&times;</CloseButton>
            </ModalHeader>
            <p>
              Tem certeza que deseja dar alta ao paciente <strong>{selectedPatient.nome}</strong>?
              Esta ação irá finalizar a estadia atual do paciente.
            </p>
            <ButtonsContainer>
              <SecondaryButton onClick={closeDischargeModal}>
                Cancelar
              </SecondaryButton>
              <PrimaryButton onClick={handleDischarge}>
                Confirmar Alta
              </PrimaryButton>
            </ButtonsContainer>
          </Modal>
        </ModalBackdrop>
      )}
      
      {/* Modal de Histórico de Estadias */}
      {isStayHistoryModalOpen && selectedPatient && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader>
              <ModalTitle>Histórico de Estadias</ModalTitle>
              <CloseButton onClick={closeStayHistoryModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalContent>
              <p>Paciente: <strong>{selectedPatient.nome}</strong></p>
              
              {loadingStayHistory ? (
                <div>Carregando histórico de estadias...</div>
              ) : (
                <>
                  {stayHistory.length > 0 ? (
                    <StayHistoryTable>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Quarto</th>
                          <th>Data de Entrada</th>
                          <th>Data de Saída</th>
                          <th>Duração (dias)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stayHistory.map(stay => {
                          const entryDate = new Date(stay.dataEntrada);
                          const exitDate = stay.dataSaida ? new Date(stay.dataSaida) : null;
                          const duration = exitDate 
                            ? Math.ceil((exitDate - entryDate) / (1000 * 60 * 60 * 24)) 
                            : 'Em curso';
                            
                          return (
                            <tr key={stay.id}>
                              <td>{stay.id}</td>
                              <td>{stay.quartoNumero || stay.quartoId}</td>
                              <td>{formatDate(stay.dataEntrada)}</td>
                              <td>{formatDate(stay.dataSaida) || 'Ativa'}</td>
                              <td>{duration}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </StayHistoryTable>
                  ) : (
                    <p>Nenhuma estadia encontrada para este paciente.</p>
                  )}
                </>
              )}
            </ModalContent>
            <ButtonsContainer>
              <SecondaryButton onClick={closeStayHistoryModal}>
                Fechar
              </SecondaryButton>
            </ButtonsContainer>
          </Modal>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
};

// Generated by Copilot
export default Patients;