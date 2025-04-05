package com.hospital.santajoana.domain.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.dao.DataIntegrityViolationException;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Quarto;

@Repository
public class EstadiaRepository extends BaseRepository<Estadia> {

    public EstadiaRepository(JdbcTemplate jdbcTemplate, QuartoRepository quartoRepository, PacienteRepository pacienteRepository) {

        super(
            "ESTADIA",
            "ID_ESTADIA",
            jdbcTemplate,

            //RowMapper to map the ResultSet to an Estadia object
            (rs, rowNum) -> { // Map the ResultSet to an Estadia object
                Timestamp dataEntrada = rs.getTimestamp("DATA_ENTRADA");
                Timestamp dataSaida = rs.getTimestamp("DATA_SAIDA");
                Long estadiaId = rs.getLong("ID_ESTADIA");
                Long pacienteId = rs.getLong("ID_PACIENTE");
                Long quartoId = rs.getLong("ID_QUARTO");
                
                // Safer approach with error handling
                Optional<Quarto> quartoOpt = quartoRepository.findById(quartoId);
                Optional<Paciente> pacienteOpt = pacienteRepository.findById(pacienteId);
                
                if (quartoOpt.isEmpty() || pacienteOpt.isEmpty()) {
                    throw new DataIntegrityViolationException(
                        "Foreign key integrity violation: Quarto ID " + quartoId + 
                        " or Paciente ID " + pacienteId + " not found");
                }

                Estadia estadia = new Estadia(
                    estadiaId,
                    pacienteOpt.get(),
                    quartoOpt.get(),
                    dataEntrada != null ? dataEntrada.toLocalDateTime() : null,
                    dataSaida != null ? dataSaida.toLocalDateTime() : null
                );
                
                return estadia;
            });  // Store just the ID in the database
    }     // Store just the ID in the database

    public Estadia save(Estadia estadia) {
        String insertSql = "INSERT INTO ESTADIA (ID_PACIENTE, ID_QUARTO) VALUES (?, ?)";
        return savedEstadia;
        jdbcTemplate.update(insertSql,
            estadia.getPaciente().getId(),
            estadia.getQuarto().getId()    public Estadia update(Estadia estadia) {
            );ET ID_PACIENTE = ?, ID_QUARTO = ?, DATA_ENTRADA = ?, DATA_SAIDA = ? WHERE ID_ESTADIA = ?";

            var savedEstadia = findLastInserted();d(),

        return savedEstadia;null ? Timestamp.valueOf(estadia.getDataEntrada()) : null,
    }

    public Estadia update(Estadia estadia) {
        String updateSql = "UPDATE ESTADIA SET ID_PACIENTE = ?, ID_QUARTO = ?, DATA_ENTRADA = ?, DATA_SAIDA = ? WHERE ID_ESTADIA = ?";
        jdbcTemplate.update(updateSql,return estadia;
            estadia.getPaciente().getId(),
            estadia.getQuarto().getId(),
            estadia.getDataEntrada() != null ? Timestamp.valueOf(estadia.getDataEntrada()) : null,    public Optional<Estadia> findMostRecentEstadiaByPacienteId(Long pacienteId) {
            estadia.getDataSaida() != null ? Timestamp.valueOf(estadia.getDataSaida()) : null,NTRADA DESC";
            estadia.getId()
        );
        t();
        return estadia;
    }

    public Optional<Estadia> findMostRecentEstadiaByPacienteId(Long pacienteId) {}
        String sql = "SELECT * FROM ESTADIA WHERE ID_PACIENTE = ? ORDER BY DATA_ENTRADA DESC";
        return findBySql(sql, pacienteId)
            .stream()            .findFirst();
    }


}


