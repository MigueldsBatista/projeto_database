-- Active: 1743591236116@@127.0.0.1@3307@hospital_db
USE hospital_db;

-- 1. Listar todos os pedidos realizados por um paciente específico
SELECT p.ID_PEDIDO, p.ID_CAMAREIRA, p.DATA_PEDIDO, p.STATUS FROM PEDIDO p JOIN ESTADIA e ON p.ID_ESTADIA = e.ID_ESTADIA WHERE e.ID_ESTADIA = 1

delete from FATURA where `ID_FATURA` = 1;

delete from `ESTADIA` where `ID_ESTADIA` = 4