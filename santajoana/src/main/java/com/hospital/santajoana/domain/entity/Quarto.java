package com.hospital.santajoana.domain.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Quarto extends Entity {
    private Integer numero;
    private Long categoriaId;
    
    public Quarto(Long id, Integer numero, Long categoriaId) {
        super(id);
        this.numero = numero;
        this.categoriaId = categoriaId;
    }
    
    public Quarto(Integer numero, Long categoriaId) {
        this.numero = numero;
        this.categoriaId = categoriaId;
    }
}
