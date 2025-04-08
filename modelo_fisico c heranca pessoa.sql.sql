-- Active: 1743551470150@@127.0.0.1@3307@hospital_db
DROP DATABASE hospital_db;
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

DROP TABLE IF EXISTS PEDIDO_REALIZADO;
DROP TABLE IF EXISTS ENFERMEIRO_QUARTO_PERIODO;
DROP TABLE IF EXISTS PRODUTO_PEDIDO;
DROP TABLE IF EXISTS PEDIDO;
DROP TABLE IF EXISTS FATURA;
DROP TABLE IF EXISTS ESTADIA;
DROP TABLE IF EXISTS PACIENTE;
DROP TABLE IF EXISTS CAMAREIRA;
DROP TABLE IF EXISTS QUARTO;
DROP TABLE IF EXISTS PRODUTO;
DROP TABLE IF EXISTS METODO_PAGAMENTO;
DROP TABLE IF EXISTS TELEFONE_PESSOA;
DROP TABLE IF EXISTS PESSOA;

CREATE TABLE PESSOA (
    ID_PESSOA INT PRIMARY KEY AUTO_INCREMENT,
    CPF VARCHAR(11) UNIQUE NOT NULL,
    NOME VARCHAR(100) NOT NULL,
    DATA_NASCIMENTO DATE NOT NULL,
    TELEFONE VARCHAR(11),
    ENDERECO VARCHAR(255)
);

CREATE TABLE PACIENTE (
    ID_PESSOA INT PRIMARY KEY,
    STATUS ENUM('Internado', 'Alta') NOT NULL,
    FOREIGN KEY (ID_PESSOA) REFERENCES PESSOA(ID_PESSOA) ON DELETE CASCADE
);

CREATE TABLE CAMAREIRA (
    ID_PESSOA INT PRIMARY KEY,
    CRE VARCHAR(20) NOT NULL UNIQUE,
    CARGO VARCHAR(50) NOT NULL,
    SETOR VARCHAR(50) NOT NULL,
    FOREIGN KEY (ID_PESSOA) REFERENCES PESSOA(ID_PESSOA) ON DELETE CASCADE
);

CREATE TABLE CATEGORIA_QUARTO (
    ID_CATEGORIA INT PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(50) NOT NULL UNIQUE,
    DESCRICAO VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS QUARTO (
    ID_QUARTO INT PRIMARY KEY AUTO_INCREMENT,
    NUMERO INT NOT NULL,
    CATEGORIA_QUARTO_ID INT NOT NULL,
    CONSTRAINT UNIQUE_NUMERO UNIQUE (NUMERO),
    FOREIGN KEY (CATEGORIA_QUARTO_ID) REFERENCES CATEGORIA_QUARTO (ID_CATEGORIA) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS CATEGORIA_PRODUTO (
    ID_CATEGORIA INT PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(50) NOT NULL UNIQUE,
    DESCRICAO VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS PRODUTO (
    ID_PRODUTO INT PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(100) NOT NULL,
    DESCRICAO VARCHAR(255) NOT NULL,
    PRECO DECIMAL(10, 2) NOT NULL CHECK (PRECO > 0),
    TEMPO_PREPARO INT NOT NULL CHECK (TEMPO_PREPARO > 0),
    ID_CATEGORIA INT NOT NULL,
    CALORIAS_KCAL INT CHECK (CALORIAS_KCAL >= 0),
    PROTEINAS_G INT CHECK (PROTEINAS_G >= 0),
    CARBOIDRATOS_G INT CHECK (CARBOIDRATOS_G >= 0),
    GORDURAS_G INT CHECK (GORDURAS_G >= 0),
    SODIO_MG INT CHECK (SODIO_MG >= 0),
    CONSTRAINT UNIQUE_NOME UNIQUE (NOME)
    FOREIGN KEY (ID_CATEGORIA) REFERENCES CATEGORIA_PRODUTO (ID_CATEGORIA) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS METODO_PAGAMENTO (
    ID_METODO_PAGAMENTO INT PRIMARY KEY AUTO_INCREMENT,
    TIPO VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ESTADIA (
    ID_ESTADIA INT PRIMARY KEY AUTO_INCREMENT,
    ID_PACIENTE INT NOT NULL,
    ID_QUARTO INT NOT NULL,
    DATA_ENTRADA DATETIME DEFAULT CURRENT_TIMESTAMP,
    DATA_SAIDA DATETIME NULL,
    UNIQUE (ID_PACIENTE, ID_QUARTO, DATA_ENTRADA),
    FOREIGN KEY (ID_QUARTO) REFERENCES QUARTO (ID_QUARTO),
    FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTE (ID_PACIENTE),
    CONSTRAINT CHECK_ESTADIA_INTERVALO CHECK (DATA_ENTRADA <= DATA_SAIDA OR DATA_SAIDA IS NULL)
);

CREATE TABLE IF NOT EXISTS FATURA (
    ID_FATURA INT PRIMARY KEY AUTO_INCREMENT,
    STATUS_PAGAMENTO ENUM('Pendente', 'Pago') DEFAULT 'Pendente' NOT NULL,
    VALOR_TOTAL DECIMAL(10, 2) DEFAULT 0,
    DATA_PAGAMENTO DATETIME NULL,
    ID_METODO_PAGAMENTO INT NOT NULL,
    DATA_EMISSAO DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ID_ESTADIA INT NOT NULL,
    FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA) ON DELETE CASCADE,
    FOREIGN KEY (ID_METODO_PAGAMENTO) REFERENCES METODO_PAGAMENTO(ID_METODO_PAGAMENTO),
    CONSTRAINT CHECK_VALOR_TOTAL CHECK (VALOR_TOTAL >= 0)
);

CREATE TABLE IF NOT EXISTS PEDIDO (
    ID_PEDIDO INT PRIMARY KEY AUTO_INCREMENT,
    ID_ESTADIA INT NOT NULL,
    ID_CAMAREIRA INT NOT NULL,
    STATUS ENUM('Pendente', 'Em Preparo', 'Entregue', 'Cancelado') DEFAULT 'Pendente' NOT NULL,
    DATA_PEDIDO DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA),
    FOREIGN KEY (ID_CAMAREIRA) REFERENCES CAMAREIRA (ID_CAMAREIRA)
);

CREATE TABLE IF NOT EXISTS PRODUTO_PEDIDO (
    ID_PRODUTO_PEDIDO INT PRIMARY KEY AUTO_INCREMENT,
    ID_PRODUTO INT NOT NULL,
    ID_PEDIDO INT NOT NULL,
    QUANTIDADE INT NOT NULL,
    UNIQUE (ID_PRODUTO, ID_PEDIDO),
    FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUTO (ID_PRODUTO),
    FOREIGN KEY (ID_PEDIDO) REFERENCES PEDIDO (ID_PEDIDO),
    CONSTRAINT CHECK_QUANTIDADE CHECK (QUANTIDADE > 0)
);