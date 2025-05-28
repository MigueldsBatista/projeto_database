-- Active: 1743591236116@@127.0.0.1@3307@hospital_db
USE hospital_db;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE PRODUTO_PEDIDO;
TRUNCATE TABLE PEDIDO;
TRUNCATE TABLE FATURA;
TRUNCATE TABLE ESTADIA;
TRUNCATE TABLE PACIENTE;
TRUNCATE TABLE CAMAREIRA;
TRUNCATE TABLE QUARTO;
TRUNCATE TABLE PRODUTO;
TRUNCATE TABLE METODO_PAGAMENTO;
TRUNCATE TABLE CATEGORIA_PRODUTO;
TRUNCATE TABLE CATEGORIA_QUARTO;
-- TRUNCATE TABLE PESSOA;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert data into CATEGORIA_QUARTO
INSERT INTO CATEGORIA_QUARTO (NOME, DESCRICAO) VALUES
('Enfermaria', 'Quarto compartilhado para múltiplos pacientes'),
('Apartamento', 'Quarto individual para um único paciente'),
('UTI', 'Unidade de Terapia Intensiva com equipamentos especializados'),
('Sala de Exame', 'Espaço dedicado para realização de exames'),
('Outro', 'Outros tipos de quartos hospitalares');

-- Insert data into CATEGORIA_PRODUTO
INSERT INTO CATEGORIA_PRODUTO (NOME, DESCRICAO, ICONE) VALUES
('Café da Manhã', 'Refeições servidas pela manhã', 'fa-mug-hot'),
('Almoço', 'Refeições servidas ao meio-dia', 'fa-utensils'),
('Jantar', 'Refeições servidas à noite', 'fa-drumstick-bite'),
('Sobremesa', 'Itens doces após as refeições principais', 'fa-ice-cream'),
('Lanche', 'Pequenas refeições entre as principais', 'fa-bread-slice');

-- Insert data into QUARTO
INSERT INTO QUARTO (NUMERO, `ID_CATEGORIA_QUARTO`) VALUES
(101, 2), -- Apartamento
(102, 2), -- Apartamento
(103, 2), -- Apartamento
(104, 2), -- Apartamento
(105, 2), -- Apartamento
(201, 1), -- Enfermaria
(202, 1), -- Enfermaria
(203, 1), -- Enfermaria
(204, 1), -- Enfermaria
(205, 1), -- Enfermaria
(301, 3), -- UTI
(302, 3), -- UTI
(303, 3), -- UTI
(304, 3), -- UTI
(305, 3), -- UTI
(401, 4), -- Sala de Exame
(402, 4), -- Sala de Exame
(403, 4), -- Sala de Exame
(404, 4), -- Sala de Exame
(405, 4), -- Sala de Exame
(501, 5), -- Outro
(502, 5), -- Outro
(503, 5), -- Outro
(504, 5), -- Outro
(505, 5); -- Outro

-- Insert data into PACIENTE

