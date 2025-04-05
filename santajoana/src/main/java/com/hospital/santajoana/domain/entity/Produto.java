package com.hospital.santajoana.domain.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonInclude;

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
    private CategoriaProduto categoria; // Add this field
    private Integer caloriasKcal;
    private Integer proteinasG;
    private Integer carboidratosG;
    private Integer gordurasG;
    private Integer sodioMg;

    public Produto(String nome, String descricao, BigDecimal preco) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
    }
    
    // Helper method to set categoriaId from categoria object
    public void setCategoriaId() {
        if (this.categoria != null) {
            this.categoriaId = this.categoria.getId();
        }
    }
    
    // Helper method to set categoria from categoriaId
    public void setCategoriaFromId(CategoriaProduto categoria) {
        this.categoria = categoria;
        if (categoria != null) {
            this.categoriaId = categoria.getId();
        }
    }
}
