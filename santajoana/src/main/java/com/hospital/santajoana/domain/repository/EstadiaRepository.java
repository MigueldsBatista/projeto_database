package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Optional;

import com.hospital.santajoana.domain.entity.Estadia;

@Repository
public class EstadiaRepository extends BaseRepository<Estadia> {

    public EstadiaRepository(JdbcTemplate jdbcTemplate) {
        super(
       "ESTADIA",
        "ID_ESTADIA",
                jdbcTemplate, 
                (rs, rowNum) -> { // Map the ResultSet to an Estadia object
            Timestamp dataEntrada = rs.getTimestamp("DATA_ENTRADA");
            Timestamp dataSaida = rs.getTimestamp("DATA_SAIDA");
            Long idEstadia = rs.getLong("ID_ESTADIA");
            Long idPaciente = rs.getLong("ID_PACIENTE");
            Long idQuarto = rs.getLong("ID_QUARTO");
            
            
            return new Estadia(
                idEstadia,
                idPaciente,
                idQuarto,
                dataEntrada != null ? dataEntrada.toLocalDateTime() : null,
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
            var savedEstadia = findLastInserted();
        return savedEstadia;
    }

    public Estadia update(Estadia estadia) {
        String updateSql = "UPDATE ESTADIA SET ID_PACIENTE = ?, ID_QUARTO = ?, DATA_ENTRADA = ?, DATA_SAIDA = ? WHERE ID_ESTADIA = ?";
        jdbcTemplate.update(updateSql,
            estadia.getPacienteId(),
            estadia.getQuartoId(),
            estadia.getDataEntrada() != null ? Timestamp.valueOf(estadia.getDataEntrada()) : null,
            estadia.getDataSaida() != null ? Timestamp.valueOf(estadia.getDataSaida()) : null,
            estadia.getId()
        );
        return estadia;
    }

    public Optional<Estadia> getMostRecentEstadiaByPacienteId(Long pacienteId) {
        String sql = "SELECT * FROM ESTADIA WHERE ID_PACIENTE = ? ORDER BY DATA_ENTRADA DESC";
        return findBySql(sql, pacienteId)
            .stream()
            .findFirst();
    }
}