-- Insert data into PRODUTO
INSERT INTO PRODUTO (NOME, DESCRICAO, PRECO, TEMPO_PREPARO, ID_CATEGORIA_PRODUTO, CALORIAS_KCAL, PROTEINAS_G, CARBOIDRATOS_G, GORDURAS_G, SODIO_MG) VALUES
('Café da Manhã Completo', 'Café, leite, pão, manteiga, geleia, frutas', 25.00, 15, 1, 450, 12, 65, 15, 380),
('Omelete de Queijo', 'Omelete com queijo e tomate', 18.50, 10, 1, 320, 18, 5, 25, 420),
('Mingau de Aveia', 'Mingau de aveia com canela e maçã', 15.00, 12, 1, 220, 8, 35, 6, 120),
('Salada de Frutas', 'Mix de frutas da estação', 12.00, 8, 1, 120, 2, 28, 0, 15),
('Torrada Integral', 'Torrada integral com geleia light', 10.00, 5, 1, 180, 5, 30, 3, 200),
('Frango Grelhado', 'Peito de frango grelhado com legumes', 35.00, 25, 2, 320, 38, 12, 10, 280),
('Salmão ao Molho de Ervas', 'Filé de salmão com molho de ervas e batata', 48.00, 30, 2, 420, 32, 25, 22, 350),
('Risoto de Legumes', 'Risoto cremoso com legumes da estação', 28.00, 22, 2, 380, 10, 60, 12, 320),
('Sopa de Vegetais', 'Sopa leve de vegetais variados', 18.00, 15, 2, 180, 6, 25, 5, 310),
('Salada Caesar', 'Salada com alface, croutons e frango', 22.00, 12, 2, 250, 18, 15, 12, 380),
('Filé Mignon', 'Filé mignon com purê de batatas', 52.00, 30, 3, 450, 35, 30, 20, 420),
('Peixe ao Forno', 'Peixe assado com ervas e legumes', 42.00, 28, 3, 380, 30, 18, 18, 350),
('Lasanha de Berinjela', 'Lasanha de berinjela com molho de tomate', 32.00, 25, 3, 320, 15, 35, 14, 380),
('Sopa de Cebola', 'Sopa de cebola gratinada', 20.00, 20, 3, 220, 8, 25, 10, 420),
('Wrap Vegetariano', 'Wrap com vegetais grelhados e homus', 25.00, 15, 3, 280, 12, 35, 10, 350),
('Pudim de Leite', 'Pudim caseiro de leite condensado', 15.00, 10, 4, 280, 6, 45, 8, 120),
('Mousse de Chocolate', 'Mousse leve de chocolate meio amargo', 18.00, 12, 4, 320, 5, 40, 15, 80),
('Salada de Frutas Diet', 'Salada de frutas sem açúcar', 12.00, 8, 4, 100, 1, 24, 0, 10),
('Gelatina Light', 'Gelatina de frutas vermelhas light', 8.00, 5, 4, 60, 2, 12, 0, 15),
('Iogurte com Granola', 'Iogurte natural com granola e mel', 14.00, 5, 4, 180, 8, 25, 5, 60),
('Panqueca Integral', 'Panqueca integral com recheio de frango', 22.00, 15, 1, 280, 18, 30, 10, 310),
('Canja de Galinha', 'Canja de galinha tradicional', 25.00, 20, 3, 220, 18, 20, 8, 350),
('Sorvete Diet', 'Sorvete diet de baunilha', 10.00, 5, 4, 120, 3, 15, 5, 40);

