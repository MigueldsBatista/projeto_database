package com.hospital.santajoana.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class CategoriaQuarto extends Entity <Long> {
    private String nome;
    private String descricao;

    public CategoriaQuarto(Long id, String nome, String descricao) {
        super(id);
        this.nome = nome;
        this.descricao = descricao;
    }

    public CategoriaQuarto(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
}

