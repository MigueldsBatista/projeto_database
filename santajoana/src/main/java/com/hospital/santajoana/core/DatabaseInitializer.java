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
            
            // Check and drop foreign key constraint if it exists
            "SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE " +
            "WHERE TABLE_NAME = 'ESTADIA' AND REFERENCED_TABLE_NAME = 'FATURA' " +
            "AND CONSTRAINT_SCHEMA = DATABASE() LIMIT 1);",
            
            "SET @sql = IF(@constraint_name IS NOT NULL, " +
            "CONCAT('ALTER TABLE ESTADIA DROP FOREIGN KEY ', @constraint_name, ';'), 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql;",
            "EXECUTE stmt;",
            "DEALLOCATE PREPARE stmt;",
            
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
            + "ID_QUARTO INT PRIMARY KEY NOT NULL AUTO_INCREMENT,"
            + "NUMERO INT NOT NULL,"
            + "TIPO ENUM('Enfermaria','Apartamento','UTI','Sala de Exame','Outro') NOT NULL"
            + ");",

            "CREATE TABLE IF NOT EXISTS PACIENTE ("
            + "ID_PACIENTE INT PRIMARY KEY NOT NULL AUTO_INCREMENT,"
            + "STATUS ENUM('Internado','Alta') NOT NULL,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "CPF VARCHAR(11) UNIQUE NOT NULL,"
            + "DATA_NASCIMENTO DATE NOT NULL"
            + ");",

            "CREATE TABLE IF NOT EXISTS PRODUTO ("
            + "ID_PRODUTO INT PRIMARY KEY NOT NULL AUTO_INCREMENT,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "DESCRICAO TEXT NOT NULL,"
            + "PRECO DECIMAL(10,2) NOT NULL,"
            + "TEMPO_PREPARO INT NOT NULL,"
            + "CATEGORIA ENUM('Café da Manhã','Almoço','Jantar','Sobremesa') NOT NULL,"
            + "CALORIAS_KCAL INT NULL,"
            + "PROTEINAS_G INT NULL,"
            + "CARBOIDRATOS_G INT NULL,"
            + "GORDURAS_G INT NULL,"
            + "SODIO_MG INT NULL"
            + ");",

            "CREATE TABLE IF NOT EXISTS CAMAREIRA ("
            + "ID_CAMAREIRA INT PRIMARY KEY NOT NULL AUTO_INCREMENT,"
            + "NOME VARCHAR(100) NOT NULL,"
            + "CARGO VARCHAR(50) NOT NULL,"
            + "SETOR VARCHAR(50) NOT NULL"
            + ");",
            
            "CREATE TABLE IF NOT EXISTS METODO_PAGAMENTO ("
            + "ID_METODO_PAGAMENTO INT PRIMARY KEY NOT NULL AUTO_INCREMENT,"
            + "TIPO ENUM('Cartão de Crédito','Cartão de Débito','Pix') NOT NULL"
            + ");",
            
            // Create tables with foreign key constraints, but without circular dependencies
            "CREATE TABLE IF NOT EXISTS ESTADIA ("
            + "ID_ESTADIA INT PRIMARY KEY NOT NULL AUTO_INCREMENT,"
            + "ID_PACIENTE INT NOT NULL,"
            + "ID_QUARTO INT NOT NULL,"
            + "DATA_ENTRADA DATETIME DEFAULT CURRENT_TIMESTAMP,"
            + "DATA_SAIDA DATETIME NULL,"
            + "UNIQUE (ID_PACIENTE, ID_QUARTO, DATA_ENTRADA),"
            + "FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTE (ID_PACIENTE),"
            + "FOREIGN KEY (ID_QUARTO) REFERENCES QUARTO (ID_QUARTO)"
            + ");",
            
            "CREATE TABLE IF NOT EXISTS FATURA ("
            + "ID_FATURA INT PRIMARY KEY NOT NULL AUTO_INCREMENT,"
            + "ID_ESTADIA INT NOT NULL,"
            + "STATUS_PAGAMENTO ENUM('Pendente','Pago') NOT NULL,"
            + "VALOR_TOTAL DECIMAL(10,2) DEFAULT 0,"
            + "DATA_PAGAMENTO DATETIME NULL,"
            + "ID_METODO_PAGAMENTO INT NOT NULL,"
            + "DATA_EMISSAO DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,"
            + "FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA) ON DELETE CASCADE,"
            + "FOREIGN KEY (ID_METODO_PAGAMENTO) REFERENCES METODO_PAGAMENTO (ID_METODO_PAGAMENTO)"
            + ");",
            
            "CREATE TABLE IF NOT EXISTS PEDIDO ("
            + "ID_PEDIDO INT PRIMARY KEY NOT NULL AUTO_INCREMENT,"
            + "ID_ESTADIA INT NOT NULL,"
            + "ID_CAMAREIRA INT NOT NULL,"
            + "STATUS ENUM('Pendente','Em Preparação','Entregue') NOT NULL,"
            + "DATA_PEDIDO DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,"
            + "FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA),"
            + "FOREIGN KEY (ID_CAMAREIRA) REFERENCES CAMAREIRA (ID_CAMAREIRA)"
            + ");",

            "CREATE TABLE IF NOT EXISTS PRODUTO_PEDIDO ("
            + "ID_PRODUTO INT NOT NULL,"
            + "ID_PEDIDO INT NOT NULL,"
            + "QUANTIDADE INT NOT NULL,"
            + "UNIQUE (ID_PRODUTO, ID_PEDIDO),"
            + "FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUTO (ID_PRODUTO),"
            + "FOREIGN KEY (ID_PEDIDO) REFERENCES PEDIDO (ID_PEDIDO)"
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
        
        // Add constraints with duplicate checking
        String[] constraintStatements = {
            // PRODUTO constraints
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'PRODUTO' AND CONSTRAINT_NAME = 'PRECO_POSITIVO');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE PRODUTO ADD CONSTRAINT PRECO_POSITIVO CHECK (PRECO > 0);', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'PRODUTO' AND CONSTRAINT_NAME = 'TEMPO_PREPARO_POSITIVO');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE PRODUTO ADD CONSTRAINT TEMPO_PREPARO_POSITIVO CHECK (TEMPO_PREPARO > 0);', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'PRODUTO' AND CONSTRAINT_NAME = 'CALORIAS_POSITIVO');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE PRODUTO ADD CONSTRAINT CALORIAS_POSITIVO CHECK (CALORIAS_KCAL IS NULL OR CALORIAS_KCAL >= 0);', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'PRODUTO' AND CONSTRAINT_NAME = 'PROTEINAS_POSITIVO');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE PRODUTO ADD CONSTRAINT PROTEINAS_POSITIVO CHECK (PROTEINAS_G IS NULL OR PROTEINAS_G >= 0);', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'PRODUTO' AND CONSTRAINT_NAME = 'CARBOIDRATOS_POSITIVO');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE PRODUTO ADD CONSTRAINT CARBOIDRATOS_POSITIVO CHECK (CARBOIDRATOS_G IS NULL OR CARBOIDRATOS_G >= 0);', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'PRODUTO' AND CONSTRAINT_NAME = 'GORDURAS_POSITIVO');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE PRODUTO ADD CONSTRAINT GORDURAS_POSITIVO CHECK (GORDURAS_G IS NULL OR GORDURAS_G >= 0);', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'PRODUTO' AND CONSTRAINT_NAME = 'SODIO_POSITIVO');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE PRODUTO ADD CONSTRAINT SODIO_POSITIVO CHECK (SODIO_MG IS NULL OR SODIO_MG >= 0);', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            // FATURA constraint
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'FATURA' AND CONSTRAINT_NAME = 'VALOR_TOTAL_POSITIVO');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE FATURA ADD CONSTRAINT VALOR_TOTAL_POSITIVO CHECK (VALOR_TOTAL > 0);', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            // ESTADIA constraints
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'ESTADIA' AND CONSTRAINT_NAME = 'VALID_DATE_INTERVAL');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE ESTADIA ADD CONSTRAINT VALID_DATE_INTERVAL CHECK(DATA_ENTRADA <= DATA_SAIDA OR DATA_SAIDA IS NULL);', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'ESTADIA' AND CONSTRAINT_NAME = 'CHK_PATIENT_NOT_ALREADY_ADMITTED');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE ESTADIA ADD CONSTRAINT CHK_PATIENT_NOT_ALREADY_ADMITTED CHECK(" +
            "NOT EXISTS (" +
            "SELECT 1 FROM PACIENTE " +
            "WHERE ID_PACIENTE = ESTADIA.ID_PACIENTE " +
            "AND STATUS = 'Internado'" +
            "AND ID_PACIENTE IN (SELECT ID_PACIENTE FROM ESTADIA WHERE DATA_SAIDA IS NULL AND ID_ESTADIA != ESTADIA.ID_ESTADIA)" +
            ")" +
            ");', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;",
            
            // FATURA check constraint
            "SET @check_constraint = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'FATURA' AND CONSTRAINT_NAME = 'CHK_PATIENT_HAS_NO_BILL');",
            
            "SET @sql = IF(@check_constraint = 0, " +
            "'ALTER TABLE FATURA ADD CONSTRAINT CHK_PATIENT_HAS_NO_BILL CHECK(" +
            "NOT EXISTS (" +
            "SELECT 1 FROM ESTADIA " +
            "WHERE ID_ESTADIA = FATURA.ID_ESTADIA " +
            "AND FATURA.STATUS_PAGAMENTO = 'Pendente' " +
            "AND FATURA.DATA_PAGAMENTO IS NULL" +
            ")" +
            ");', 'SELECT 1;');",
            
            "PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;"
        };
        
        // Execute all constraint statements
        for (String sql : constraintStatements) {
            try {
                jdbcTemplate.execute(sql);
            } catch (Exception e) {
                System.err.println("Error adding constraint: " + e.getMessage());
            }
        }
    }

    @PostConstruct
    public void init() {
        if (recreateTables) {
            // dropTables();
        }
        createTables();
    }
}
