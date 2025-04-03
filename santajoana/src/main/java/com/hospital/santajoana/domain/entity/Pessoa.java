package com.hospital.santajoana.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pessoa {
    private Long id;
    private String cpf;
    private String nome;
    private LocalDate dataNascimento;
    private String telefone;
    private String endereco;
    
    // Constructor without id for new instances
    public Pessoa(String cpf, String nome, LocalDate dataNascimento, String telefone, String endereco) {
        this.cpf = cpf;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.telefone = telefone;
        this.endereco = endereco;
    }
    public Pessoa(String cpf, String nome, LocalDate dataNascimento) {
        this.cpf = cpf;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
    }
}