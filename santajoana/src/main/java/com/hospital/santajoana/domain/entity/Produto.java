package com.hospital.santajoana.domain.entity;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Produto {
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer tempoPreparo;
    private CategoriaProduto categoria;
    private Integer caloriasKcal;
    private Integer ProteinasG;
    private Integer CarboidratosG;
    private Integer GordurasG;
    private Integer sodioMg;

    public enum CategoriaProduto {
        CAFE_DA_MANHA("Café da Manhã"),
        ALMOCO("Almoço"),
        JANTAR("Jantar"),
        SOBREMESA("Sobremesa"),
        BEBIDAS("Bebidas");

        private final String descricao;

        CategoriaProduto(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }
    public Produto(String nome, String descricao, BigDecimal preco) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;

    }
}
