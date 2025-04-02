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
    private Long metodoPagamentoId;
    private LocalDateTime dataPagamento;
    private LocalDateTime dataEmissao;

    // Enum for status_pagamento
    public enum StatusPagamento {
        Pendente, Pago
    }

    public Fatura(Long estadiaId, BigDecimal valorTotal, StatusPagamento statusPagamento, Long metodoPagamentoId) {
        this.estadiaId = estadiaId;
        this.valorTotal = valorTotal;
        this.statusPagamento = statusPagamento;
        this.metodoPagamentoId = metodoPagamentoId;
    }
    
    public Fatura(Long estadiaId, BigDecimal valorTotal, StatusPagamento statusPagamento, 
                 LocalDateTime dataPagamento, Long metodoPagamentoId) {
        this.estadiaId = estadiaId;
        this.valorTotal = valorTotal;
        this.statusPagamento = statusPagamento;
        this.dataPagamento = dataPagamento;
        this.metodoPagamentoId = metodoPagamentoId;
    }
}
