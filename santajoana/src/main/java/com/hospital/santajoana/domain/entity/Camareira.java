package com.hospital.santajoana.domain.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true) // Include superclass fields in equals and hashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Camareira extends Pessoa {
    
    private String cre;
    private String cargo;
    private String setor;

    // Fix the constructor by using a constructor that exists in Pessoa
    public Camareira(String cpf, String nome, LocalDate dataNascimento, String telefone, String endereco, String cre, String cargo, String setor) {
        super(cpf, nome, dataNascimento, telefone, endereco); 
        this.cre = cre;
        this.cargo = cargo;
        this.setor = setor;
    }
}


