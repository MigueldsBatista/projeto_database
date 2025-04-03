package com.hospital.santajoana.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ProdutoPedido {
    private Long id;
    private Long produtoId;
    private Long pedidoId;
    private int quantidade;
}