-- Insert data into CAMAREIRA
INSERT INTO CAMAREIRA (CRE, NOME, CPF, DATA_NASCIMENTO, TELEFONE, ENDERECO, CARGO, SETOR, EMAIL, SENHA) VALUES
('CR001', 'Amanda Castro', '12349567891', '1977-03-25', '11787654321', 'Rua das Orquídeas, 012, Curitiba', 'Camareira Sênior', 'Hotelaria', 'amanda.castro@hospital.com', 'senha123'),
('CR002', 'Henrique Cardoso', '23458678902', '1986-06-30', '11776543210', 'Avenida das Américas, 345, Rio de Janeiro', 'Camareiro', 'Hotelaria', 'henrique.cardoso@hospital.com', 'senha123'),
('CR003', 'Juliana Santos', '34567989013', '1992-02-15', '11765432109', 'Rua dos Cravos, 678, Salvador', 'Camareira', 'Hotelaria', 'juliana.santos@hospital.com', 'senha123'),
('CR004', 'Felipe Oliveira', '45676890124', '1973-10-05', '11754321098', 'Avenida Paulista, 901, São Paulo', 'Camareiro Sênior', 'Hotelaria', 'felipe.oliveira@hospital.com', 'senha123'),
('CR005', 'Mariana Ferreira', '56785901235', '1984-07-20', '11743210987', 'Rua das Rosas, 234, Fortaleza', 'Camareira', 'Hotelaria', 'mariana.ferreira@hospital.com', 'senha123'),
('CR007', 'Bianca Lima', '78901234568', '1982-09-05', '11721098765', 'Rua das Acácias, 890, Porto Alegre', 'Camareira', 'Hotelaria', 'bianca.lima@hospital.com', 'senha123'),
('CR010', 'André Pereira', '01234567891', '1979-06-30', '11698765432', 'Avenida Paulista, 789, São Paulo', 'Camareiro', 'Hotelaria', 'andre.pereira@hospital.com', 'senha123'),
('CR011', 'Renata Souza', '12345678902', '1991-03-15', '11687654321', 'Rua das Flores, 012, Belo Horizonte', 'Camareira', 'Hotelaria', 'renata.souza@hospital.com', 'senha123'),
('CR012', 'Thiago Nunes', '23456789013', '1984-08-22', '11676543210', 'Avenida Atlântica, 345, Rio de Janeiro', 'Camareiro', 'Hotelaria', 'thiago.nunes@hospital.com', 'senha123'),
('CR013', 'Fernanda Oliveira', '34567890124', '1976-05-10', '11665432109', 'Rua dos Lírios, 678, Salvador', 'Camareira Sênior', 'Hotelaria', 'fernanda.oliveira@hospital.com', 'senha123'),
('CR014', 'Leonardo Santos', '45678901235', '1989-12-07', '11654321098', 'Avenida Boa Vista, 901, Recife', 'Camareiro', 'Hotelaria', 'leonardo.santos@hospital.com', 'senha123'),
('CR015', 'Daniela Lima', '56789012346', '1981-02-18', '11643210987', 'Rua das Margaridas, 234, Curitiba', 'Camareira', 'Hotelaria', 'daniela.lima@hospital.com', 'senha123'),
('CR016', 'Rafael Almeida', '67890123457', '1993-07-25', '11632109876', 'Avenida São João, 567, São Paulo', 'Camareiro', 'Hotelaria', 'rafael.almeida@hospital.com', 'senha123'),
('CR018', 'Gustavo Cardoso', '89012345679', '1986-09-17', '11610987654', 'Avenida Rebouças, 123, São Paulo', 'Camareiro Sênior', 'Hotelaria', 'gustavo.cardoso@hospital.com', 'senha123'),
('CR019', 'Natália Torres', '90123456780', '1994-01-30', '11609876543', 'Rua das Violetas, 456, Porto Alegre', 'Camareira', 'Hotelaria', 'natalia.torres@hospital.com', 'senha123');
-- Insert data into CAMAREIRA
INSERT INTO PACIENTE (NOME, CPF, DATA_NASCIMENTO, TELEFONE, ENDERECO, EMAIL, SENHA) VALUES
('Amanda Castro', '12349567891', '1977-03-25', '11787654321', 'Rua das Orquídeas, 012, Curitiba', 'amanda.castro@email.com', 'senha123'),
('Miguel Batista', '23458678902', '1986-06-30', '11776543210', 'Avenida das Américas, 345, Rio de Janeiro', 'msb2@cesar.school', '123'),
('Juliana Santos', '34567989013', '1992-02-15', '11765432109', 'Rua dos Cravos, 678, Salvador', 'juliana.santos@email.com', 'senha123'),
('Felipe Oliveira', '45676890124', '1973-10-05', '11754321098', 'Avenida Paulista, 901, São Paulo', 'felipe.oliveira@email.com', 'senha123'),
('Mariana Ferreira', '56785901235', '1984-07-20', '11743210987', 'Rua das Rosas, 234, Fortaleza', 'mariana.ferreira@email.com', 'senha123'),
('Bianca Lima', '78901234568', '1982-09-05', '11721098765', 'Rua das Acácias, 890, Porto Alegre', 'bianca.lima@email.com', 'senha123'),
('André Pereira', '01234567891', '1979-06-30', '11698765432', 'Avenida Paulista, 789, São Paulo', 'andre.pereira@email.com', 'senha123'),
('Renata Souza', '12345678902', '1991-03-15', '11687654321', 'Rua das Flores, 012, Belo Horizonte', 'renata.souza@email.com', 'senha123'),
('Thiago Nunes', '23456789013', '1984-08-22', '11676543210', 'Avenida Atlântica, 345, Rio de Janeiro', 'thiago.nunes@email.com', 'senha123'),
('Fernanda Oliveira', '34567890124', '1976-05-10', '11665432109', 'Rua dos Lírios, 678, Salvador', 'fernanda.oliveira@email.com', 'senha123'),
('Leonardo Santos', '45678901235', '1989-12-07', '11654321098', 'Avenida Boa Vista, 901, Recife', 'leonardo.santos@email.com', 'senha123'),
('Daniela Lima', '56789012346', '1981-02-18', '11643210987', 'Rua das Margaridas, 234, Curitiba', 'daniela.lima@email.com', 'senha123'),
('Rafael Almeida', '67890123457', '1993-07-25', '11632109876', 'Avenida São João, 567, São Paulo', 'rafael.almeida@email.com', 'senha123'),
('Gustavo Cardoso', '89012345679', '1986-09-17', '11610987654', 'Avenida Rebouças, 123, São Paulo', 'gustavo.cardoso@email.com', 'senha123'),
('Natália Torres', '90123456780', '1994-01-30', '11609876543', 'Rua das Violetas, 456, Porto Alegre', 'natalia.torres@email.com', 'senha123');

