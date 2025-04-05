USE hospital_db;


-- Add some common queries

-- 1. Listar todos os pedidos realizados por um paciente específico
SELECT p.ID_PEDIDO, p.ID_CAMAREIRA, p.DATA_PEDIDO, p.STATUS FROM PEDIDO p JOIN ESTADIA e ON p.ID_ESTADIA = e.ID_ESTADIA WHERE e.ID_ESTADIA = 1