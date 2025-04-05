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
TRUNCATE TABLE PESSOA;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert data into PESSOA
INSERT INTO PESSOA (CPF, NOME, DATA_NASCIMENTO, TELEFONE, ENDERECO) VALUES
('12345678901', 'Maria Silva', '1980-05-15', '11987654321', 'Rua das Flores, 123, São Paulo'),
('23456789012', 'João Santos', '1975-08-22', '11976543210', 'Avenida Brasil, 456, Rio de Janeiro'),
('34567890123', 'Ana Oliveira', '1990-03-10', '11965432109', 'Rua dos Pinheiros, 789, Belo Horizonte'),
('45678901234', 'Carlos Ferreira', '1982-11-27', '11954321098', 'Avenida Paulista, 1000, São Paulo'),
('56789012345', 'Juliana Costa', '1988-04-05', '11943210987', 'Rua das Palmeiras, 234, Salvador'),
('67890123456', 'Pedro Almeida', '1979-09-14', '11932109876', 'Avenida Atlântica, 567, Rio de Janeiro'),
('78901234567', 'Fernanda Lima', '1995-01-30', '11921098765', 'Rua dos Lírios, 890, Curitiba'),
('89012345678', 'Roberto Souza', '1970-07-18', '11910987654', 'Avenida Getúlio Vargas, 123, Belo Horizonte'),
('90123456789', 'Luciana Martins', '1985-12-03', '11909876543', 'Rua das Acácias, 456, Fortaleza'),
('01234567890', 'Eduardo Pereira', '1992-06-25', '11898765432', 'Avenida Boa Viagem, 789, Recife'),
('12340567891', 'Camila Rodrigues', '1978-02-08', '11887654321', 'Rua dos Ipês, 012, Brasília'),
('23451678902', 'Marcelo Barbosa', '1983-10-17', '11876543210', 'Avenida Beira Mar, 345, Florianópolis'),
('34562789013', 'Patricia Cardoso', '1991-07-22', '11865432109', 'Rua das Margaridas, 678, Porto Alegre'),
('45673890124', 'Lucas Ribeiro', '1976-04-09', '11854321098', 'Avenida Faria Lima, 901, São Paulo'),
('56784901235', 'Aline Gomes', '1987-11-14', '11843210987', 'Rua dos Girassóis, 234, Manaus'),
('67895012346', 'Rafael Torres', '1993-05-28', '11832109876', 'Avenida Copacabana, 567, Rio de Janeiro'),
('78906123457', 'Cristina Nunes', '1981-09-03', '11821098765', 'Rua das Violetas, 890, Goiânia'),
('89017234568', 'Marcos Mendes', '1974-01-19', '11810987654', 'Avenida Nove de Julho, 123, São Paulo'),
('90128345679', 'Vanessa Lopes', '1989-08-07', '11809876543', 'Rua dos Jasmins, 456, Belém'),
('01239456780', 'Bruno Dias', '1994-12-12', '11798765432', 'Avenida Afonso Pena, 789, Belo Horizonte'),
('12349567891', 'Amanda Castro', '1977-03-25', '11787654321', 'Rua das Orquídeas, 012, Curitiba'),
('23458678902', 'Henrique Cardoso', '1986-06-30', '11776543210', 'Avenida das Américas, 345, Rio de Janeiro'),
('34567989013', 'Juliana Santos', '1992-02-15', '11765432109', 'Rua dos Cravos, 678, Salvador'),
('45676890124', 'Felipe Oliveira', '1973-10-05', '11754321098', 'Avenida Paulista, 901, São Paulo'),
('56785901235', 'Mariana Ferreira', '1984-07-20', '11743210987', 'Rua das Rosas, 234, Fortaleza');

-- Insert data into QUARTO
INSERT INTO QUARTO (NUMERO, TIPO) VALUES
(101, 'Apartamento'),
(102, 'Apartamento'),
(103, 'Apartamento'),
(104, 'Apartamento'),
(105, 'Apartamento'),
(201, 'Enfermaria'),
(202, 'Enfermaria'),
(203, 'Enfermaria'),
(204, 'Enfermaria'),
(205, 'Enfermaria'),
(301, 'UTI'),
(302, 'UTI'),
(303, 'UTI'),
(304, 'UTI'),
(305, 'UTI'),
(401, 'Sala de Exame'),
(402, 'Sala de Exame'),
(403, 'Sala de Exame'),
(404, 'Sala de Exame'),
(405, 'Sala de Exame'),
(501, 'Outro'),
(502, 'Outro'),
(503, 'Outro'),
(504, 'Outro'),
(505, 'Outro');

