package com.hospital.santajoana.domain.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Estadia extends Entity<LocalDateTime> {
    //OBS A COLUNA ID QUE VEM DA ENTITY É A DATA_ENTRADA
    private LocalDateTime dataEntrada;
    private Long pacienteId;
    private String pacienteNome;
    private Long quartoId;
    private LocalDateTime dataSaida;
    private Integer quartoNumero;
    
    // O id agora é dataEntrada (chave primária)
    public Estadia(LocalDateTime dataEntrada, Long pacienteId, Long quartoId, LocalDateTime dataSaida) {
        super(dataEntrada);
        this.dataEntrada = dataEntrada;
        this.pacienteId = pacienteId;
        this.quartoId = quartoId;
        this.dataSaida = dataSaida;
    }

    public Estadia(LocalDateTime dataEntrada, Long pacienteId, Long quartoId, LocalDateTime dataSaida, String pacienteNome) {
        super(dataEntrada);
        this.dataEntrada = dataEntrada;
        this.pacienteId = pacienteId;
        this.quartoId = quartoId;
        this.dataSaida = dataSaida;
        this.pacienteNome = pacienteNome;
    }

    public Estadia(LocalDateTime dataEntrada, Long pacienteId, Long quartoId, LocalDateTime dataSaida, String pacienteNome, Integer quartoNumero) {
        super(dataEntrada);
        this.dataEntrada = dataEntrada;
        this.pacienteId = pacienteId;
        this.quartoId = quartoId;
        this.dataSaida = dataSaida;
        this.pacienteNome = pacienteNome;
        this.quartoNumero = quartoNumero;
    }
    public Estadia(LocalDateTime dataEntrada, Long pacienteId, Long quartoId, LocalDateTime dataSaida, Integer quartoNumero) {
        super(dataEntrada);
        this.dataEntrada = dataEntrada;
        this.pacienteId = pacienteId;
        this.quartoId = quartoId;
        this.dataSaida = dataSaida;
        this.quartoNumero = quartoNumero;
    }




    public Estadia(Long pacienteId, Long quartoId) {
        this.pacienteId = pacienteId;
        this.quartoId = quartoId;
    }

}