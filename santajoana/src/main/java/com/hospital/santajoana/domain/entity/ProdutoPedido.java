package com.hospital.santajoana.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class ProdutoPedido extends Entity {
    private Long produtoId;
    private Long pedidoId;
    private int quantidade;
    
    public ProdutoPedido(Long id, Long produtoId, Long pedidoId, int quantidade) {
        super(id);
        this.produtoId = produtoId;
        this.pedidoId = pedidoId;
        this.quantidade = quantidade;
    }
}
