package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

import com.hospital.santajoana.domain.entity.Estadia;

@Repository
public class EstadiaRepository extends BaseRepository<Estadia, LocalDateTime> {


    public EstadiaRepository(JdbcTemplate jdbcTemplate) {
        super(
       "ESTADIA",
        "DATA_ENTRADA",
                jdbcTemplate,
                (rs, rowNum) -> { // Map the ResultSet to an Estadia object
            Timestamp dataEntrada = rs.getTimestamp("DATA_ENTRADA");
            Timestamp dataSaida = rs.getTimestamp("DATA_SAIDA");
            Long idPaciente = rs.getLong("ID_PACIENTE");
            Long idQuarto = rs.getLong("ID_QUARTO");
            
            return new Estadia(
                dataEntrada != null ? dataEntrada.toLocalDateTime() : null,
                idPaciente,
                idQuarto,
                dataSaida != null ? dataSaida.toLocalDateTime() : null
            );
        });
    }

    public Estadia save(Estadia estadia) {
        String insertSql = "INSERT INTO ESTADIA (ID_PACIENTE, ID_QUARTO) VALUES (?, ?)";
        jdbcTemplate.update(insertSql,
            estadia.getPacienteId(),
            estadia.getQuartoId()
            );

        return findMostRecentEstadiaByPacienteId(estadia.getPacienteId()).orElse(null);
    }

    public Estadia update(Estadia estadia) {
        String updateSql = "UPDATE ESTADIA SET ID_PACIENTE = ?, ID_QUARTO = ?, DATA_SAIDA = ? WHERE DATA_ENTRADA = ?";
        jdbcTemplate.update(updateSql,
            estadia.getPacienteId(),
            estadia.getQuartoId(),
            estadia.getDataSaida() != null ? Timestamp.valueOf(estadia.getDataSaida()) : null,
            estadia.getId()
        );
        return findMostRecentEstadiaByPacienteId(estadia.getPacienteId()).orElse(null);
    }

    public Optional<Estadia> findMostRecentEstadiaByPacienteId(Long pacienteId) {
        String sql = "SELECT * FROM ESTADIA WHERE ID_PACIENTE = ? ORDER BY DATA_ENTRADA DESC";
        return findBySql(sql, pacienteId)
            .stream()
            .findFirst();
    }


}