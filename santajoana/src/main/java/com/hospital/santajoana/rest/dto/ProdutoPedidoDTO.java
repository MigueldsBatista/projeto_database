package com.hospital.santajoana.rest.dto;

import java.math.BigDecimal;

import com.hospital.santajoana.domain.entity.Produto;
import com.hospital.santajoana.domain.entity.ProdutoPedido;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoPedidoDTO {
    private Long pedidoId;
    private Long produtoId;
    private String nome;
    private BigDecimal preco;
    private Integer quantidade;
    
    // Convert entity to DTO using product entity and product-order entity
    public static ProdutoPedidoDTO fromEntities(Produto produto, ProdutoPedido produtoPedido) {
        return new ProdutoPedidoDTO(
            produtoPedido.getPedidoId(),
            produto.getId(),
            produto.getNome(),
            produto.getPreco(),
            produtoPedido.getQuantidade()
        );
    }
}