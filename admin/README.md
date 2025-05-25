# Hospital Santa Joana - Painel Administrativo

Este diretório contém o módulo de administração do Hospital Santa Joana, construído com React.

## Como executar o frontend (módulo admin)

### Requisitos
- Node.js (versão 14 ou superior)
- npm (geralmente vem com o Node.js)

### Passos para executar

1. Abra um terminal e navegue até a pasta do módulo admin:
   ```bash
   cd projeto_database/admin
   ```

2. Instale as dependências (apenas na primeira vez ou quando houver atualizações no package.json):
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

4. O aplicativo será aberto automaticamente em seu navegador padrão em:
   http://localhost:3000

   Caso não abra automaticamente, acesse o endereço manualmente.

5. Para parar o servidor, pressione `Ctrl+C` no terminal em que ele está rodando.

## Observações importantes

- O frontend se conecta ao backend por padrão em http://localhost:8080
- Certifique-se de que o backend está rodando (via Docker) se precisar acessar ou modificar dados reais
- As alterações no código são aplicadas automaticamente enquanto o servidor de desenvolvimento está rodando
