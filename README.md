# Hospital Santa Joana - Sistema de Gestão Hospitalar

Bem-vindo ao repositório do sistema de gestão hospitalar do Hospital Santa Joana! Este projeto oferece uma solução completa para gerenciamento de pacientes, pedidos de refeições, faturas, quartos e muito mais, com frontend web moderno e backend robusto.

---

## ✨ Visão Geral

- **Frontend:** SPA responsiva para pacientes, com pedidos de refeições, histórico, faturas e perfil.
- **Backend:** API RESTful em Java Spring Boot, persistência MySQL.
- **Admin:** Painel administrativo (React) para gestão de produtos, categorias, quartos, pacientes, etc.
- **Infraestrutura:** Docker Compose para orquestração de containers.

---

## 🚀 Começando Rápido

### 1. Clone o repositório
```bash
git clone https://github.com/MigueldsBatista/projeto_database.git
cd projeto_database
```

### 2. Suba o backend (API + banco de dados)
```bash
cd santajoana
# Edite o compose.yaml se quiser customizar portas
sudo docker compose up -d
```
Aguarde até o backend estar disponível em http://localhost:8080

### 3. Popule o banco de dados
```bash
mysql -h 127.0.0.1 -P 3307 -u admin -p < populate_database.sql
```
Ou use um client gráfico (DBeaver, MySQL Workbench, etc) e rode o script `populate_database.sql`.

### 4. Inicie o frontend
- **Via Live Server (VS Code):**
  1. Abra a pasta `client/` no VS Code
  2. Clique com o direito em `index.html` > "Abrir com Live Server"
  3. Acesse `http://127.0.0.1:5500/index.html`
- **Via Docker/Nginx:**
  1. Ajuste o `nginx.conf` se necessário
  2. Rode o container conforme instruções do Dockerfile

---

## 🏗️ Estrutura do Projeto

```
projeto_database/
├── santajoana/      # Backend Java Spring Boot + banco
├── client/          # Frontend web (HTML, CSS, JS)
├── admin/           # Painel administrativo (React)
├── populate_database.sql  # Script para popular o banco
├── modelo_fisico.sql      # Modelo físico do banco
└── README.md
```

### Estrutura do Frontend
```
client/
├── css/             # Estilos
├── js/              # Scripts JS
├── img/             # Imagens
├── html/            # Páginas HTML
│   ├── index.html
│   ├── dashboard.html
│   ├── menu.html
│   ├── cart.html
│   ├── orders.html
│   ├── order-details.html
│   ├── invoice.html
│   ├── profile.html
│   └── login.html
└── ...
```

---

## ⚙️ Configuração Detalhada

### Pré-requisitos
- Docker e Docker Compose
- MySQL Client (para popular o banco)
- Visual Studio Code + Live Server (opcional, para frontend)

### Backend
- O backend sobe via Docker Compose e expõe a API em `http://localhost:8080`.
- O banco MySQL roda em `localhost:3307` (veja compose.yaml).
- O script `populate_database.sql` insere dados essenciais (categorias, produtos, pacientes, quartos, etc).

### Frontend
- O frontend espera a API em `http://localhost:8080` (ajuste em `js/utils.js` se necessário).
- Use Live Server ou um servidor web estático para rodar a interface.

### Admin
- O painel admin roda em React (pasta `admin/`).
- Instale dependências e rode com:
```bash
cd admin
npm install
npm start
```

---

## 🧩 Funcionalidades
- Cadastro e login de pacientes
- Pedido de refeições por categoria
- Carrinho de compras
- Histórico e detalhes de pedidos
- Visualização de fatura e status de pagamento
- Perfil do paciente
- Painel admin para gestão de produtos, categorias, quartos, pacientes, faturas, etc

---

## 🛠️ Dicas de Desenvolvimento
- O backend pode demorar alguns segundos para subir completamente.
- Sempre popule o banco antes de testar o frontend.
- Para customizar endpoints ou portas, edite `compose.yaml` e os arquivos de configuração JS.
- O frontend é desacoplado: pode ser servido por qualquer servidor web.

---

## 🐞 Troubleshooting
- **Backend não sobe:** Verifique logs do Docker (`docker compose logs -f`)
- **API não responde:** Confirme se o container está rodando e a porta está correta
- **Frontend não carrega dados:** Veja se a API está acessível em `http://localhost:8080`
- **Problemas de CORS:** Use Live Server ou ajuste o backend para aceitar requisições do frontend
- **Banco vazio:** Rode novamente o script `populate_database.sql`

---

## 📄 Licença
Este projeto é acadêmico e livre para uso e adaptação.

---

## 👨‍💻 Contato
Dúvidas ou sugestões? Abra uma issue ou entre em contato pelo GitHub!
