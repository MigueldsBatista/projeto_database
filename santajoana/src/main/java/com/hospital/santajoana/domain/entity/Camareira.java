package com.hospital.santajoana.domain.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Camareira {
    
    private Long id; // Primary Key
    private String cre;
    private String nome;
    private String cargo;
    private String setor;

    public Camareira(String cre, String nome, String cargo, String setor) {
        this.cre = cre;
        this.nome = nome;
        this.cargo = cargo;
        this.setor = setor;
    }
}


