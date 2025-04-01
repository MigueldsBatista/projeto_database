package com.hospital.santajoana.domain.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Fatura {
    private Long id;
    private Long estadiaId;
    private BigDecimal valorTotal;
    private StatusPagamento statusPagamento;
    private LocalDateTime dataPagamento;
    private Long idMetodoPagamento;
    private LocalDateTime dataEmissao;

    // Enum for status_pagamento
    public enum StatusPagamento {
        Pendente, Pago
    }

    public Fatura(Long estadiaId, BigDecimal valorTotal, StatusPagamento statusPagamento, Long idMetodoPagamento) {
        this.estadiaId = estadiaId;
        this.valorTotal = valorTotal;
        this.statusPagamento = statusPagamento;
        this.idMetodoPagamento = idMetodoPagamento;
    }
    
    public Fatura(Long estadiaId, BigDecimal valorTotal, StatusPagamento statusPagamento, 
                 LocalDateTime dataPagamento, Long idMetodoPagamento) {
        this.estadiaId = estadiaId;
        this.valorTotal = valorTotal;
        this.statusPagamento = statusPagamento;
        this.dataPagamento = dataPagamento;
        this.idMetodoPagamento = idMetodoPagamento;
    }
}
