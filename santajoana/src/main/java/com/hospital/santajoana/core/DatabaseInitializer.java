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
    }

    private String[] generateCreateTableStatements(boolean isH2) {
        // For different database references
        String categoriaQuartoCol = isH2 ? "ID_CATEGORIA" : "ID_CATEGORIA_QUARTO";
        String categoriaProdutoCol = isH2 ? "ID_CATEGORIA" : "ID_CATEGORIA_PRODUTO";

        return new String[] {
            // Create category tables first
            "CREATE TABLE IF NOT EXISTS CATEGORIA_QUARTO ("
            + "ID_CATEGORIA INT PRIMARY KEY AUTO_INCREMENT,"
            + "NOME VARCHAR(50) NOT NULL UNIQUE,"
            + "DESCRICAO VARCHAR(255)"
            + ");",

            "CREATE TABLE IF NOT EXISTS CATEGORIA_PRODUTO ("
            + "ID_CATEGORIA INT PRIMARY KEY AUTO_INCREMENT,"
            + "NOME VARCHAR(50) NOT NULL UNIQUE,"
            + "DESCRICAO VARCHAR(255)"
            + ");",

            // Create base tables with foreign keys to categories
            "CREATE TABLE IF NOT EXISTS QUARTO ("
            + "ID_QUARTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "NUMERO INT NOT NULL,"
            + "ID_CATEGORIA_QUARTO INT,"
            + "CONSTRAINT UNIQUE_NUMERO UNIQUE (NUMERO),"
            + "FOREIGN KEY (ID_CATEGORIA_QUARTO) REFERENCES CATEGORIA_QUARTO (" + categoriaQuartoCol + ")"
            + (isH2 ? "" : " ON DELETE SET NULL")
            + ");",

            "CREATE TABLE IF NOT EXISTS PACIENTE ("
            + "ID_PACIENTE INT PRIMARY KEY AUTO_INCREMENT,"
            + "STATUS ENUM('Internado', 'Alta') NOT NULL,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "CPF VARCHAR(11) UNIQUE NOT NULL,"
            + "DATA_NASCIMENTO DATE NOT NULL,"
            + "TELEFONE VARCHAR(11),"
            + "ENDERECO VARCHAR(255),"
            + "CONSTRAINT CHECK_E_CPF CHECK (LENGTH(CPF) = 11),"
            + "CONSTRAINT CHECK_STATUS CHECK (STATUS IN ('Internado', 'Alta'))"
            + ");",

            "CREATE TABLE IF NOT EXISTS PRODUTO ("
            + "ID_PRODUTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "DESCRICAO VARCHAR(255) NOT NULL,"
            + "PRECO DECIMAL(10, 2) NOT NULL CHECK (PRECO > 0),"
            + "TEMPO_PREPARO INT NOT NULL CHECK (TEMPO_PREPARO > 0),"
            + "ID_CATEGORIA_PRODUTO INT,"
            + "CALORIAS_KCAL INT CHECK (CALORIAS_KCAL >= 0),"
            + "PROTEINAS_G INT CHECK (PROTEINAS_G >= 0),"
            + "CARBOIDRATOS_G INT CHECK (CARBOIDRATOS_G >= 0),"
            + "GORDURAS_G INT CHECK (GORDURAS_G >= 0),"
            + "SODIO_MG INT CHECK (SODIO_MG >= 0),"
            + "CONSTRAINT UNIQUE_NOME UNIQUE (NOME),"
            + "FOREIGN KEY (ID_CATEGORIA_PRODUTO) REFERENCES CATEGORIA_PRODUTO (" + categoriaProdutoCol + ")"
            + (isH2 ? "" : " ON DELETE SET NULL")
            + ");",

            // Rest of the tables remain largely unchanged
            // ...existing code for CAMAREIRA...
            "CREATE TABLE IF NOT EXISTS CAMAREIRA ("
            + "ID_CAMAREIRA INT PRIMARY KEY AUTO_INCREMENT,"
            + "CRE VARCHAR(20) NOT NULL UNIQUE,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "CPF VARCHAR(11) UNIQUE NOT NULL,"
            + "DATA_NASCIMENTO VARCHAR(10) NOT NULL,"
            + "TELEFONE VARCHAR(11),"
            + "ENDERECO VARCHAR(255),"
            + "CARGO VARCHAR(50) NOT NULL,"
            + "SETOR VARCHAR(50) NOT NULL,"
            + "CONSTRAINT CHECK_CPF CHECK (LENGTH(CPF) = 11)"
            + ");",
            
            // ...existing code for METODO_PAGAMENTO...
            "CREATE TABLE IF NOT EXISTS METODO_PAGAMENTO ("
            + "ID_METODO_PAGAMENTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "TIPO VARCHAR(50) NOT NULL UNIQUE"
            + ");",
            
            // ...existing code for ESTADIA...
            "CREATE TABLE IF NOT EXISTS ESTADIA ("
            + "ID_ESTADIA INT PRIMARY KEY AUTO_INCREMENT,"
            + "ID_PACIENTE INT NOT NULL,"
            + "ID_QUARTO INT NOT NULL,"
            + "DATA_ENTRADA DATETIME DEFAULT CURRENT_TIMESTAMP,"
            + "DATA_SAIDA DATETIME NULL,"
            + "UNIQUE (ID_PACIENTE, ID_QUARTO, DATA_ENTRADA),"
            + "FOREIGN KEY (ID_QUARTO) REFERENCES QUARTO (ID_QUARTO),"
            + "FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTE (ID_PACIENTE),"
            + "CONSTRAINT CHECK_ESTADIA_INTERVALO CHECK (DATA_ENTRADA <= DATA_SAIDA OR DATA_SAIDA IS NULL)"
            + ");",
            
            // ...existing code for FATURA...
            "CREATE TABLE IF NOT EXISTS FATURA ("
            + "ID_FATURA INT PRIMARY KEY AUTO_INCREMENT,"
            + "STATUS_PAGAMENTO ENUM('Pendente', 'Pago') DEFAULT 'Pendente' NOT NULL,"
            + "VALOR_TOTAL DECIMAL(10, 2) DEFAULT 0,"
            + "DATA_PAGAMENTO DATETIME NULL,"
            + "ID_METODO_PAGAMENTO INT NULL,"
            + "DATA_EMISSAO DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,"
            + "ID_ESTADIA INT NOT NULL,"
            + "FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA)" + (isH2 ? "" : " ON DELETE CASCADE") + ","
            + "FOREIGN KEY (ID_METODO_PAGAMENTO) REFERENCES METODO_PAGAMENTO (ID_METODO_PAGAMENTO),"
            + "CONSTRAINT CHECK_VALOR_TOTAL CHECK (VALOR_TOTAL >= 0)"
            + ");",
            
            // ...existing code for PEDIDO...
            "CREATE TABLE IF NOT EXISTS PEDIDO ("
            + "ID_PEDIDO INT PRIMARY KEY AUTO_INCREMENT,"
            + "ID_ESTADIA INT NOT NULL,"
            + "ID_CAMAREIRA INT NULL,"
            + "STATUS ENUM('Pendente', 'Em Preparo', 'Entregue', 'Cancelado') DEFAULT 'Pendente' NOT NULL,"
            + "DATA_PEDIDO DATETIME DEFAULT CURRENT_TIMESTAMP,"
            + "FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA)" + (isH2 ? "" : " ON DELETE CASCADE") + ","
            + "FOREIGN KEY (ID_CAMAREIRA) REFERENCES CAMAREIRA (ID_CAMAREIRA)" + (isH2 ? "" : " ON DELETE SET NULL")
            + ");",

            // Updated PRODUTO_PEDIDO table with ON DELETE CASCADE constraints
            "CREATE TABLE IF NOT EXISTS PRODUTO_PEDIDO ("
            + "ID_PRODUTO_PEDIDO INT PRIMARY KEY AUTO_INCREMENT,"
            + "ID_PRODUTO INT NOT NULL,"
            + "ID_PEDIDO INT NOT NULL,"
            + "QUANTIDADE INT NOT NULL,"
            + "UNIQUE (ID_PRODUTO, ID_PEDIDO),"
            + "FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUTO (ID_PRODUTO)" + (isH2 ? "" : " ON DELETE CASCADE") + ","
            + "FOREIGN KEY (ID_PEDIDO) REFERENCES PEDIDO (ID_PEDIDO)" + (isH2 ? "" : " ON DELETE CASCADE") + ","
            + "CONSTRAINT CHECK_QUANTIDADE CHECK (QUANTIDADE > 0)"
            + ");"
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