-- Insert data into PACIENTE
INSERT INTO PACIENTE ( STATUS, NOME, CPF, DATA_NASCIMENTO, TELEFONE, ENDERECO) VALUES
('Internado', 'Maria Silva', '12345678901', '1980-05-15', '11987654321', 'Rua das Flores, 123, São Paulo'),
('Internado', 'João Santos', '23456789012', '1975-08-22', '11976543210', 'Avenida Brasil, 456, Rio de Janeiro'),
('Alta', 'Ana Oliveira', '34567890123', '1990-03-10', '11965432109', 'Rua dos Pinheiros, 789, Belo Horizonte'),
('Internado', 'Carlos Ferreira', '45678901234', '1982-11-27', '11954321098', 'Avenida Paulista, 1000, São Paulo'),
('Internado', 'Juliana Costa', '56789012345', '1988-04-05', '11943210987', 'Rua das Palmeiras, 234, Salvador'),
('Alta', 'Pedro Almeida', '67890123456', '1979-09-14', '11932109876', 'Avenida Atlântica, 567, Rio de Janeiro'),
('Internado', 'Fernanda Lima', '78901234567', '1995-01-30', '11921098765', 'Rua dos Lírios, 890, Curitiba'),
('Alta', 'Roberto Souza', '89012345678', '1970-07-18', '11910987654', 'Avenida Getúlio Vargas, 123, Belo Horizonte'),
('Internado', 'Luciana Martins', '90123456789', '1985-12-03', '11909876543', 'Rua das Acácias, 456, Fortaleza'),
('Internado', 'Eduardo Pereira', '01234567890', '1992-06-25', '11898765432', 'Avenida Boa Viagem, 789, Recife'),
('Internado', 'Camila Rodrigues', '12340567891', '1978-02-08', '11887654321', 'Rua dos Ipês, 012, Brasília'),
('Alta', 'Marcelo Barbosa', '23451678902', '1983-10-17', '11876543210', 'Avenida Beira Mar, 345, Florianópolis'),
('Internado', 'Patricia Cardoso', '34562789013', '1991-07-22', '11865432109', 'Rua das Margaridas, 678, Porto Alegre'),
('Alta', 'Lucas Ribeiro', '45673890124', '1976-04-09', '11854321098', 'Avenida Faria Lima, 901, São Paulo'),
('Internado', 'Aline Gomes', '56784901235', '1987-11-14', '11843210987', 'Rua dos Girassóis, 234, Manaus'),
('Internado', 'Rafael Torres', '67895012346', '1993-05-28', '11832109876', 'Avenida Copacabana, 567, Rio de Janeiro'),
('Alta', 'Cristina Nunes', '78906123457', '1981-09-03', '11821098765', 'Rua das Violetas, 890, Goiânia'),
('Internado', 'Marcos Mendes', '89017234568', '1974-01-19', '11810987654', 'Avenida Nove de Julho, 123, São Paulo'),
('Alta', 'Vanessa Lopes', '90128345679', '1989-08-07', '11809876543', 'Rua dos Jasmins, 456, Belém'),
('Internado', 'Bruno Dias', '01239456780', '1994-12-12', '11798765432', 'Avenida Afonso Pena, 789, Belo Horizonte');

