package com.hospital.santajoana.domain.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Estadia extends Entity{
    private Long pacienteId;
    private Long quartoId;
    private LocalDateTime dataEntrada;
    private LocalDateTime dataSaida;
    
    public Estadia(Long pacienteId, Long quartoId) {
        this.pacienteId = pacienteId;
        this.quartoId = quartoId;
    }

    public Estadia(Long estadiaId, Long pacienteId, Long quartoId, LocalDateTime dataEntrada, LocalDateTime dataSaida) {
        super(estadiaId);
        this.pacienteId = pacienteId;
        this.quartoId = quartoId;
        this.dataEntrada = dataEntrada;
        this.dataSaida = dataSaida;
    }

}