package com.hospital.santajoana.domain.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Paciente {

    private Long id; // Primary Key
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private StatusPaciente status; // Internado/Alta
    
    public Paciente(String nome, String cpf, LocalDate dataNascimento, StatusPaciente status) {
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.status = status;

    }

    public enum StatusPaciente {
        INTERNADO("Internado"),
        ALTA("Alta");
        
        private final String descricao;
        
        StatusPaciente(String descricao) {
            this.descricao = descricao;
        }
        
        @JsonValue// This annotation is used to serialize the enum value as a string
        public String getDescricao() {
            return descricao;
        }

        @JsonCreator// This annotation is used to deserialize the string value back to the enum
        public static StatusPaciente fromString(String descricao) {
            for (StatusPaciente status : StatusPaciente.values()) {
                if (status.getDescricao().equalsIgnoreCase(descricao)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("StatusPaciente inválido: " + descricao);
        }
    }

}
