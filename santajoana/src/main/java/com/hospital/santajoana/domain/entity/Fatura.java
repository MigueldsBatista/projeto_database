package com.hospital.santajoana.domain.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Fatura extends Entity<LocalDateTime> {

    private LocalDateTime dataEntradaEstadia;
    private BigDecimal valorTotal;
    private StatusPagamento statusPagamento;
    private Long metodoPagamentoId;
    private LocalDateTime dataPagamento;
    private LocalDateTime dataEmissao;

    // Enum for status_pagamento
    public enum StatusPagamento {
        PENDENTE("Pendente"), PAGO("Pago");


        private final String descricao;

        StatusPagamento(String descricao) {
            this.descricao = descricao;
        }

        @JsonValue
        public String getDescricao() {
            return descricao;
        }

        @JsonCreator // Deserialize the string value back to the enum
        public static StatusPagamento fromString(String descricao) {
            for (StatusPagamento status : StatusPagamento.values()) {
                String descricaoAtual = status.getDescricao();
                if (descricaoAtual.equalsIgnoreCase(descricao)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("StatusPagamento inválido: " + descricao);
        }
    }

    public Fatura(LocalDateTime dataEmissao, LocalDateTime dataEntradaEstadia, BigDecimal valorTotal, StatusPagamento statusPagamento, 
                 Long metodoPagamentoId, LocalDateTime dataPagamento) {
        super(dataEmissao);
        this.dataEntradaEstadia = dataEntradaEstadia;
        this.valorTotal = valorTotal;
        this.statusPagamento = statusPagamento;
        this.metodoPagamentoId = metodoPagamentoId;
        this.dataPagamento = dataPagamento;
        this.dataEmissao = dataEmissao;
    }
    
    public Fatura(LocalDateTime dataEntradaEstadia, BigDecimal valorTotal, StatusPagamento statusPagamento, Long metodoPagamentoId) {
        this.dataEntradaEstadia = dataEntradaEstadia;
        this.statusPagamento = statusPagamento;
        this.valorTotal = valorTotal;
        this.metodoPagamentoId = metodoPagamentoId;
    }
    
    public Fatura(LocalDateTime dataEntradaEstadia) {
        this.dataEntradaEstadia = dataEntradaEstadia;
    }
    
    
    public Fatura(LocalDateTime dataEntradaEstadia, BigDecimal valorTotal, StatusPagamento statusPagamento, 
                 LocalDateTime dataPagamento, Long metodoPagamentoId) {
        this.dataEntradaEstadia = dataEntradaEstadia;
        this.valorTotal = valorTotal;
        this.statusPagamento = statusPagamento;
        this.dataPagamento = dataPagamento;
        this.metodoPagamentoId = metodoPagamentoId;
    }
}
