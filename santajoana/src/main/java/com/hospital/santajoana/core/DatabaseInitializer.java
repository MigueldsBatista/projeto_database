package com.hospital.santajoana.core;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer {

    @Autowired
    private final JdbcTemplate jdbcTemplate;
    
    @Autowired
    private final DataSource dataSource;
    
    @Value("${database.recreate-tables:false}")
    private boolean recreateTables;

    private boolean isH2Database() {
        try (Connection connection = dataSource.getConnection()) {
            String dbProductName = connection.getMetaData().getDatabaseProductName().toLowerCase();
            return dbProductName.contains("h2");
        } catch (SQLException e) {
            System.err.println("Error detecting database type: " + e.getMessage());
            return false;
        }
    }

    public void dropTables() {
        String[] dropStatements = {
            "DROP TABLE IF EXISTS PRODUTO_PEDIDO;",
            "DROP TABLE IF EXISTS PEDIDO;",
            "DROP TABLE IF EXISTS FATURA;",
            "DROP TABLE IF EXISTS ESTADIA;",
            "DROP TABLE IF EXISTS PACIENTE;",
            "DROP TABLE IF EXISTS CAMAREIRA;",
            "DROP TABLE IF EXISTS QUARTO;",
            "DROP TABLE IF EXISTS PRODUTO;",
            "DROP TABLE IF EXISTS METODO_PAGAMENTO;",
            "DROP TABLE IF EXISTS TELEFONE_PESSOA;",
            "DROP TABLE IF EXISTS PESSOA;",
            "DROP TABLE IF EXISTS CATEGORIA_QUARTO;",
            "DROP TABLE IF EXISTS CATEGORIA_PRODUTO;",
            "DROP TABLE IF EXISTS PEDIDO_REALIZADO;",
            "DROP TABLE IF EXISTS ENFERMEIRO_QUARTO_PERIODO;"
        };

        for (String sql : dropStatements) {
            try {
                jdbcTemplate.execute(sql);
            } catch (Exception e) {
                System.err.println("Error dropping tables: " + e.getMessage());
            }
        }
    }

    public void createTables() {
        boolean isH2 = isH2Database();
        System.out.println("Detected database type: " + (isH2 ? "H2" : "MySQL"));
        // Create tables first
        String[] createTableStatements = generateCreateTableStatements(isH2);
        // Execute all table creation statements
        for (String sql : createTableStatements) {
            try {
                jdbcTemplate.execute(sql);
            } catch (Exception e) {
                System.err.println("Error creating tables: " + e.getMessage());
                System.err.println("SQL statement: " + sql);
            }
        }
        // Add procedure creation for MySQL only
        if (!isH2) {
            try {
                jdbcTemplate.execute("DROP PROCEDURE IF EXISTS atualizar_valor_fatura");
                String procedure = "CREATE PROCEDURE atualizar_valor_fatura(IN data_pedido_param DATETIME(6)) " +
                        "BEGIN " +
                        "DECLARE data_estadia DATETIME(6); " +
                        "SELECT DATA_ENTRADA_ESTADIA INTO data_estadia FROM PEDIDO WHERE DATA_PEDIDO = data_pedido_param; " +
                        "IF data_estadia IS NOT NULL THEN " +
                        "  UPDATE FATURA SET VALOR_TOTAL = ( " +
                        "    SELECT COALESCE(SUM(pp.QUANTIDADE * p.PRECO), 0) " +
                        "    FROM PRODUTO_PEDIDO pp " +
                        "    JOIN PRODUTO p ON pp.ID_PRODUTO = p.ID_PRODUTO " +
                        "    JOIN PEDIDO pe ON pp.DATA_PEDIDO = pe.DATA_PEDIDO " +
                        "    WHERE pe.DATA_ENTRADA_ESTADIA = data_estadia " +
                        "  ) WHERE DATA_ENTRADA_ESTADIA = data_estadia; " +
                        "END IF; " +
                        "END";
                jdbcTemplate.execute(procedure);
                System.out.println("Procedure atualizar_valor_fatura created or replaced.");
            } catch (Exception e) {
                System.err.println("Error creating procedure atualizar_valor_fatura: " + e.getMessage());
            }
        }
    }

    private String[] generateCreateTableStatements(boolean isH2) {
        // For different database references - we'll use consistent column names now
        String categoriaQuartoIdCol = "ID_CATEGORIA";
        String categoriaProdutoIdCol = "ID_CATEGORIA";
        String datetimeType = isH2 ? "TIMESTAMP" : "DATETIME(6)";
        String statusPagamentoType = isH2 
            ? "VARCHAR(10) DEFAULT 'Pendente' NOT NULL CHECK (STATUS_PAGAMENTO IN ('Pendente', 'Pago'))" 
            : "ENUM('Pendente', 'Pago') DEFAULT 'Pendente' NOT NULL";
        String statusPedidoType = isH2 
            ? "VARCHAR(20) DEFAULT 'Pendente' NOT NULL CHECK (STATUS IN ('Pendente', 'Em Preparo', 'Entregue', 'Cancelado'))" 
            : "ENUM('Pendente', 'Em Preparo', 'Entregue', 'Cancelado') DEFAULT 'Pendente' NOT NULL";
        String statusPacienteType = isH2
            ? "VARCHAR(10) DEFAULT 'Internado' NOT NULL CHECK (STATUS IN ('Internado', 'Alta'))"
            : "ENUM('Internado', 'Alta') NOT NULL DEFAULT 'Internado'";
        String dataEntradaSaidaConstraint = isH2 
            ? "CONSTRAINT CHECK_ESTADIA_INTERVALO CHECK ((DATA_SAIDA IS NULL) OR (DATA_ENTRADA <= DATA_SAIDA))"
            : "CONSTRAINT CHECK_ESTADIA_INTERVALO CHECK (DATA_SAIDA IS NULL OR DATA_ENTRADA <= DATA_SAIDA)";
        return new String[] {
            // CATEGORIA_QUARTO
            "CREATE TABLE IF NOT EXISTS CATEGORIA_QUARTO ("
            + categoriaQuartoIdCol + " INT PRIMARY KEY AUTO_INCREMENT,"
            + "NOME VARCHAR(50) NOT NULL UNIQUE,"
            + "DESCRICAO VARCHAR(255)"
            + ")"
            // QUARTO
            ,"CREATE TABLE IF NOT EXISTS QUARTO ("
            + "ID_QUARTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "NUMERO INT NOT NULL,"
            + "ID_CATEGORIA_QUARTO INT,"
            + "CONSTRAINT UNIQUE_NUMERO UNIQUE (NUMERO),"
            + "FOREIGN KEY (ID_CATEGORIA_QUARTO) REFERENCES CATEGORIA_QUARTO (" + categoriaQuartoIdCol + ") ON DELETE SET NULL"
            + ")",
            // PACIENTE
            "CREATE TABLE IF NOT EXISTS PACIENTE ("
            + "ID_PACIENTE INT PRIMARY KEY AUTO_INCREMENT,"
            + "STATUS " + statusPacienteType + ","
            + "NOME VARCHAR(100) NOT NULL,"
            + "EMAIL VARCHAR(100) NOT NULL UNIQUE,"
            + "CPF VARCHAR(11) UNIQUE NOT NULL,"
            + "DATA_NASCIMENTO DATE NOT NULL,"
            + "TELEFONE VARCHAR(11),"
            + "ENDERECO VARCHAR(255),"
            + "FOTO_PERFIL_BASE64 LONGTEXT NULL,"
            + "SENHA VARCHAR(255) NOT NULL,"
            + "CONSTRAINT CHECK_E_CPF CHECK (LENGTH(CPF) = 11),"
            + "CONSTRAINT CHECK_STATUS CHECK (STATUS IN ('Internado', 'Alta'))"
            + ")",
            // CATEGORIA_PRODUTO
            "CREATE TABLE IF NOT EXISTS CATEGORIA_PRODUTO ("
            + categoriaProdutoIdCol + " INT PRIMARY KEY AUTO_INCREMENT,"
            + "NOME VARCHAR(50) NOT NULL UNIQUE,"
            + "DESCRICAO VARCHAR(255)"
            + ")",
            // PRODUTO
            "CREATE TABLE IF NOT EXISTS PRODUTO ("
            + "ID_PRODUTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "DESCRICAO VARCHAR(255) NOT NULL,"
            + "PRECO DECIMAL(10, 2) NOT NULL CHECK (PRECO > 0),"
            + "TEMPO_PREPARO INT NOT NULL CHECK (TEMPO_PREPARO > 0),"
            + "ID_CATEGORIA_PRODUTO INT,"
            + "ATIVO BOOLEAN DEFAULT TRUE,"
            + "CALORIAS_KCAL INT CHECK (CALORIAS_KCAL >= 0),"
            + "PROTEINAS_G INT CHECK (PROTEINAS_G >= 0),"
            + "CARBOIDRATOS_G INT CHECK (CARBOIDRATOS_G >= 0),"
            + "GORDURAS_G INT CHECK (GORDURAS_G >= 0),"
            + "SODIO_MG INT CHECK (SODIO_MG >= 0),"
            + "CONSTRAINT UNIQUE_NOME UNIQUE (NOME),"
            + "FOREIGN KEY (ID_CATEGORIA_PRODUTO) REFERENCES CATEGORIA_PRODUTO (" + categoriaProdutoIdCol + ") ON DELETE SET NULL"
            + ")",
            // CAMAREIRA
            "CREATE TABLE IF NOT EXISTS CAMAREIRA ("
            + "ID_CAMAREIRA INT PRIMARY KEY AUTO_INCREMENT,"
            + "CRE VARCHAR(20) NOT NULL UNIQUE,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "EMAIL VARCHAR(100) NOT NULL UNIQUE,"
            + "CPF VARCHAR(11) UNIQUE NOT NULL,"
            + "DATA_NASCIMENTO VARCHAR(10) NOT NULL,"
            + "TELEFONE VARCHAR(11),"
            + "ENDERECO VARCHAR(255),"
            + "CARGO VARCHAR(50) NOT NULL,"
            + "SETOR VARCHAR(50) NOT NULL,"
            + "FOTO_PERFIL_BASE64 TEXT NULL,"
            + "SENHA VARCHAR(255) NOT NULL,"
            + "CONSTRAINT CHECK_CPF CHECK (LENGTH(CPF) = 11)"
            + ")",
            // METODO_PAGAMENTO
            "CREATE TABLE IF NOT EXISTS METODO_PAGAMENTO ("
            + "ID_METODO_PAGAMENTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "TIPO VARCHAR(50) NOT NULL UNIQUE"
            + ")",
            // ESTADIA
            "CREATE TABLE IF NOT EXISTS ESTADIA ("
            + "ID_PACIENTE INT NOT NULL,"
            + "ID_QUARTO INT NULL,"
            + "DATA_ENTRADA " + datetimeType + " PRIMARY KEY DEFAULT CURRENT_TIMESTAMP" + (isH2 ? "" : "(6)") + ","
            + "DATA_SAIDA " + datetimeType + " NULL,"
            + "UNIQUE (ID_PACIENTE, ID_QUARTO, DATA_ENTRADA),"
            + "FOREIGN KEY (ID_QUARTO) REFERENCES QUARTO (ID_QUARTO) ON DELETE SET NULL,"
            + "FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTE (ID_PACIENTE) ON DELETE CASCADE,"
            + dataEntradaSaidaConstraint
            + ")",
            // FATURA
            "CREATE TABLE IF NOT EXISTS FATURA ("
            + "STATUS_PAGAMENTO " + statusPagamentoType + ","
            + "VALOR_TOTAL DECIMAL(10, 2) DEFAULT 0,"
            + "DATA_PAGAMENTO " + datetimeType + " NULL,"
            + "ID_METODO_PAGAMENTO INT NULL,"
            + "DATA_EMISSAO " + datetimeType + " PRIMARY KEY DEFAULT CURRENT_TIMESTAMP" + (isH2 ? "" : "(6)") + ","
            + "DATA_ENTRADA_ESTADIA " + datetimeType + " NOT NULL,"
            + "FOREIGN KEY (DATA_ENTRADA_ESTADIA) REFERENCES ESTADIA (DATA_ENTRADA) ON DELETE CASCADE,"
            + "FOREIGN KEY (ID_METODO_PAGAMENTO) REFERENCES METODO_PAGAMENTO(ID_METODO_PAGAMENTO),"
            + "CONSTRAINT CHECK_VALOR_TOTAL CHECK (VALOR_TOTAL >= 0)"
            + ")",
            // PEDIDO
            "CREATE TABLE IF NOT EXISTS PEDIDO ("
            + "DATA_ENTRADA_ESTADIA " + datetimeType + " NOT NULL,"
            + "ID_CAMAREIRA INT NULL,"
            + "STATUS " + statusPedidoType + ","
            + "DATA_PEDIDO " + datetimeType + " PRIMARY KEY DEFAULT CURRENT_TIMESTAMP" + (isH2 ? "" : "(6)") + ","
            + "FOREIGN KEY (DATA_ENTRADA_ESTADIA) REFERENCES ESTADIA (DATA_ENTRADA) ON DELETE CASCADE,"
            + "FOREIGN KEY (ID_CAMAREIRA) REFERENCES CAMAREIRA (ID_CAMAREIRA) ON DELETE SET NULL"
            + ")",
            // PRODUTO_PEDIDO
            "CREATE TABLE IF NOT EXISTS PRODUTO_PEDIDO ("
            + "CRIADO_EM " + datetimeType + " PRIMARY KEY DEFAULT CURRENT_TIMESTAMP" + (isH2 ? "" : "(6)") + ","
            + "ID_PRODUTO INT NOT NULL,"
            + "DATA_PEDIDO " + datetimeType + " NOT NULL,"
            + "QUANTIDADE INT NOT NULL,"
            + "FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUTO (ID_PRODUTO) ON DELETE CASCADE,"
            + "FOREIGN KEY (DATA_PEDIDO) REFERENCES PEDIDO (DATA_PEDIDO) ON DELETE CASCADE,"
            + "CONSTRAINT CHECK_QUANTIDADE CHECK (QUANTIDADE > 0)"
            + ")"
        };
    }

    @PostConstruct
    public void init() {
        if (recreateTables) {
            dropTables();
        }
        createTables();
    }
}
