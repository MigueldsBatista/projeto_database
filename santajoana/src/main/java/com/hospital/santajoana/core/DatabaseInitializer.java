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
        // For different database references - we'll use consistent column names now
        String categoriaQuartoIdCol = "ID_CATEGORIA_QUARTO";
        String categoriaProdutoIdCol = "ID_CATEGORIA_PRODUTO";
        
        // Define datetime type based on database
        String datetimeType = isH2 ? "TIMESTAMP" : "DATETIME(6)";
        
        // Different syntax for check constraints and defaults between H2 and MySQL
        String checkSyntaxStart = isH2 ? "CONSTRAINT CHECK_ESTADIA_INTERVALO CHECK" : "CHECK";
        
        // Different ENUM handling for H2 vs MySQL
        String statusPagamentoType = isH2 
            ? "VARCHAR(10) DEFAULT 'Pendente' NOT NULL CHECK (STATUS_PAGAMENTO IN ('Pendente', 'Pago'))" 
            : "ENUM('Pendente', 'Pago') DEFAULT 'Pendente' NOT NULL";
            
        String statusPedidoType = isH2 
            ? "VARCHAR(20) DEFAULT 'Pendente' NOT NULL CHECK (STATUS IN ('Pendente', 'Em Preparo', 'Entregue', 'Cancelado'))" 
            : "ENUM('Pendente', 'Em Preparo', 'Entregue', 'Cancelado') DEFAULT 'Pendente' NOT NULL";
        
        String statusPacienteType = isH2
            ? "VARCHAR(10) NOT NULL CHECK (STATUS IN ('Internado', 'Alta'))"
            : "ENUM('Internado', 'Alta') NOT NULL";
        
        return new String[] {
            // Create category tables first with consistent ID naming
            "CREATE TABLE IF NOT EXISTS CATEGORIA_QUARTO ("
            + categoriaQuartoIdCol + " INT PRIMARY KEY AUTO_INCREMENT,"
            + "NOME VARCHAR(50) NOT NULL UNIQUE,"
            + "DESCRICAO VARCHAR(255)"
            + ");",

            "CREATE TABLE IF NOT EXISTS CATEGORIA_PRODUTO ("
            + categoriaProdutoIdCol + " INT PRIMARY KEY AUTO_INCREMENT,"
            + "NOME VARCHAR(50) NOT NULL UNIQUE,"
            + "DESCRICAO VARCHAR(255)"
            + ");",

            // Create base tables with foreign keys to categories
            "CREATE TABLE IF NOT EXISTS QUARTO ("
            + "ID_QUARTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "NUMERO INT NOT NULL,"
            + "ID_CATEGORIA_QUARTO INT,"
            + "CONSTRAINT UNIQUE_NUMERO UNIQUE (NUMERO),"
            + "FOREIGN KEY (ID_CATEGORIA_QUARTO) REFERENCES CATEGORIA_QUARTO (" + categoriaQuartoIdCol + ")"
            + (isH2 ? "" : " ON DELETE SET NULL")
            + ");",

            "CREATE TABLE IF NOT EXISTS PACIENTE ("
            + "ID_PACIENTE INT PRIMARY KEY AUTO_INCREMENT,"
            + "STATUS " + statusPacienteType + ","
            + "NOME VARCHAR(100) NOT NULL,"
            + "CPF VARCHAR(11) UNIQUE NOT NULL,"
            + "DATA_NASCIMENTO DATE NOT NULL,"
            + "TELEFONE VARCHAR(11),"
            + "ENDERECO VARCHAR(255),"
            + "CONSTRAINT CHECK_E_CPF CHECK (LENGTH(CPF) = 11)"
            + (isH2 ? "" : ",CONSTRAINT CHECK_STATUS CHECK (STATUS IN ('Internado', 'Alta'))")
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
            + "FOREIGN KEY (ID_CATEGORIA_PRODUTO) REFERENCES CATEGORIA_PRODUTO (" + categoriaProdutoIdCol + ")"
            + (isH2 ? "" : " ON DELETE SET NULL")
            + ");",

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
            
            "CREATE TABLE IF NOT EXISTS METODO_PAGAMENTO ("
            + "ID_METODO_PAGAMENTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "TIPO VARCHAR(50) NOT NULL UNIQUE"
            + ");",
            
            "CREATE TABLE IF NOT EXISTS ESTADIA ("
            + "ID_PACIENTE INT NOT NULL,"
            + "ID_QUARTO INT NOT NULL,"
            + "DATA_ENTRADA " + datetimeType + " DEFAULT CURRENT_TIMESTAMP" + (isH2 ? "" : "(6)") + ","
            + "DATA_SAIDA " + datetimeType + " NULL,"
            + "PRIMARY KEY (DATA_ENTRADA),"
            + "UNIQUE (ID_PACIENTE, ID_QUARTO, DATA_ENTRADA),"
            + "FOREIGN KEY (ID_QUARTO) REFERENCES QUARTO (ID_QUARTO),"
            + "FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTE (ID_PACIENTE),"
            + checkSyntaxStart + " (DATA_ENTRADA <= DATA_SAIDA OR DATA_SAIDA IS NULL)"
            + ");",
            
            "CREATE TABLE IF NOT EXISTS FATURA ("
            + "STATUS_PAGAMENTO " + statusPagamentoType + ","
            + "VALOR_TOTAL DECIMAL(10, 2) DEFAULT 0,"
            + "DATA_PAGAMENTO " + datetimeType + " NULL,"
            + "ID_METODO_PAGAMENTO INT NULL,"
            + "DATA_EMISSAO " + datetimeType + " DEFAULT CURRENT_TIMESTAMP" + (isH2 ? "" : "(6)") + ","
            + "DATA_ENTRADA_ESTADIA " + datetimeType + " NOT NULL,"
            + "PRIMARY KEY (DATA_EMISSAO),"
            + "FOREIGN KEY (DATA_ENTRADA_ESTADIA) REFERENCES ESTADIA (DATA_ENTRADA) ON DELETE CASCADE,"
            + "FOREIGN KEY (ID_METODO_PAGAMENTO) REFERENCES METODO_PAGAMENTO(ID_METODO_PAGAMENTO),"
            + "CONSTRAINT CHECK_VALOR_TOTAL CHECK (VALOR_TOTAL >= 0)"
            + ");",
            
            "CREATE TABLE IF NOT EXISTS PEDIDO ("
            + "DATA_ENTRADA_ESTADIA " + datetimeType + " NOT NULL,"
            + "ID_CAMAREIRA INT NULL,"
            + "STATUS " + statusPedidoType + ","
            + "DATA_PEDIDO " + datetimeType + " DEFAULT CURRENT_TIMESTAMP" + (isH2 ? "" : "(6)") + ","
            + "PRIMARY KEY (DATA_PEDIDO),"
            + "FOREIGN KEY (DATA_ENTRADA_ESTADIA) REFERENCES ESTADIA (DATA_ENTRADA) ON DELETE CASCADE,"
            + "FOREIGN KEY (ID_CAMAREIRA) REFERENCES CAMAREIRA (ID_CAMAREIRA) ON DELETE SET NULL"
            + ");",

            "CREATE TABLE IF NOT EXISTS PRODUTO_PEDIDO ("
            + "ID_PRODUTO INT NOT NULL,"
            + "DATA_PEDIDO " + datetimeType + " NOT NULL,"
            + "QUANTIDADE INT NOT NULL,"
            + "CRIADO_EM " + datetimeType + " DEFAULT CURRENT_TIMESTAMP" + (isH2 ? "" : "(6)") + ","
            + "PRIMARY KEY (CRIADO_EM),"
            + "FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUTO (ID_PRODUTO) ON DELETE CASCADE,"
            + "FOREIGN KEY (DATA_PEDIDO) REFERENCES PEDIDO (DATA_PEDIDO) ON DELETE CASCADE,"
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
