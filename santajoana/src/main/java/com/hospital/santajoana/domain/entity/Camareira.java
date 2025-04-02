package com.hospital.santajoana.domain.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Camareira extends Pessoa {
    
    
private String cre;
    private String cargo;
    private String setor;

    public Camareira(String cpf, String nome, String dataNascimento, String telefone, String cre, String cargo, String setor) {
        super(null, cpf, nome, dataNascimento, telefone); 
        this.cre = cre;
        this.cargo = cargo;
        this.setor = setor;
    }
}


