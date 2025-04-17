package com.hospital.santajoana.domain.entity;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class ProdutoPedido extends Entity<LocalDateTime>{

    private LocalDateTime criadoEm;
    private Long produtoId;
    private LocalDateTime dataPedido;
    private Integer quantidade;

    // Chave composta: produtoId + pedidoId
    public ProdutoPedido(Long produtoId, LocalDateTime dataPedido, Integer quantidade) {
        this.produtoId = produtoId;
        this.dataPedido = dataPedido;
        this.quantidade = quantidade;
    }

    public ProdutoPedido(LocalDateTime criadoEm, Long produtoId, LocalDateTime dataPedido, Integer quantidade) {
        super(criadoEm);
        this.criadoEm = criadoEm;
        this.produtoId = produtoId;
        this.dataPedido = dataPedido;
        this.quantidade = quantidade;
    }
}
