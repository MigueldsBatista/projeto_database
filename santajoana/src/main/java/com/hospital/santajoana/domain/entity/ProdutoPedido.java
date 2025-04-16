package com.hospital.santajoana.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class ProdutoPedido {
    private Long produtoId;
    private Long pedidoId;
    private int quantidade;
    // Chave composta: produtoId + pedidoId
    public ProdutoPedido(Long produtoId, Long pedidoId, int quantidade) {
        this.produtoId = produtoId;
        this.pedidoId = pedidoId;
        this.quantidade = quantidade;
    }
}