-- Insert data into PRODUTO
INSERT INTO PRODUTO (NOME, DESCRICAO, PRECO, TEMPO_PREPARO, CATEGORIA, CALORIAS_KCAL, PROTEINAS_G, CARBOIDRATOS_G, GORDURAS_G, SODIO_MG) VALUES
('Café da Manhã Completo', 'Café, leite, pão, manteiga, geleia, frutas', 25.00, 15, 'Café da Manhã', 450, 12, 65, 15, 380),
('Omelete de Queijo', 'Omelete com queijo e tomate', 18.50, 10, 'Café da Manhã', 320, 18, 5, 25, 420),
('Mingau de Aveia', 'Mingau de aveia com canela e maçã', 15.00, 12, 'Café da Manhã', 220, 8, 35, 6, 120),
('Salada de Frutas', 'Mix de frutas da estação', 12.00, 8, 'Café da Manhã', 120, 2, 28, 0, 15),
('Torrada Integral', 'Torrada integral com geleia light', 10.00, 5, 'Café da Manhã', 180, 5, 30, 3, 200),
('Frango Grelhado', 'Peito de frango grelhado com legumes', 35.00, 25, 'Almoço', 320, 38, 12, 10, 280),
('Salmão ao Molho de Ervas', 'Filé de salmão com molho de ervas e batata', 48.00, 30, 'Almoço', 420, 32, 25, 22, 350),
('Risoto de Legumes', 'Risoto cremoso com legumes da estação', 28.00, 22, 'Almoço', 380, 10, 60, 12, 320),
('Sopa de Vegetais', 'Sopa leve de vegetais variados', 18.00, 15, 'Almoço', 180, 6, 25, 5, 310),
('Salada Caesar', 'Salada com alface, croutons e frango', 22.00, 12, 'Almoço', 250, 18, 15, 12, 380),
('Filé Mignon', 'Filé mignon com purê de batatas', 52.00, 30, 'Jantar', 450, 35, 30, 20, 420),
('Peixe ao Forno', 'Peixe assado com ervas e legumes', 42.00, 28, 'Jantar', 380, 30, 18, 18, 350),
('Lasanha de Berinjela', 'Lasanha de berinjela com molho de tomate', 32.00, 25, 'Jantar', 320, 15, 35, 14, 380),
('Sopa de Cebola', 'Sopa de cebola gratinada', 20.00, 20, 'Jantar', 220, 8, 25, 10, 420),
('Wrap Vegetariano', 'Wrap com vegetais grelhados e homus', 25.00, 15, 'Jantar', 280, 12, 35, 10, 350),
('Pudim de Leite', 'Pudim caseiro de leite condensado', 15.00, 10, 'Sobremesa', 280, 6, 45, 8, 120),
('Mousse de Chocolate', 'Mousse leve de chocolate meio amargo', 18.00, 12, 'Sobremesa', 320, 5, 40, 15, 80),
('Salada de Frutas Diet', 'Salada de frutas sem açúcar', 12.00, 8, 'Sobremesa', 100, 1, 24, 0, 10),
('Gelatina Light', 'Gelatina de frutas vermelhas light', 8.00, 5, 'Sobremesa', 60, 2, 12, 0, 15),
('Iogurte com Granola', 'Iogurte natural com granola e mel', 14.00, 5, 'Sobremesa', 180, 8, 25, 5, 60),
('Panqueca Integral', 'Panqueca integral com recheio de frango', 22.00, 15, 'Café da Manhã', 280, 18, 30, 10, 310),
('Canja de Galinha', 'Canja de galinha tradicional', 25.00, 20, 'Jantar', 220, 18, 20, 8, 350),
('Sorvete Diet', 'Sorvete diet de baunilha', 10.00, 5, 'Sobremesa', 120, 3, 15, 5, 40);

