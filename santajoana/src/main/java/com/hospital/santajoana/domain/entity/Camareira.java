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

    // Fix the constructor to match available constructors in Pessoa
    public Camareira(
        String cpf,/* */
        String nome,/**/
        LocalDate dataNascimento,/**/
        String telefone,/**/
        String endereco,/**/
        String senha,/**/
        String email,/**/
        String fotoPerfilBase64,
        String cre,/**/
        String cargo,/**/
        String setor/**/
        ){
        super(cpf, nome, dataNascimento, telefone, endereco, senha, email, fotoPerfilBase64); 
        this.cre = cre;
        this.cargo = cargo;
        this.setor = setor;
    }
    
    // Alternative constructor using the 3-parameter constructor in Pessoa
    public Camareira(String cpf, String nome, LocalDate dataNascimento, String cre, String cargo, String setor) {
        super(cpf, nome, dataNascimento);
        this.cre = cre;
        this.cargo = cargo;
        this.setor = setor;
    }
}


