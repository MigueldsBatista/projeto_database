CREATE TABLE IF NOT EXISTS QUARTO (
    ID_QUARTO INT PRIMARY KEY AUTO_INCREMENT,
    NUMERO INT NOT NULL,
    TIPO ENUM(
        'Enfermaria',
        'Apartamento',
        'UTI',
        'Sala de Exame',
        'Outro'
    ) NOT NULL
);

CREATE TABLE IF NOT EXISTS PACIENTE (
    ID_PACIENTE INT PRIMARY KEY AUTO_INCREMENT,
    STATUS ENUM('Internado', 'Alta') NOT NULL,
    NOME VARCHAR(100) NOT NULL,
    CPF VARCHAR(11) UNIQUE NOT NULL,
    DATA_NASCIMENTO DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS PRODUTO (
    ID_PRODUTO INT PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(100) NOT NULL,
    DESCRICAO TEXT NOT NULL,
    PRECO DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS PEDIDO (
    ID_PEDIDO INT PRIMARY KEY AUTO_INCREMENT,
    ID_ESTADIA INT NOT NULL,
    DATA_PEDIDO DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ID_ESTADIA INT NOT NULL,
    FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA)
);

CREATE TABLE IF NOT EXISTS PRODUTO_PEDIDO (
    ID_PRODUTO_PEDIDO INT PRIMARY KEY AUTO_INCREMENT,
    ID_PRODUTO INT NOT NULL,
    ID_PEDIDO INT NOT NULL,
    QUANTIDADE INT NOT NULL,
    FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUTO (ID_PRODUTO),
    FOREIGN KEY (ID_PEDIDO) REFERENCES PEDIDO (ID_PEDIDO)
);

CREATE TABLE IF NOT EXISTS CAMAREIRA (
    ID_CAMAREIRA INT PRIMARY KEY AUTO_INCREMENT,
    NOME VARCHAR(100) NOT NULL,
    CARGO VARCHAR(50) NOT NULL,
    SETOR VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS METODO_PAGAMENTO (
    ID_METODO_PAGAMENTO INT PRIMARY KEY AUTO_INCREMENT,
    TIPO ENUM('Cartão de Crédito', 'Cartão de Débito', 'Pix') NOT NULL
);

CREATE TABLE IF NOT EXISTS ESTADIA (
    ID_ESTADIA INT PRIMARY KEY AUTO_INCREMENT,
    ID_CAMAREIRA INT NOT NULL,
    ID_PACIENTE INT NOT NULL,
    ID_QUARTO INT NOT NULL,
    ID_FATURA INT NOT NULL,
    DATA_ENTRADA DATETIME NOT NULL,
    DATA_SAIDA DATETIME NULL, --DATA DE SAIDA NULA POIS SABESE LA QUANDO O PACIENTE VAI FICAR MELHOR
    UNIQUE (
        ID_CAMAREIRA,
        ID_PACIENTE,
        ID_QUARTO,
        DATA_ENTRADA,
    ),
    FOREIGN KEY (ID_CAMAREIRA) REFERENCES CAMAREIRA (ID_CAMAREIRA),
    FOREIGN KEY (ID_QUARTO) REFERENCES QUARTO (ID_QUARTO) ,
    FOREIGN KEY (ID_FATURA) REFERENCES FATURA (ID_FATURA),
    FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTE (ID_PACIENTE)
);

CREATE TABLE IF NOT EXISTS FATURA (
    ID_FATURA INT PRIMARY KEY AUTO_INCREMENT,
    STATUS_PAGAMENTO ENUM('Pendente', 'Pago') NOT NULL,
    VALOR_TOTAL DECIMAL(10, 2) NOT NULL,
    DATA_PAGAMENTO DATETIME NULL,    --DATA DE SAIDA NULA POIS SABESE LA QUANDO O PACIENTE VAI PAGAR
    ID_METODO_PAGAMENTO INT NOT NULL,
    DATA_EMISSAO DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ID_ESTADIA INT NOT NULL,
    FOREIGN KEY (ID_ESTADIA) REFERENCES ESTADIA (ID_ESTADIA),
    FOREIGN KEY (ID_METODO_PAGAMENTO) REFERENCES METODO_PAGAMENTO(ID_METODO_PAGAMENTO)--oi
);