-- Insert data into CAMAREIRA
INSERT INTO CAMAREIRA (CRE, NOME, CPF, DATA_NASCIMENTO, TELEFONE, ENDERECO, CARGO, SETOR) VALUES
('CR001', 'Amanda Castro', '12349567891', '1977-03-25', '11787654321', 'Rua das Orquídeas, 012, Curitiba', 'Camareira Sênior', 'Hotelaria'),
('CR002', 'Henrique Cardoso', '23458678902', '1986-06-30', '11776543210', 'Avenida das Américas, 345, Rio de Janeiro', 'Camareiro', 'Hotelaria'),
('CR003', 'Juliana Santos', '34567989013', '1992-02-15', '11765432109', 'Rua dos Cravos, 678, Salvador', 'Camareira', 'Hotelaria'),
('CR004', 'Felipe Oliveira', '45676890124', '1973-10-05', '11754321098', 'Avenida Paulista, 901, São Paulo', 'Camareiro Sênior', 'Hotelaria'),
('CR005', 'Mariana Ferreira', '56785901235', '1984-07-20', '11743210987', 'Rua das Rosas, 234, Fortaleza', 'Camareira', 'Hotelaria'),
('CR007', 'Bianca Lima', '78901234568', '1982-09-05', '11721098765', 'Rua das Acácias, 890, Porto Alegre', 'Camareira', 'Hotelaria'),
('CR010', 'André Pereira', '01234567891', '1979-06-30', '11698765432', 'Avenida Paulista, 789, São Paulo', 'Camareiro', 'Hotelaria'),
('CR011', 'Renata Souza', '12345678902', '1991-03-15', '11687654321', 'Rua das Flores, 012, Belo Horizonte', 'Camareira', 'Hotelaria'),
('CR012', 'Thiago Nunes', '23456789013', '1984-08-22', '11676543210', 'Avenida Atlântica, 345, Rio de Janeiro', 'Camareiro', 'Hotelaria'),
('CR013', 'Fernanda Oliveira', '34567890124', '1976-05-10', '11665432109', 'Rua dos Lírios, 678, Salvador', 'Camareira Sênior', 'Hotelaria'),
('CR014', 'Leonardo Santos', '45678901235', '1989-12-07', '11654321098', 'Avenida Boa Vista, 901, Recife', 'Camareiro', 'Hotelaria'),
('CR015', 'Daniela Lima', '56789012346', '1981-02-18', '11643210987', 'Rua das Margaridas, 234, Curitiba', 'Camareira', 'Hotelaria'),
('CR016', 'Rafael Almeida', '67890123457', '1993-07-25', '11632109876', 'Avenida São João, 567, São Paulo', 'Camareiro', 'Hotelaria'),
('CR018', 'Gustavo Cardoso', '89012345679', '1986-09-17', '11610987654', 'Avenida Rebouças, 123, São Paulo', 'Camareiro Sênior', 'Hotelaria'),
('CR019', 'Natália Torres', '90123456780', '1994-01-30', '11609876543', 'Rua das Violetas, 456, Porto Alegre', 'Camareira', 'Hotelaria');

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
(16, 16, '2023-02-20 13:00:00', NULL),
(17, 17, '2023-02-22 15:45:00', '2023-03-01 11:30:00'),
(18, 18, '2023-02-25 10:20:00', NULL),
(19, 19, '2023-02-28 12:30:00', '2023-03-10 09:15:00'),
(20, 20, '2023-03-01 14:00:00', NULL),
(1, 21, '2023-03-05 09:30:00', '2023-03-15 11:00:00'),
(2, 22, '2023-03-08 11:45:00', '2023-03-18 10:30:00'),
(3, 23, '2023-03-10 13:15:00', '2023-03-20 14:45:00'),
(4, 24, '2023-03-12 16:00:00', '2023-03-22 09:30:00'),
(5, 25, '2023-03-15 08:45:00', '2023-03-25 13:00:00');

