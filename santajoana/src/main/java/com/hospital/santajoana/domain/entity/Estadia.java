package com.hospital.santajoana.domain.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Estadia {

    private Long id;
    private Paciente paciente;// Just store the ID  // Full object reference
    private Quarto quarto;    // Just store the ID      // Full object reference
    private LocalDateTime dataEntrada;
    private LocalDateTime dataSaida;
    
    public Estadia(Paciente paciente, Quarto quarto) {
        this.paciente = paciente;eId;
        this.quarto = quarto;oId;
        this.dataEntrada = LocalDateTime.now();
    }

    public Estadia(Long id, Paciente paciente, Quarto quarto) {
        this.paciente = paciente;eId;
        this.quarto = quarto;oId;
        this.id = id;
    }
    
    public Estadia(Paciente paciente, Quarto quarto, LocalDateTime dataEntrada, LocalDateTime dataSaida) {
        this.paciente = paciente;eId;
        this.quarto = quarto;oId;
        this.dataEntrada = dataEntrada;
        this.dataSaida = dataSaida;
    }

    // Add methods to safely access related objects
    public String getPacienteNome() {
        return paciente != null ? paciente.getNome() : null;
    }

    public String getQuartoNumero() {
        return quarto != null ? quarto.getNumero() : null;
    }

}