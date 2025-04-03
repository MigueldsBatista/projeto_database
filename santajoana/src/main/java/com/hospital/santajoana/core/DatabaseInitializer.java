package com.hospital.santajoana.core;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer {

    @Autowired
    private final JdbcTemplate jdbcTemplate;
    
    @Value("${database.recreate-tables:false}")
    private boolean recreateTables;

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
            "DROP TABLE IF EXISTS METODO_PAGAMENTO;"
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
        // Create tables first
        String[] createTableStatements = {
            // Create base tables first
            "CREATE TABLE IF NOT EXISTS QUARTO ("
            + "ID_QUARTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "NUMERO INT NOT NULL,"
            + "TIPO ENUM('Enfermaria', 'Apartamento', 'UTI', 'Sala de Exame', 'Outro') NOT NULL,"
            + "CONSTRAINT UNIQUE_NUMERO UNIQUE (NUMERO)"
            + ");",

            "CREATE TABLE IF NOT EXISTS PACIENTE ("
            + "ID_PACIENTE INT PRIMARY KEY AUTO_INCREMENT,"
            + "ID_DEPENDENTE INT,"
            + "STATUS ENUM('Internado', 'Alta') NOT NULL,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "CPF VARCHAR(11) UNIQUE NOT NULL,"
            + "DATA_NASCIMENTO DATE NOT NULL,"
            + "TELEFONE VARCHAR(11),"
            + "ENDERECO VARCHAR(255),"
            + "CONSTRAINT CHECK_E_CPF CHECK (LENGTH(CPF) = 11),"
            + "CONSTRAINT CHECK_STATUS CHECK (STATUS IN ('Internado', 'Alta')),"
            + "FOREIGN KEY (ID_DEPENDENTE) REFERENCES PACIENTE (ID_PACIENTE) ON DELETE SET NULL"
            + ");",

            "CREATE TABLE IF NOT EXISTS PRODUTO ("
            + "ID_PRODUTO INT PRIMARY KEY AUTO_INCREMENT,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "DESCRICAO VARCHAR(255) NOT NULL,"
            + "PRECO DECIMAL(10, 2) NOT NULL CHECK (PRECO > 0),"
            + "TEMPO_PREPARO INT NOT NULL CHECK (TEMPO_PREPARO > 0),"
            + "CATEGORIA ENUM('Café da Manhã', 'Almoço', 'Jantar', 'Sobremesa') NOT NULL,"
            + "CALORIAS_KCAL INT CHECK (CALORIAS_KCAL >= 0),"
            + "PROTEINAS_G INT CHECK (PROTEINAS_G >= 0),"
            + "CARBOIDRATOS_G INT CHECK (CARBOIDRATOS_G >= 0),"
            + "GORDURAS_G INT CHECK (GORDURAS_G >= 0),"
            + "SODIO_MG INT CHECK (SODIO_MG >= 0),"
            + "CONSTRAINT UNIQUE_NOME UNIQUE (NOME)"
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
            
            // Create tables with foreign key constraints
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
            
            "CREATE TABLE IF NOT EXISTS FATURA ("
            + "ID_FATURA INT PRIMARY KEY AUTO_INCREMENT,"
            + "STATUS_PAGAMENTO ENUM('Pendente', 'Pago') NOT NULL,"
            + "VALOR_TOTAL DECIMAL(10, 2) DEFAULT 0,"
            + "DATA_PAGAMENTO DATETIME NULL,"
            + "ID_METODO_PAGAMENTO INT NOT NULL,"
            + "DATA_EMISSAO DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,"
            + "ID_ESTADIA INT NOT NULL,"
            + "FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA) ON DELETE CASCADE,"
            + "FOREIGN KEY (ID_METODO_PAGAMENTO) REFERENCES METODO_PAGAMENTO (ID_METODO_PAGAMENTO),"
            + "CONSTRAINT CHECK_VALOR_TOTAL CHECK (VALOR_TOTAL >= 0)"
            + ");",
            
            "CREATE TABLE IF NOT EXISTS PEDIDO ("
            + "ID_PEDIDO INT PRIMARY KEY AUTO_INCREMENT,"
            + "ID_ESTADIA INT NOT NULL,"
            + "ID_CAMAREIRA INT NOT NULL,"
            + "STATUS ENUM('Pendente', 'Em Preparação', 'Entregue') DEFAULT 'Pendente' NOT NULL,"
            + "DATA_PEDIDO DATETIME DEFAULT CURRENT_TIMESTAMP,"
            + "FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA),"
            + "FOREIGN KEY (ID_CAMAREIRA) REFERENCES CAMAREIRA (ID_CAMAREIRA)"
            + ");",

            "CREATE TABLE IF NOT EXISTS PRODUTO_PEDIDO ("
            + "ID_PRODUTO_PEDIDO INT PRIMARY KEY AUTO_INCREMENT,"
            + "ID_PRODUTO INT NOT NULL,"
            + "ID_PEDIDO INT NOT NULL,"
            + "QUANTIDADE INT NOT NULL,"
            + "UNIQUE (ID_PRODUTO, ID_PEDIDO),"
            + "FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUTO (ID_PRODUTO),"
            + "FOREIGN KEY (ID_PEDIDO) REFERENCES PEDIDO (ID_PEDIDO),"
            + "CONSTRAINT CHECK_QUANTIDADE CHECK (QUANTIDADE > 0)"
            + ");"
        };
        
        // Execute all table creation statements
        for (String sql : createTableStatements) {
            try {
                jdbcTemplate.execute(sql);
            } catch (Exception e) {
                System.err.println("Error creating tables: " + e.getMessage());
            }
        }
    }

    @PostConstruct
    public void init() {
        if (recreateTables) {
            dropTables();
        }
        createTables();
    }
}
