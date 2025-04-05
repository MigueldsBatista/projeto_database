package com.hospital.santajoana.domain.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Produto {
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer tempoPreparoMinutos;
    private CategoriaProduto categoria;
    private Integer caloriasKcal;
    private Integer proteinasG;
    private Integer carboidratosG;
    private Integer gordurasG;
    private Integer sodioMg;

    public enum CategoriaProduto {
        CAFE_DA_MANHA("Café da Manhã"),
        ALMOCO("Almoço"),
        JANTAR("Jantar"),
        LANCHE("Lanche");

        private final String descricao;

        CategoriaProduto(String descricao) {
            this.descricao = descricao;
        }

        @JsonValue // This annotation is crucial for proper serialization
        public String getDescricao() {
            return descricao;
        }

        @JsonCreator // This is needed for proper deserialization
        public static CategoriaProduto fromString(String descricao) {
            for (CategoriaProduto categoria : CategoriaProduto.values()) {
                if (categoria.getDescricao().equalsIgnoreCase(descricao)) {
                    return categoria;
                }
            }
            throw new IllegalArgumentException("CategoriaProduto inválida: " + descricao);
        }
    }
    public Produto(String nome, String descricao, BigDecimal preco) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;

    }

    
}
