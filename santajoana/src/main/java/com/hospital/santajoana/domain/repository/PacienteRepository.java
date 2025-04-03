package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;

import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;

@Repository
public class PacienteRepository extends BaseRepository<Paciente> {

    public PacienteRepository(JdbcTemplate jdbcTemplate) {
        super("PACIENTE", "ID_PACIENTE", jdbcTemplate, (rs, rowNum) -> {
            Paciente paciente = new Paciente(
                    StatusPaciente.fromString(rs.getString("STATUS"))

            );
            paciente.setId(rs.getLong("ID_PACIENTE"));

            // Check if QUARTO_ID column exists and is not null
            try {
                Long quartoId = rs.getLong("QUARTO_ID");
                if (!rs.wasNull()) {
                    paciente.setQuartoId(quartoId);
                }
            } catch (Exception e) {
                // Column might not exist, or other issue. Leave quartoId as null.
            }

            return paciente;
        });
    }

    @Override
    public Paciente save(Paciente paciente) {
        String insertSql = "INSERT INTO PACIENTE (NOME, CPF, DATA_NASCIMENTO, STATUS) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
                paciente.getNome(),
                paciente.getCpf(),
                Date.valueOf(paciente.getDataNascimento()),
                paciente.getStatus().getDescricao());
        return paciente;
    }

    @Override
    public Paciente update(Paciente paciente) {
        // Check if ID exists before attempting update
        if (paciente.getId() == null) {
            throw new IllegalArgumentException("Cannot update a Paciente without an ID");
        }

        String updateSql = "UPDATE PACIENTE SET NOME = ?, CPF = ?, DATA_NASCIMENTO = ?, STATUS = ? WHERE ID_PACIENTE = ?";
        int rowsAffected = jdbcTemplate.update(updateSql,
                paciente.getNome(),
                paciente.getCpf(),
                Date.valueOf(paciente.getDataNascimento()),
                paciente.getStatus().getDescricao(),
                paciente.getId());

        // Check if any rows were affected by the update
        if (rowsAffected == 0) {
            throw new RuntimeException("No paciente found with ID: " + paciente.getId());
        }

        return paciente;
    }
}
