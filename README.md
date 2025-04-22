# Hospital Santa Joana - Aplicação Frontend

## Visão Geral
Este repositório contém a aplicação web frontend para o portal de serviços a pacientes do Hospital Santa Joana. A aplicação fornece aos pacientes internados uma maneira conveniente de pedir refeições, visualizar suas faturas, acompanhar pedidos e gerenciar seus perfis.

## Requisitos de Configuração

### Pré-requisitos
- [Visual Studio Code](https://code.visualstudio.com/) (editor recomendado)
- [Extensão Live Server para VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- [Docker](https://www.docker.com/get-started) (para o backend)
- [Docker Compose](https://docs.docker.com/compose/install/) (para o backend)

### Clonando o Repositório
1. Abra um terminal e navegue até o diretório onde você deseja clonar o projeto
2. Execute o comando:
   ```bash
   git clone https://github.com/MigueldsBatista/projeto_database.git
   ```
3. Navegue para a pasta do projeto clonado:
   ```bash
   cd projeto_database
   ```

### Configuração do Backend
O frontend se conecta a uma API backend que precisa estar em execução primeiro. Siga estas etapas para iniciar o backend:

1. Navegue até o diretório backend:
   ```bash
   cd backend
   ```

2. Construa e inicie os contêineres Docker:
   ```bash
   docker-compose up -d
   ```

3. Verifique se o backend está em execução:
   - Acesse `http://localhost:8080` no seu navegador
   - Você deve ver a documentação da API ou uma página de boas-vindas
   - Se mostrar "Connection refused", aguarde um minuto, pois os contêineres podem ainda estar iniciando

### Populando o Banco de Dados
**IMPORTANTE**: É necessário popular o banco de dados antes de usar a aplicação devido a regras de negócio específicas:

1. O sistema possui uma regra que exige quartos disponíveis para criar novas estadias de pacientes
2. Execute o script de população do banco de dados:
   ```bash
   mysql -h 127.0.0.1 -P 3307 -u admin -p < populate_database.sql
   ```
   Ou conecte-se ao banco de dados usando uma ferramenta como MySQL Workbench, DBeaver ou HeidiSQL e execute o conteúdo do arquivo `populate_database.sql`
3. O script vai inserir:
   - Categorias de quartos e produtos
   - Quartos disponíveis para internação
   - Pacientes cadastrados para teste
   - Produtos para o cardápio
   - Dados de exemplo para pedidos, faturas, etc.

### Configuração do Frontend

#### Usando o Live Server (Recomendado)
1. Abra a pasta frontend no Visual Studio Code:
   ```bash
   code frontend
   ```

2. Instale a extensão Live Server se ainda não estiver instalada:
   - Vá para Extensões (Ctrl+Shift+X)
   - Pesquise por "Live Server"
   - Clique em Instalar na extensão por Ritwick Dey

3. Inicie o Live Server:
   - Clique com o botão direito em `index.html`
   - Selecione "Abrir com Live Server"
   - Ou clique no botão "Go Live" na barra de status inferior

4. A aplicação deve abrir em seu navegador padrão em `127.0.0.1:5500/index.html`

#### Usando Outro Servidor Web
Se você preferir usar outro servidor web (como Apache ou Nginx), basta copiar o conteúdo da pasta frontend para o diretório web do seu servidor.

## Configuração da API

O frontend está configurado para se conectar a uma API backend em `http://localhost:8080`. Se seu backend estiver rodando em uma porta ou URL diferente, você precisará atualizar isso em:

```javascript
// js/utils.js
const API_URL = 'http://localhost:8080';
```

## Fluxo de Desenvolvimento

1. Certifique-se de que o backend está rodando via Docker
2. Inicie o frontend usando o Live Server
3. Comece o desenvolvimento - o Live Server atualizará automaticamente quando os arquivos forem modificados

## Estrutura de Diretórios
```
frontend/
├── css/             # Arquivos de estilo
├── js/              # Arquivos JavaScript
├── img/             # Recursos de imagem
├── index.html       # Ponto de entrada
├── dashboard.html   # Painel do paciente
├── menu.html        # Cardápio de alimentos
├── cart.html        # Carrinho de compras
├── orders.html      # Histórico de pedidos
├── order-details.html  # Detalhes do pedido
├── invoice.html     # Fatura do paciente
├── profile.html     # Perfil do usuário
└── login.html       # Página de autenticação
```