-- Insert data into METODO_PAGAMENTO
INSERT INTO METODO_PAGAMENTO (TIPO) VALUES
('Cartão de Crédito'),
('Cartão de Débito'),
('Dinheiro'),
('PIX'),
('Transferência Bancária'),
('Boleto'),
('Cheque'),
('Vale Saúde'),
('Seguro Saúde'),
('Convênio Médico'),
('PayPal'),
('Apple Pay'),
('Google Pay'),
('Samsung Pay'),
('Crediário'),
('Vale Refeição'),
('Vale Alimentação'),
('Criptomoeda'),
('Parcelamento'),
('Desconto em Folha');

-- Insert data into ESTADIA
INSERT INTO ESTADIA (ID_PACIENTE, ID_QUARTO, DATA_ENTRADA, DATA_SAIDA) VALUES
(1, 1, '2023-01-10 08:30:00', NULL),
(2, 2, '2023-01-12 10:15:00', NULL),
(3, 3, '2023-01-15 14:45:00', '2023-01-25 11:30:00'),
(4, 4, '2023-01-18 09:20:00', NULL),
(5, 5, '2023-01-20 16:00:00', NULL),
(6, 6, '2023-01-22 11:30:00', '2023-01-30 10:15:00'),
(7, 7, '2023-01-25 13:45:00', NULL),
(8, 8, '2023-01-28 15:20:00', '2023-02-05 09:30:00'),
(9, 9, '2023-02-01 08:00:00', NULL),
(10, 10, '2023-02-03 10:30:00', NULL),
(11, 11, '2023-02-05 14:15:00', NULL),
(12, 12, '2023-02-08 09:45:00', '2023-02-18 13:00:00'),
(13, 13, '2023-02-10 11:20:00', NULL),
(14, 14, '2023-02-15 16:30:00', '2023-02-25 10:45:00'),
(15, 15, '2023-02-18 08:15:00', NULL),
(1, 16, '2023-02-20 13:00:00', NULL),
(2, 17, '2023-02-22 15:45:00', '2023-03-01 11:30:00'),
(3, 18, '2023-02-25 10:20:00', NULL),
(4, 19, '2023-02-28 12:30:00', '2023-03-10 09:15:00'),
(5, 20, '2023-03-01 14:00:00', NULL),
(6, 21, '2023-03-05 09:30:00', '2023-03-15 11:00:00'),
(7, 22, '2023-03-08 11:45:00', '2023-03-18 10:30:00'),
(8, 23, '2023-03-10 13:15:00', '2023-03-20 14:45:00'),
(9, 24, '2023-03-12 16:00:00', '2023-03-22 09:30:00'),
(10, 25, '2023-03-15 08:45:00', '2023-03-25 13:00:00');

