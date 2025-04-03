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
public class Paciente extends Pessoa {

    private Long quartoId; // Foreign Key to Quarto
    private StatusPaciente status; // Internado/Alta

    // Construtor que aceita todos os atributos
    public Paciente(String cpf, String nome, String dataNascimento, String telefone,String endereco, Long quartoId, StatusPaciente status) {
        super(null, cpf, nome, dataNascimento, telefone,endereco); 
        this.quartoId = quartoId;
        this.status = status;
    }

    // Construtor que aceita apenas o status
    public Paciente(StatusPaciente status) {
        super(); // Chama o construtor padrão da classe Pessoa
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
        
        @JsonValue // Serialize the enum value as a string
        public String getDescricao() {
            return descricao;
        }

        @JsonCreator // Deserialize the string value back to the enum
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