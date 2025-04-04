package com.hospital.santajoana.domain.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true) // Include superclass fields in equals and hashCode
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Paciente extends Pessoa {

    private StatusPaciente status; // Internado/Alta
    

    /**
     * Constructor for creating a new patient with basic information.
     * @param nome Patient name
     * @param cpf Patient CPF (ID number)
     * @param dataNascimento Patient birth date
     * @param status Patient status (INTERNADO/ALTA)
     */
    public Paciente(String nome, String cpf, LocalDate dataNascimento, StatusPaciente status) {
        super(cpf, nome, dataNascimento); // Set basic info from Pessoa
        this.status = status;
    }

    /**
     * Comprehensive constructor with all patient details.
     * @param cpf Patient CPF (ID number)
     * @param nome Patient name
     * @param dataNascimento Patient birth date
     * @param telefone Patient phone number
     * @param endereco Patient address
     * @param status Patient status (INTERNADO/ALTA)
     */
    public Paciente(String cpf, String nome, LocalDate dataNascimento, String telefone, String endereco, StatusPaciente status) {
        super(cpf, nome, dataNascimento, telefone, endereco);
        this.status = status;
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