-- Insert data into FATURA
INSERT INTO FATURA (STATUS_PAGAMENTO, VALOR_TOTAL, DATA_PAGAMENTO, ID_METODO_PAGAMENTO, DATA_EMISSAO, DATA_ENTRADA_ESTADIA) VALUES
('Pendente', 1500.00, NULL, 1, '2023-01-15 10:30:00', '2023-01-10 08:30:00'),
('Pendente', 1200.00, NULL, 2, '2023-01-17 12:45:00', '2023-01-12 10:15:00'),
('Pago', 2000.00, '2025-05-26 09:15:00', 3, '2023-01-25 16:30:00', '2023-01-15 14:45:00'),
('Pendente', 1800.00, NULL, 4, '2023-01-23 11:20:00', '2023-01-18 09:20:00'),
('Pendente', 2200.00, NULL, 5, '2023-01-25 13:40:00', '2023-01-20 16:00:00'),
('Pago', 1700.00, '2025-05-31 14:50:00', 6, '2023-01-30 15:25:00', '2023-01-22 11:30:00'),
('Pendente', 2500.00, NULL, 7, '2023-01-30 10:15:00', '2023-01-25 13:45:00'),
('Pago', 1900.00, '2025-05-06 11:30:00', 8, '2023-02-05 14:20:00', '2023-01-28 15:20:00'),
('Pendente', 2300.00, NULL, 9, '2023-02-06 09:45:00', '2023-02-01 08:00:00'),
('Pendente', 2100.00, NULL, 10, '2023-02-08 13:10:00', '2023-02-03 10:30:00'),
('Pendente', 2400.00, NULL, 1, '2023-02-10 15:30:00', '2023-02-05 14:15:00'),
('Pago', 1600.00, '2025-05-19 10:45:00', 2, '2023-02-18 16:20:00', '2023-02-08 09:45:00'),
('Pendente', 2800.00, NULL, 3, '2023-02-15 12:35:00', '2023-02-10 11:20:00'),
('Pago', 2000.00, '2025-05-26 14:15:00', 4, '2023-02-25 15:50:00', '2023-02-15 16:30:00'),
('Pendente', 2600.00, NULL, 5, '2023-02-23 09:40:00', '2023-02-18 08:15:00'),
('Pendente', 1800.00, NULL, 6, '2023-02-25 11:25:00', '2023-02-20 13:00:00'),
('Pago', 2200.00, '2025-05-02 13:30:00', 7, '2023-03-01 16:15:00', '2023-02-22 15:45:00'),
('Pendente', 2400.00, NULL, 8, '2023-03-02 10:10:00', '2023-02-25 10:20:00'),
('Pago', 1900.00, '2025-05-11 11:45:00', 9, '2023-03-10 14:30:00', '2023-02-28 12:30:00'),
('Pendente', 2700.00, NULL, 10, '2023-03-06 15:20:00', '2023-03-01 14:00:00'),
('Pago', 1500.00, '2025-05-16 09:30:00', 1, '2023-03-15 12:40:00', '2023-03-05 09:30:00'),
('Pago', 2100.00, '2025-05-19 13:15:00', 2, '2023-03-18 16:00:00', '2023-03-08 11:45:00'),
('Pago', 1800.00, '2025-05-21 10:45:00', 3, '2023-03-20 15:30:00', '2023-03-10 13:15:00'),
('Pago', 2300.00, '2025-05-23 14:20:00', 4, '2023-03-22 11:15:00', '2023-03-12 16:00:00'),
('Pago', 2500.00, '2025-05-26 16:10:00', 5, '2023-03-25 13:45:00', '2023-03-15 08:45:00');

