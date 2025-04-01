package com.hospital.santajoana.domain.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Estadia {
    private Long id;
    private Long pacienteId;
    private Long quartoId;
    private Long faturaId;
    private LocalDateTime dataEntrada;
    private LocalDateTime dataSaida;
    
    public Estadia(Long pacienteId, Long quartoId, Long faturaId) {
        this.pacienteId = pacienteId;
        this.quartoId = quartoId;
        this.faturaId = faturaId;
    }
    
    public Estadia(Long pacienteId, Long quartoId, Long faturaId, LocalDateTime dataEntrada, LocalDateTime dataSaida) {
        this.pacienteId = pacienteId;
        this.quartoId = quartoId;
        this.faturaId = faturaId;
        this.dataEntrada = dataEntrada;
        this.dataSaida = dataSaida;
    }
    

}