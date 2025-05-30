package com.hospital.santajoana.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = false)//this will
@NoArgsConstructor
@AllArgsConstructor
public class Pessoa extends Entity<Long> {
    private String cpf;
    private String nome;
    private LocalDate dataNascimento;
    private String telefone;
    private String endereco;
    private String senha;
    private String email;
    private String fotoPerfilBase64;
    
    public Pessoa(String cpf, String nome, LocalDate dataNascimento) {
        this.cpf = cpf;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
    }
}