-- Insert data into PEDIDO
INSERT INTO PEDIDO (DATA_ENTRADA_ESTADIA, ID_CAMAREIRA, STATUS, DATA_PEDIDO) VALUES
('2023-01-10 08:30:00', 1, 'Pendente', '2023-01-10 12:30:00'),
('2023-01-12 10:15:00', 2, 'Em Preparo', '2023-01-12 18:45:00'),
('2023-01-15 14:45:00', 3, 'Entregue', '2023-01-16 08:15:00'),
('2023-01-18 09:20:00', 4, 'Pendente', '2023-01-18 13:20:00'),
('2023-01-20 16:00:00', 5, 'Em Preparo', '2023-01-20 19:10:00'),
('2023-01-22 11:30:00', 1, 'Entregue', '2023-01-23 07:45:00'),
('2023-01-25 13:45:00', 2, 'Pendente', '2023-01-25 14:30:00'),
('2023-01-28 15:20:00', 3, 'Em Preparo', '2023-01-29 20:15:00'),
('2023-02-01 08:00:00', 4, 'Entregue', '2023-02-01 09:40:00'),
('2023-02-03 10:30:00', 5, 'Pendente', '2023-02-03 15:25:00'),
('2023-02-05 14:15:00', 1, 'Em Preparo', '2023-02-05 21:00:00'),
('2023-02-08 09:45:00', 2, 'Entregue', '2023-02-09 10:45:00'),
('2023-02-10 11:20:00', 3, 'Pendente', '2023-02-10 16:30:00'),
('2023-02-15 16:30:00', 4, 'Em Preparo', '2023-02-16 22:15:00'),
('2023-02-18 08:15:00', 5, 'Entregue', '2023-02-18 11:50:00'),
('2023-02-20 13:00:00', 1, 'Pendente', '2023-02-20 17:35:00'),
('2023-02-22 15:45:00', 2, 'Em Preparo', '2023-02-22 23:20:00'),
('2023-02-25 10:20:00', 3, 'Entregue', '2023-02-26 12:05:00'),
('2023-02-28 12:30:00', 4, 'Pendente', '2023-02-28 18:50:00'),
('2023-03-01 14:00:00', 5, 'Em Preparo', '2023-03-01 00:35:00'),
('2023-03-05 09:30:00', 1, 'Entregue', '2023-03-06 13:20:00'),
('2023-03-08 11:45:00', 2, 'Pendente', '2023-03-08 19:05:00'),
('2023-03-10 13:15:00', 3, 'Em Preparo', '2023-03-11 00:50:00'),
('2023-03-12 16:00:00', 4, 'Entregue', '2023-03-12 14:35:00'),
('2023-03-15 08:45:00', 5, 'Pendente', '2023-03-15 20:20:00');
-- Insert data into PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE)

-- First batch
INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(1, '2023-01-10 12:30:00', 1);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(6, '2023-01-10 12:30:00', 2);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(16, '2023-01-10 12:30:00', 2);

-- Second batch
INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(2, '2023-01-12 18:45:00', 2);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(7, '2023-01-12 18:45:00', 1);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(17, '2023-01-12 18:45:00', 1);

-- Third batch
INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(3, '2023-01-16 08:15:00', 1);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(8, '2023-01-16 08:15:00', 2);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(18, '2023-01-16 08:15:00', 1);

-- Fourth batch
INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(4, '2023-01-18 13:20:00', 2);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(9, '2023-01-18 13:20:00', 1);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(19, '2023-01-18 13:20:00', 1);

-- Fifth batch
INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(5, '2023-01-20 19:10:00', 1);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(10, '2023-01-20 19:10:00', 1);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(20, '2023-01-20 19:10:00', 2);

