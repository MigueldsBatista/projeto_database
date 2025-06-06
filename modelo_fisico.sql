-- Active: 1743591236116@@127.0.0.1@3307@hospital_db
DROP DATABASE IF EXISTS hospital_db;
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;
DROP TABLE IF EXISTS PEDIDO_REALIZADO;
DROP TABLE IF EXISTS PRODUTO_PEDIDO;
DROP TABLE IF EXISTS PEDIDO;
DROP TABLE IF EXISTS FATURA;
DROP TABLE IF EXISTS ESTADIA;
DROP TABLE IF EXISTS PACIENTE;
DROP TABLE IF EXISTS CAMAREIRA;
DROP TABLE IF EXISTS QUARTO;
DROP TABLE IF EXISTS PRODUTO;
DROP TABLE IF EXISTS METODO_PAGAMENTO;
DROP TABLE IF EXISTS CATEGORIA_QUARTO;
DROP TABLE IF EXISTS CATEGORIA_PRODUTO;
CREATE TABLE CATEGORIA_QUARTO (
    ID_CATEGORIA INT PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(50) NOT NULL UNIQUE,
    DESCRICAO VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS QUARTO (
    ID_QUARTO INT PRIMARY KEY AUTO_INCREMENT,
    NUMERO INT NOT NULL,
    ID_CATEGORIA_QUARTO INT,
    CONSTRAINT UNIQUE_NUMERO UNIQUE (NUMERO),
    FOREIGN KEY (ID_CATEGORIA_QUARTO) REFERENCES CATEGORIA_QUARTO (ID_CATEGORIA) ON DELETE
    SET NULL
);
CREATE TABLE IF NOT EXISTS PACIENTE (
    ID_PACIENTE INT PRIMARY KEY AUTO_INCREMENT,
    STATUS ENUM('Internado', 'Alta') NOT NULL DEFAULT 'Internado',
    NOME VARCHAR(100) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL UNIQUE,
    CPF VARCHAR(11) UNIQUE NOT NULL,
    DATA_NASCIMENTO DATE NOT NULL,
    TELEFONE VARCHAR(11),
    ENDERECO VARCHAR(255),
    FOTO_PERFIL_BASE64 LONGTEXT NULL,
    SENHA VARCHAR(255) NOT NULL,
    CONSTRAINT CHECK_E_CPF CHECK (LENGTH(CPF) = 11),
    CONSTRAINT CHECK_STATUS CHECK (STATUS IN ('Internado', 'Alta'))
);
CREATE TABLE IF NOT EXISTS CATEGORIA_PRODUTO (
    ID_CATEGORIA INT PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(50) NOT NULL UNIQUE,
    DESCRICAO VARCHAR(255),
    ICONE VARCHAR(50) NULL -- Adicione esta linha
);
CREATE TABLE IF NOT EXISTS PRODUTO (
    ID_PRODUTO INT PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(100) NOT NULL,
    DESCRICAO VARCHAR(255) NOT NULL,
    PRECO DECIMAL(10, 2) NOT NULL CHECK (PRECO > 0),
    TEMPO_PREPARO INT NOT NULL CHECK (TEMPO_PREPARO > 0),
    ID_CATEGORIA_PRODUTO INT,
    ATIVO BOOLEAN DEFAULT TRUE,
    CALORIAS_KCAL INT CHECK (CALORIAS_KCAL >= 0),
    PROTEINAS_G INT CHECK (PROTEINAS_G >= 0),
    CARBOIDRATOS_G INT CHECK (CARBOIDRATOS_G >= 0),
    GORDURAS_G INT CHECK (GORDURAS_G >= 0),
    SODIO_MG INT CHECK (SODIO_MG >= 0),
    CONSTRAINT UNIQUE_NOME UNIQUE (NOME),
    FOREIGN KEY (ID_CATEGORIA_PRODUTO) REFERENCES CATEGORIA_PRODUTO (ID_CATEGORIA) ON DELETE
    SET NULL
);
CREATE TABLE CAMAREIRA (
    ID_CAMAREIRA INT PRIMARY KEY AUTO_INCREMENT,
    CRE VARCHAR(20) NOT NULL UNIQUE,
    NOME VARCHAR(100) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL UNIQUE,
    CPF VARCHAR(11) UNIQUE NOT NULL,
    DATA_NASCIMENTO VARCHAR(10) NOT NULL,
    TELEFONE VARCHAR(11),
    ENDERECO VARCHAR(255),
    CARGO VARCHAR(50) NOT NULL,
    SETOR VARCHAR(50) NOT NULL,
    FOTO_PERFIL_BASE64 TEXT NULL,
    SENHA VARCHAR(255) NOT NULL,
    CONSTRAINT CHECK_CPF CHECK (LENGTH(CPF) = 11)
);
CREATE TABLE IF NOT EXISTS METODO_PAGAMENTO (
    ID_METODO_PAGAMENTO INT PRIMARY KEY AUTO_INCREMENT,
    TIPO VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS ESTADIA (
    ID_PACIENTE INT NOT NULL,
    ID_QUARTO INT NULL,
    DATA_ENTRADA DATETIME(6) PRIMARY KEY DEFAULT CURRENT_TIMESTAMP(6),
    DATA_SAIDA DATETIME(6) NULL,
    UNIQUE (ID_PACIENTE, ID_QUARTO, DATA_ENTRADA),
    FOREIGN KEY (ID_QUARTO) REFERENCES QUARTO (ID_QUARTO) ON DELETE SET NULL,
    FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTE (ID_PACIENTE) ON DELETE CASCADE,
    CONSTRAINT CHECK_ESTADIA_INTERVALO CHECK (
        DATA_SAIDA IS NULL OR DATA_ENTRADA <= DATA_SAIDA
    )
);
CREATE TABLE IF NOT EXISTS FATURA (
    STATUS_PAGAMENTO ENUM('Pendente', 'Pago') DEFAULT 'Pendente' NOT NULL,
    VALOR_TOTAL DECIMAL(10, 2) DEFAULT 0,
    DATA_PAGAMENTO DATETIME(6) NULL,
    ID_METODO_PAGAMENTO INT NULL,
    DATA_EMISSAO DATETIME(6) PRIMARY KEY DEFAULT CURRENT_TIMESTAMP(6),
    DATA_ENTRADA_ESTADIA DATETIME(6) NOT NULL,
    FOREIGN KEY (DATA_ENTRADA_ESTADIA) REFERENCES ESTADIA (DATA_ENTRADA) ON DELETE CASCADE,
    FOREIGN KEY (ID_METODO_PAGAMENTO) REFERENCES METODO_PAGAMENTO(ID_METODO_PAGAMENTO),
    CONSTRAINT CHECK_VALOR_TOTAL CHECK (VALOR_TOTAL >= 0)
);
CREATE TABLE IF NOT EXISTS PEDIDO (
    DATA_ENTRADA_ESTADIA DATETIME(6) NOT NULL,
    ID_CAMAREIRA INT NULL,
    STATUS ENUM(
        'Pendente',
        'Em Preparo',
        'Entregue',
        'Cancelado'
    ) DEFAULT 'Pendente' NOT NULL,
    DATA_PEDIDO DATETIME(6) PRIMARY KEY DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (DATA_ENTRADA_ESTADIA) REFERENCES ESTADIA (DATA_ENTRADA) ON DELETE CASCADE,
    FOREIGN KEY (ID_CAMAREIRA) REFERENCES CAMAREIRA (ID_CAMAREIRA) ON DELETE
    SET NULL
);
CREATE TABLE IF NOT EXISTS PRODUTO_PEDIDO (
    CRIADO_EM DATETIME(6) PRIMARY KEY DEFAULT CURRENT_TIMESTAMP(6),
    ID_PRODUTO INT NOT NULL,
    DATA_PEDIDO DATETIME(6) NOT NULL,
    QUANTIDADE INT NOT NULL,
    FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUTO (ID_PRODUTO) ON DELETE CASCADE,
    FOREIGN KEY (DATA_PEDIDO) REFERENCES PEDIDO (DATA_PEDIDO) ON DELETE CASCADE,
    CONSTRAINT CHECK_QUANTIDADE CHECK (QUANTIDADE > 0)
);
-- Stored Procedure para atualizar o valor total da fatura
-- CREATE PROCEDURE atualizar_valor_fatura(IN data_pedido_param DATETIME(6)) BEGIN DECLARE data_estadia DATETIME(6);
-- SELECT DATA_ENTRADA_ESTADIA INTO data_estadia
-- FROM PEDIDO
-- WHERE DATA_PEDIDO = data_pedido_param;
-- UPDATE FATURA
-- SET VALOR_TOTAL = (
--     SELECT SUM(pp.QUANTIDADE * p.PRECO)
--     FROM PRODUTO_PEDIDO pp
--     JOIN PRODUTO p ON pp.ID_PRODUTO = p.ID_PRODUTO
--     JOIN PEDIDO pe ON pp.DATA_PEDIDO = pe.DATA_PEDIDO
--     WHERE pe.DATA_ENTRADA_ESTADIA = data_estadia
-- )
-- WHERE DATA_ENTRADA_ESTADIA = data_estadia;
-- END;
-- -- Query to show total from all produto pedidos and quantity for a specific fatura
-- UPDATE FATURA
-- SET VALOR_TOTAL = (
--     SELECT SUM(PRODUTO_PEDIDO.QUANTIDADE * PRODUTO.PRECO)
--     FROM PEDIDO
--     JOIN PRODUTO_PEDIDO ON PEDIDO.DATA_PEDIDO = PRODUTO_PEDIDO.DATA_PEDIDO
--     JOIN PRODUTO ON PRODUTO_PEDIDO.ID_PRODUTO = PRODUTO.ID_PRODUTO
--     WHERE PEDIDO.DATA_ENTRADA_ESTADIA = FATURA.DATA_ENTRADA_ESTADIA
-- )
-- WHERE FATURA.DATA_EMISSAO = '2025-04-21 20:59:19.208995'; -- Substitua pela data desejada

-- DELIMITER $$

-- CREATE TRIGGER trg_after_insert_pedido
-- AFTER INSERT ON PEDIDO
-- FOR EACH ROW
-- BEGIN
--     -- Chama a procedure para atualizar o valor total da fatura
--     CALL atualizar_valor_fatura(NEW.DATA_PEDIDO);
-- END$$

-- DELIMITER ;


-- Query to show total from all produto pedidos and quantity for a specific fatura
-- UPDATE FATURA
-- SET VALOR_TOTAL = (
--     SELECT SUM(PRODUTO_PEDIDO.QUANTIDADE * PRODUTO.PRECO)
--     FROM PEDIDO
--     JOIN PRODUTO_PEDIDO ON PEDIDO.DATA_PEDIDO = PRODUTO_PEDIDO.DATA_PEDIDO
--     JOIN PRODUTO ON PRODUTO_PEDIDO.ID_PRODUTO = PRODUTO.ID_PRODUTO
--     WHERE PEDIDO.DATA_ENTRADA_ESTADIA = FATURA.DATA_ENTRADA_ESTADIA
-- )
-- WHERE FATURA.DATA_EMISSAO = '2025-04-21 20:59:19.208995'; -- Substitua pela data desejada

-- DELIMITER $$
-- CREATE PROCEDURE GET_MAIS_PEDIDOS_POR_CATEGORIA()
-- BEGIN
--     SELECT
--         cp.NOME AS categoria,
--         p.NOME AS produto,
--         COUNT(pp.ID_PRODUTO) AS total_pedidos
--     FROM PRODUTO_PEDIDO pp
--     JOIN PRODUTO p ON pp.ID_PRODUTO = p.ID_PRODUTO
--     JOIN CATEGORIA_PRODUTO cp ON p.ID_CATEGORIA_PRODUTO = cp.ID_CATEGORIA
--     GROUP BY cp.ID_CATEGORIA, cp.NOME, p.ID_PRODUTO, p.NOME
--     HAVING COUNT(pp.ID_PRODUTO) = (
--         SELECT MAX(sub.cnt)
--         FROM (
--             SELECT COUNT(pp2.ID_PRODUTO) AS cnt
--             FROM PRODUTO_PEDIDO pp2
--             JOIN PRODUTO p2 ON pp2.ID_PRODUTO = p2.ID_PRODUTO
--             WHERE p2.ID_CATEGORIA_PRODUTO = p.ID_CATEGORIA_PRODUTO
--             GROUP BY pp2.ID_PRODUTO
--         ) AS sub
--     );
-- END$$
-- DELIMITER ;

-- Chamada da procedure

-- DELIMITER $$

-- CREATE PROCEDURE atualizar_valor_fatura(IN data_pedido_param DATETIME(6)) BEGIN DECLARE data_estadia DATETIME(6);
-- SELECT DATA_ENTRADA_ESTADIA INTO data_estadia
-- FROM PEDIDO
-- WHERE DATA_PEDIDO = data_pedido_param;
-- UPDATE FATURA
-- SET VALOR_TOTAL = (
--     SELECT SUM(pp.QUANTIDADE * p.PRECO)
--     FROM PRODUTO_PEDIDO pp
--     JOIN PRODUTO p ON pp.ID_PRODUTO = p.ID_PRODUTO
--     JOIN PEDIDO pe ON pp.DATA_PEDIDO = pe.DATA_PEDIDO
--     WHERE pe.DATA_ENTRADA_ESTADIA = data_estadia
-- )
-- WHERE DATA_ENTRADA_ESTADIA = data_estadia;

-- END $$
-- DELIMITER ;