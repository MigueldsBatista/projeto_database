package com.hospital.santajoana.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pessoa {
    private Long id; // Primary Key
    private String cpf;
    private String nome;
    private String dataNascimento; // Pode ser String ou LocalDate, dependendo do uso
    private String telefone;
}