-- Remaining batches follow the same pattern
INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(1, '2023-01-23 07:45:00', 2);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(11, '2023-01-23 07:45:00', 1);

INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES
(16, '2023-01-23 07:45:00', 1);

-- And so on for all the remaining entries...

-- Amostras de estadias para novas faturas agregadas
INSERT INTO ESTADIA (ID_PACIENTE, ID_QUARTO, DATA_ENTRADA, DATA_SAIDA) VALUES
(1, 1, '2024-01-10 08:00:00', NULL),
(2, 2, '2024-01-15 08:00:00', NULL),
(3, 3, '2024-02-01 08:00:00', NULL),
(4, 4, '2024-03-05 08:00:00', NULL),
(5, 5, '2025-01-10 08:00:00', NULL),
(6, 6, '2025-02-15 08:00:00', NULL),
(7, 7, '2025-05-05 08:00:00', NULL),
(8, 8, '2025-05-15 08:00:00', NULL),
(9, 9, '2025-05-20 08:00:00', NULL),
(10, 10, '2025-05-25 08:00:00', NULL),
(11, 11, '2025-06-01 08:00:00', NULL),
(12, 12, '2025-06-10 08:00:00', NULL),
(13, 13, '2025-07-01 08:00:00', NULL),
(14, 14, '2025-07-10 08:00:00', NULL),
(15, 15, '2025-08-01 08:00:00', NULL);

-- Amostras de faturas pagas para teste de agregação (todas as datas de estadia agora existem)
INSERT INTO FATURA (STATUS_PAGAMENTO, VALOR_TOTAL, DATA_PAGAMENTO, ID_METODO_PAGAMENTO, DATA_EMISSAO, DATA_ENTRADA_ESTADIA)
VALUES
('Pago', 150.00, '2024-01-15 10:00:00', 1, '2024-01-15 09:00:00', '2024-01-10 08:00:00'),
('Pago', 200.00, '2024-01-20 11:00:00', 2, '2024-01-20 10:00:00', '2024-01-15 08:00:00'),
('Pago', 300.00, '2024-02-05 12:00:00', 1, '2024-02-05 11:00:00', '2024-02-01 08:00:00'),
('Pago', 400.00, '2024-03-10 13:00:00', 2, '2024-03-10 12:00:00', '2024-03-05 08:00:00'),
('Pago', 250.00, '2025-01-12 14:00:00', 1, '2025-01-12 13:00:00', '2025-01-10 08:00:00'),
('Pago', 350.00, '2025-02-18 15:00:00', 2, '2025-02-18 14:00:00', '2025-02-15 08:00:00'),
('Pago', 500.00, '2025-05-10 16:00:00', 1, '2025-05-10 15:00:00', '2025-05-05 08:00:00'),
('Pago', 600.00, '2025-05-20 17:00:00', 2, '2025-05-20 16:00:00', '2025-05-15 08:00:00'),
('Pago', 700.00, '2025-05-25 18:00:00', 1, '2025-05-25 17:00:00', '2025-05-20 08:00:00'),
('Pago', 800.00, '2025-05-28 19:00:00', 2, '2025-05-28 18:00:00', '2025-05-25 08:00:00'),
('Pago', 900.00, '2025-06-15 10:00:00', 1, '2025-06-15 09:00:00', '2025-06-01 08:00:00'),
('Pago', 1000.00, '2025-06-20 11:00:00', 2, '2025-06-20 10:00:00', '2025-06-10 08:00:00'),
('Pago', 1100.00, '2025-07-05 12:00:00', 1, '2025-07-05 11:00:00', '2025-07-01 08:00:00'),
('Pago', 1200.00, '2025-07-15 13:00:00', 2, '2025-07-15 12:00:00', '2025-07-10 08:00:00'),
('Pago', 1300.00, '2025-08-10 14:00:00', 1, '2025-08-10 13:00:00', '2025-08-01 08:00:00');
