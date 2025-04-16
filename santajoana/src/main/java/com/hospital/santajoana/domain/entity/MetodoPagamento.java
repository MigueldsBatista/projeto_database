package com.hospital.santajoana.domain.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MetodoPagamento extends Entity<Long> {
    private String tipo;

    public MetodoPagamento(Long id, String tipo) {
        super(id);
        this.tipo = tipo;
    }

    public MetodoPagamento(String tipo) {
        this.tipo = tipo;
    }
}