-- Insert data into FATURA
INSERT INTO FATURA (STATUS_PAGAMENTO, VALOR_TOTAL, DATA_PAGAMENTO, ID_METODO_PAGAMENTO, DATA_EMISSAO, ID_ESTADIA) VALUES
('Pendente', 1500.00, NULL, 1, '2023-01-15 10:30:00', 1),
('Pendente', 1200.00, NULL, 2, '2023-01-17 12:45:00', 2),
('Pago', 2000.00, '2023-01-26 09:15:00', 3, '2023-01-25 16:30:00', 3),
('Pendente', 1800.00, NULL, 4, '2023-01-23 11:20:00', 4),
('Pendente', 2200.00, NULL, 5, '2023-01-25 13:40:00', 5),
('Pago', 1700.00, '2023-01-31 14:50:00', 6, '2023-01-30 15:25:00', 6),
('Pendente', 2500.00, NULL, 7, '2023-01-30 10:15:00', 7),
('Pago', 1900.00, '2023-02-06 11:30:00', 8, '2023-02-05 14:20:00', 8),
('Pendente', 2300.00, NULL, 9, '2023-02-06 09:45:00', 9),
('Pendente', 2100.00, NULL, 10, '2023-02-08 13:10:00', 10),
('Pendente', 2400.00, NULL, 1, '2023-02-10 15:30:00', 11),
('Pago', 1600.00, '2023-02-19 10:45:00', 2, '2023-02-18 16:20:00', 12),
('Pendente', 2800.00, NULL, 3, '2023-02-15 12:35:00', 13),
('Pago', 2000.00, '2023-02-26 14:15:00', 4, '2023-02-25 15:50:00', 14),
('Pendente', 2600.00, NULL, 5, '2023-02-23 09:40:00', 15),
('Pendente', 1800.00, NULL, 6, '2023-02-25 11:25:00', 16),
('Pago', 2200.00, '2023-03-02 13:30:00', 7, '2023-03-01 16:15:00', 17),
('Pendente', 2400.00, NULL, 8, '2023-03-02 10:10:00', 18),
('Pago', 1900.00, '2023-03-11 11:45:00', 9, '2023-03-10 14:30:00', 19),
('Pendente', 2700.00, NULL, 10, '2023-03-06 15:20:00', 20),
('Pago', 1500.00, '2023-03-16 09:30:00', 1, '2023-03-15 12:40:00', 21),
('Pago', 2100.00, '2023-03-19 13:15:00', 2, '2023-03-18 16:00:00', 22),
('Pago', 1800.00, '2023-03-21 10:45:00', 3, '2023-03-20 15:30:00', 23),
('Pago', 2300.00, '2023-03-23 14:20:00', 4, '2023-03-22 11:15:00', 24),
('Pago', 2500.00, '2023-03-26 16:10:00', 5, '2023-03-25 13:45:00', 25);

-- Insert data into PEDIDO - Fixed to only use existing camareira IDs
INSERT INTO PEDIDO (ID_ESTADIA, ID_CAMAREIRA, STATUS, DATA_PEDIDO) VALUES
(1, 1, 'Pendente', '2023-01-10 12:30:00'),
(2, 2, 'Em Preparação', '2023-01-12 18:45:00'),
(3, 3, 'Entregue', '2023-01-16 08:15:00'),
(4, 4, 'Pendente', '2023-01-18 13:20:00'),
(5, 5, 'Em Preparação', '2023-01-20 19:10:00'),
(6, 1, 'Entregue', '2023-01-23 07:45:00'),  -- Changed from 6 to 1
(7, 2, 'Pendente', '2023-01-25 14:30:00'),  -- Changed from 7 to 2
(8, 3, 'Em Preparação', '2023-01-29 20:15:00'),  -- Changed from 8 to 3
(9, 4, 'Entregue', '2023-02-01 09:40:00'),  -- Changed from 9 to 4
(10, 5, 'Pendente', '2023-02-03 15:25:00'),  -- Changed from 10 to 5
(11, 1, 'Em Preparação', '2023-02-05 21:00:00'),  -- Changed from 11 to 1
(12, 2, 'Entregue', '2023-02-09 10:45:00'),  -- Changed from 12 to 2
(13, 3, 'Pendente', '2023-02-10 16:30:00'),  -- Changed from 13 to 3
(14, 4, 'Em Preparação', '2023-02-16 22:15:00'),  -- Changed from 14 to 4
(15, 5, 'Entregue', '2023-02-18 11:50:00'),  -- Changed from 15 to 5
(16, 1, 'Pendente', '2023-02-20 17:35:00'),  -- Changed from 16 to 1
(17, 2, 'Em Preparação', '2023-02-22 23:20:00'),  -- Changed from 17 to 2
(18, 3, 'Entregue', '2023-02-26 12:05:00'),  -- Changed from 18 to 3
(19, 4, 'Pendente', '2023-02-28 18:50:00'),  -- Changed from 19 to 4
(20, 5, 'Em Preparação', '2023-03-01 00:35:00'),  -- Changed from 20 to 5
(21, 1, 'Entregue', '2023-03-06 13:20:00'),
(22, 2, 'Pendente', '2023-03-08 19:05:00'),
(23, 3, 'Em Preparação', '2023-03-11 00:50:00'),
(24, 4, 'Entregue', '2023-03-12 14:35:00'),
(25, 5, 'Pendente', '2023-03-15 20:20:00');

