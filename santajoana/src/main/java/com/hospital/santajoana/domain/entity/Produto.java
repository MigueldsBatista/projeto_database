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
public class Produto extends Entity<Long> {
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer tempoPreparoMinutos;
    private Long categoriaId;
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

    public Produto(Long produtoId, String nome, String descricao, BigDecimal preco, Integer tempoPreparoMinutos, Long categoriaId,
            Integer caloriasKcal, Integer proteinasG, Integer carboidratosG, Integer gordurasG, Integer sodioMg) {
        super(produtoId);
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.tempoPreparoMinutos = tempoPreparoMinutos;
        this.categoriaId = categoriaId;
        this.caloriasKcal = caloriasKcal;
        this.proteinasG = proteinasG;
        this.carboidratosG = carboidratosG;
        this.gordurasG = gordurasG;
        this.sodioMg = sodioMg;
    }

    
}
