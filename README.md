MINIMUNDO: O Checkout de Consumo Hospitalar é uma plataforma desenvolvida para o Hospital Santa Joana de Recife, com o objetivo de otimizar o registro e o pagamento dos consumos realizados pelos pacientes durante sua estadia. A cada pedido de produtos e serviços, como alimentação e medicamentos, o sistema registra automaticamente as informações, associando-as ao quarto onde o paciente está alocado.

Ao receber alta, o paciente pode acessar sua fatura detalhada, visualizar todos os consumos realizados e efetuar o pagamento diretamente pelo aplicativo, tornando o processo mais ágil e livre de burocracias. O sistema também permite que o hospital acompanhe facilmente os consumos, reduzindo a carga administrativa e facilitando a gestão de recursos. A plataforma proporciona uma experiência mais eficiente e transparente para os pacientes e para o hospital.


ENTIDADES: 

PACIENTE
id_paciente (PK)
nome
cpf
data_nascimento
quartoId (FK para Quarto)
status (Internado/Alta)

QUARTO
id_quarto (PK)
numero
tipo (Enfermaria, Apartamento, etc.)

PEDIDO
id_pedido (PK)
data_hora
paciente_id (FK para Paciente)
quartoId (FK para Quarto)
status (Em andamento, Entregue, Pago)

PEDIDO_REALIZADO
id_item_pedido (PK)
pedido_id (FK para Pedido)
produto_id (FK para Produto)
quantidade
valor_unitario

PRODUTO
id_produto (PK)
nome
descricao
preco
<!-- categoria (Alimentação, Higiene, Serviço, etc.) -->

FATURA
id_fatura (PK)
paciente_id (FK para Paciente)
valor_total
status_pagamento (Pendente, Pago)
data_pagamento (opcional)
id_metodo_pagamento (FK para Metodo_Pagamento) (opcional)

Regras: Uma fatura por paciente, uma nova fatura
só pode ser gerada após o pagamento da anterior.


CAMAREIRA
CRE (PK)
nome
cargo
setor

METODO_PAGAMENTO
id_metodo_pagamento (PK)
tipo (Cartão de Crédito, Cartão de Débito, Pix, Convênio);
data_Hora



Regras: Um paciente escolhe um método de pagamento ao quitar sua fatura

CAMAREIRA_QUARTO_PACIENTE
ID_CAMAREIRA_QUARTO_PACIENTE (PK)
ID_PACIENTE (FK)
ID_QUARTO (FK)
ID_CAMAREIRA (FK)
DATA_ENTRADA
DATA_SAIDA