-- Insert data into PRODUTO_PEDIDO
INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, ID_PEDIDO, QUANTIDADE) VALUES
(1, 1, 1),
(6, 1, 1),
(16, 1, 2),
(2, 2, 2),
(7, 2, 1),
(17, 2, 1),
(3, 3, 1),
(8, 3, 2),
(18, 3, 1),
(4, 4, 2),
(9, 4, 1),
(19, 4, 1),
(5, 5, 1),
(10, 5, 1),
(20, 5, 2),
(1, 6, 2),
(11, 6, 1),
(16, 6, 1),
(2, 7, 1),
(12, 7, 1),
(17, 7, 2),
(3, 8, 2),
(13, 8, 1),
(18, 8, 1),
(4, 9, 1),
(14, 9, 2),
(19, 9, 1),
(5, 10, 1),
(15, 10, 1),
(20, 10, 1),
(1, 11, 1),
(6, 11, 2),
(16, 11, 1),
(2, 12, 2),
(7, 12, 1),
(17, 12, 1),
(3, 13, 1),
(8, 13, 1),
(18, 13, 2),
(4, 14, 1),
(9, 14, 2),
(19, 14, 1),
(5, 15, 2),
(10, 15, 1),
(20, 15, 1),
(1, 16, 1),
(11, 16, 1),
(16, 16, 1),
(2, 17, 1),
(12, 17, 2),
(17, 17, 1),
(3, 18, 2),
(13, 18, 1),
(18, 18, 1),
(4, 19, 1),
(14, 19, 1),
(19, 19, 2),
(5, 20, 1),
(15, 20, 2),
(20, 20, 1),
(21, 21, 2),
(22, 21, 1),
(1, 22, 1),
(6, 22, 1),
(16, 22, 2),
(2, 23, 2),
(7, 23, 1),
(17, 23, 1),
(3, 24, 1),
(8, 24, 2),
(18, 24, 1),
(4, 25, 2),
(9, 25, 1),
(19, 25, 1);

-- Add some views for common queries
CREATE OR REPLACE VIEW vw_pacientes_internados AS
SELECT p.ID_PACIENTE, p.NOME, p.CPF, q.NUMERO AS QUARTO_NUMERO, q.TIPO AS QUARTO_TIPO, e.DATA_ENTRADA
FROM PACIENTE p
JOIN ESTADIA e ON p.ID_PACIENTE = e.ID_PACIENTE
JOIN QUARTO q ON e.ID_QUARTO = q.ID_QUARTO
WHERE p.STATUS = 'Internado' AND e.DATA_SAIDA IS NULL;

CREATE OR REPLACE VIEW vw_faturas_pendentes AS
SELECT f.ID_FATURA, p.NOME AS PACIENTE, f.VALOR_TOTAL, f.DATA_EMISSAO, mp.TIPO AS METODO_PAGAMENTO
FROM FATURA f
JOIN ESTADIA e ON f.ID_ESTADIA = e.ID_ESTADIA
JOIN PACIENTE p ON e.ID_PACIENTE = p.ID_PACIENTE
JOIN METODO_PAGAMENTO mp ON f.ID_METODO_PAGAMENTO = mp.ID_METODO_PAGAMENTO
WHERE f.STATUS_PAGAMENTO = 'Pendente';

CREATE OR REPLACE VIEW vw_pedidos_por_status AS
SELECT pe.ID_PEDIDO, pa.NOME AS PACIENTE, q.NUMERO AS QUARTO, pe.STATUS, pe.DATA_PEDIDO, c.NOME AS CAMAREIRA
FROM PEDIDO pe
JOIN ESTADIA e ON pe.ID_ESTADIA = e.ID_ESTADIA
JOIN PACIENTE pa ON e.ID_PACIENTE = pa.ID_PACIENTE
JOIN QUARTO q ON e.ID_QUARTO = q.ID_QUARTO
JOIN CAMAREIRA c ON pe.ID_CAMAREIRA = c.ID_CAMAREIRA;
