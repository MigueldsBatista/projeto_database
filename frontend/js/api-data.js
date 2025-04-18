// Hospital Santa Joana API Data
// This file contains sample data structures and endpoints for all entities in the system

const API_URL = 'http://localhost:8080';

const API_DATA = {
    // Endpoints for all entities
    endpoints: {
        pacientes: `${API_URL}/api/pacientes`,
        camareiras: `${API_URL}/api/camareiras`,
        quartos: `${API_URL}/api/quartos`,
        categoriaQuarto: `${API_URL}/api/categoria-quarto`,
        categoriaProduto: `${API_URL}/api/categoria-produto`,
        produtos: `${API_URL}/api/produtos`,
        estadias: `${API_URL}/api/estadias`,
        pedidos: `${API_URL}/api/pedidos`,
        produtoPedidos: `${API_URL}/api/produto-pedidos`,
        faturas: `${API_URL}/api/faturas`,
        metodoPagamento: `${API_URL}/api/metodos-pagamento`
    },

    // Sample data for creating new entities
    samples: {
        // Patient sample
        paciente: {
            nome: "João Silva",
            cpf: "12345678901",
            dataNascimento: "1980-05-15",
            telefone: "11987654321",
            endereco: "Rua das Flores, 123",
            status: "INTERNADO"
        },

        // Camareira (housekeeping) sample
        camareira: {
            nome: "Maria Oliveira",
            cpf: "98765432101",
            dataNascimento: "1990-10-25",
            telefone: "11912345678",
            endereco: "Av. Principal, 456",
            cre: "CRE123456",
            cargo: "Camareira",
            setor: "Limpeza"
        },

        // Quarto (room) sample
        quarto: {
            numero: 101,
            idCategoriaQuarto: 1
        },

        // Room category sample
        categoriaQuarto: {
            nome: "Luxo",
            descricao: "Quarto com vista para o mar"
        },

        // Product category sample
        categoriaProduto: {
            nome: "Refeições",
            descricao: "Refeições completas"
        },

        // Product sample
        produto: {
            nome: "Café da Manhã",
            descricao: "Café, pão, manteiga, queijo e presunto",
            preco: 25.90,
            tempoPreparoMinutos: 15,
            categoriaId: 1,
            caloriasKcal: 450,
            proteinasG: 15,
            carboidratosG: 60,
            gordurasG: 12,
            sodioMg: 800
        },

        // Stay record sample
        estadia: {
            idPaciente: 1,
            quartoId: 1
        },

        // Order sample
        pedido: {
            dataEntradaEstadia: "2023-10-25T08:30:00",
            camareiraId: 1,
            status: "PENDENTE"
        },

        // Order-Product relationship sample
        produtoPedido: {
            idProduto: 1,
            dataPedido: "2023-10-25T08:45:00",
            quantidade: 2
        },

        // Invoice sample
        fatura: {
            dataEntradaEstadia: "2023-10-25T08:30:00",
            statusPagamento: "PENDENTE",
            valorTotal: 289.90,
            metodoPagamentoId: 1
        },

        // Payment method sample
        metodoPagamento: {
            tipo: "Cartão de Crédito"
        }
    },

    // Status enumerations
    enums: {
        statusPaciente: ["INTERNADO", "ALTA"],
        statusPedido: ["PENDENTE", "EM_PREPARO", "ENTREGUE", "CANCELADO"],
        statusPagamento: ["PENDENTE", "PAGO"]
    },

    // Helper functions for frontend data handling
    helpers: {
        // Format a date to the Brazilian format DD/MM/YYYY
        formatDate: (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        },
        
        // Format currency to Brazilian Real format
        formatCurrency: (value) => {
            return value.toFixed(2).replace('.', ',');
        },
        
        // Get status display text
        getStatusText: (status, type) => {
            const statusMap = {
                paciente: {
                    'INTERNADO': 'Internado',
                    'ALTA': 'Alta'
                },
                pedido: {
                    'PENDENTE': 'Pendente',
                    'EM_PREPARO': 'Em Preparo',
                    'ENTREGUE': 'Entregue', 
                    'CANCELADO': 'Cancelado'
                },
                pagamento: {
                    'PENDENTE': 'Pendente',
                    'PAGO': 'Pago'
                }
            };
            
            return statusMap[type][status] || status;
        }
    },
    
    // API calling functions using fetch
    api: {
        // General GET function
        get: async (endpoint) => {
            try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    mode: 'cors'
                });
                
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
                throw error;
            }
        },
        
        // General POST function
        post: async (endpoint, data) => {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error(`Error posting data to ${endpoint}:`, error);
                throw error;
            }
        },
        
        // General PUT function
        put: async (endpoint, data) => {
            try {
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error(`Error updating data at ${endpoint}:`, error);
                throw error;
            }
        },
        
        // General DELETE function
        delete: async (endpoint) => {
            try {
                const response = await fetch(endpoint, {
                    method: 'DELETE',
                    mode: 'cors'
                });
                
                if (!response.ok) throw new Error('Network response was not ok');
                return true;
            } catch (error) {
                console.error(`Error deleting data at ${endpoint}:`, error);
                throw error;
            }
        }
    }
};

// Example usage:
// Get all patients
// API_DATA.api.get(API_DATA.endpoints.pacientes)
//   .then(patients => console.log(patients))
//   .catch(error => console.error(error));

// Create a new patient
// API_DATA.api.post(API_DATA.endpoints.pacientes, API_DATA.samples.paciente)
//   .then(newPatient => console.log(newPatient))
//   .catch(error => console.error(error));