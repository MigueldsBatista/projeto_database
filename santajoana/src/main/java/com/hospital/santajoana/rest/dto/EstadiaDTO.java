package com.hospital.santajoana.rest.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Quarto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstadiaDTO implements DTO<Estadia> {

    Long id;
    Long pacienteId;
    Long quartoId;
    String dataEntrada;
    String dataSaida;

    @Override
    public List<EstadiaDTO> fromEntitiesToDtos(List<Estadia> estadias) {
        List<EstadiaDTO> estadiasDtos = new ArrayList<>();

        for (Estadia estadia : estadias) {
            var estadiaDto = fromEntityToDTO(estadia);
            estadiasDtos.add(estadiaDto);
        }
        
        return estadiasDtos;
    }

    @Override
    public EstadiaDTO fromEntityToDTO(Estadia entity) {
        EstadiaDTO estadiaDTO = new EstadiaDTO();
        estadiaDTO.setId(entity.getId());
        
        // Null-safe ID extraction
        if (entity.getPaciente() != null) {
            estadiaDTO.setPacienteId(entity.getPaciente().getId());
        }
        
        if (entity.getQuarto() != null) {
            estadiaDTO.setQuartoId(entity.getQuarto().getId());
        }
        
        if (entity.getDataEntrada() != null) {
            estadiaDTO.setDataEntrada(entity.getDataEntrada().toString());
        }
        
        if (entity.getDataSaida() != null) {
            estadiaDTO.setDataSaida(entity.getDataSaida().toString());
        }

        return estadiaDTO;
    }
    
    // Add method to convert DTO to Entity
    public Estadia toEntity(Paciente paciente, Quarto quarto) {
        LocalDateTime entrada = dataEntrada != null ? LocalDateTime.parse(dataEntrada) : null;
        LocalDateTime saida = dataSaida != null ? LocalDateTime.parse(dataSaida) : null;
        
        Estadia estadia = new Estadia(id, paciente, quarto, entrada, saida);
        return estadia;
    }
}
