package com.hospital.santajoana.domain.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Quarto {

    private Long id;
    private Integer numero;
    private String tipo;
    
    public Quarto(Integer numero, String tipo) {
        this.numero = numero;
        this.tipo = tipo;
    }
    
}
