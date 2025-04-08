package com.hospital.santajoana.domain.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Fatura extends Entity {
    private Long estadiaId;
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

    public Fatura(Long id, Long estadiaId, BigDecimal valorTotal, StatusPagamento statusPagamento, 
                 Long metodoPagamentoId, LocalDateTime dataPagamento, LocalDateTime dataEmissao) {
        super(id);
        this.estadiaId = estadiaId;
        this.valorTotal = valorTotal;
        this.statusPagamento = statusPagamento;
        this.metodoPagamentoId = metodoPagamentoId;
        this.dataPagamento = dataPagamento;
        this.dataEmissao = dataEmissao;
    }
    
    public Fatura(Long estadiaId, BigDecimal valorTotal, StatusPagamento statusPagamento, Long metodoPagamentoId) {
        this.estadiaId = estadiaId;
        this.statusPagamento = statusPagamento;
        this.valorTotal = valorTotal;
        this.metodoPagamentoId = metodoPagamentoId;
    }
    
    public Fatura(Long estadiaId) {
        this.estadiaId = estadiaId;
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
