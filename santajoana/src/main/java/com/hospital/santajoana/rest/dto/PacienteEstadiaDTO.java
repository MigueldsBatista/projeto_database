package com.hospital.santajoana.rest.dto;

import java.time.LocalDateTime;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Paciente;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PacienteEstadiaDTO {

    private Long pacienteId;
    private LocalDateTime dataEntradaEstadia;
    private LocalDateTime dataEmissaoFatura;
    private Long quartoId;


    public PacienteEstadiaDTO fromEntitiesToDTO(Paciente paciente, Estadia estadia, Fatura fatura) {
        return new PacienteEstadiaDTO(
            paciente.getId(),
            estadia.getDataEntrada(),
            fatura.getDataEmissao(),
            estadia.getQuartoId()
        );
  
    }
}
