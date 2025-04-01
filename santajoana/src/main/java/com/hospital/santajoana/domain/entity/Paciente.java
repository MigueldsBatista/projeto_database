package com.hospital.santajoana.domain.entity;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Paciente {

    private Long id; // Primary Key
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private Long quartoId; // Foreign Key to Quarto
    private StatusPaciente status; // Internado/Alta
    
    public Paciente(String nome, String cpf, LocalDate dataNascimento, StatusPaciente status) {
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.status = status;
        this.quartoId = null; // Default value

    }

    public enum StatusPaciente {
        INTERNADO("Internado"),
        ALTA("Alta");
        
        private final String descricao;
        
        StatusPaciente(String descricao) {
            this.descricao = descricao;
        }
        
        public String getDescricao() {
            return descricao;
        }
    }

}
