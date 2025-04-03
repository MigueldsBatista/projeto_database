package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

import com.hospital.santajoana.domain.entity.Estadia;

@Repository
public class EstadiaRepository extends BaseRepository<Estadia> {

    public EstadiaRepository(JdbcTemplate jdbcTemplate) {
        super("ESTADIA", "ID_ESTADIA", jdbcTemplate, (rs, rowNum) -> {
            Timestamp dataSaida = rs.getTimestamp("DATA_SAIDA");

            return new Estadia(
                    rs.getLong("ID_ESTADIA"),
                    rs.getLong("ID_PACIENTE"),
                    rs.getLong("ID_QUARTO"),
                    rs.getLong("ID_FATURA"),
                    rs.getTimestamp("DATA_ENTRADA").toLocalDateTime(),
                    dataSaida != null ? dataSaida.toLocalDateTime() : null);
        });
    }

    public Estadia save(Estadia estadia) {
        String insertSql = "INSERT INTO ESTADIA (ID_PACIENTE, ID_QUARTO, ID_FATURA, DATA_ENTRADA, DATA_SAIDA) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
                estadia.getPacienteId(),
                estadia.getQuartoId(),
                estadia.getFaturaId(),
                estadia.getDataEntrada() != null ? Timestamp.valueOf(estadia.getDataEntrada()) : null,
                estadia.getDataSaida() != null ? Timestamp.valueOf(estadia.getDataSaida()) : null);
        return estadia;
    }

    public Estadia update(Estadia estadia) {
        String updateSql = "UPDATE ESTADIA SET ID_PACIENTE = ?, ID_QUARTO = ?, ID_FATURA = ?, DATA_ENTRADA = ?, DATA_SAIDA = ? WHERE ID_ESTADIA = ?";
        jdbcTemplate.update(updateSql,
                estadia.getPacienteId(),
                estadia.getQuartoId(),
                estadia.getFaturaId(),
                estadia.getDataEntrada() != null ? Timestamp.valueOf(estadia.getDataEntrada()) : null,
                estadia.getDataSaida() != null ? Timestamp.valueOf(estadia.getDataSaida()) : null,
                estadia.getId());
        return estadia;
    }
}
