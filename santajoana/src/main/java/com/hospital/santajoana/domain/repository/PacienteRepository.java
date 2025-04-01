package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;

import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;

@Repository
public class PacienteRepository extends BaseRepository<Paciente>{

    public PacienteRepository(JdbcTemplate jdbcTemplate) {
        super("PACIENTE", "ID_PACIENTE", jdbcTemplate, (rs, rowNum) -> new Paciente(
            rs.getString("NOME"),
            rs.getString("CPF"),
            rs.getDate("DATA_NASCIMENTO").toLocalDate(),
            StatusPaciente.valueOf(rs.getString("STATUS"))
        ));
    }

    @Override
    public Paciente save(Paciente paciente) {
        String insertSql =
        "INSERT INTO PACIENTE (NOME, CPF, DATA_NASCIMENTO, STATUS) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
            paciente.getNome(),
            paciente.getCpf(),
            Date.valueOf(paciente.getDataNascimento()),
            paciente.getStatus().name());
        return paciente;
    }

    public Paciente update(Paciente paciente) {
        String updateSql = "UPDATE PACIENTE SET NOME = ?, CPF = ?, DATA_NASCIMENTO = ?, STATUS = ? WHERE ID_PACIENTE = ?";
        jdbcTemplate.update(updateSql,
            paciente.getNome(),
            paciente.getCpf(),
            Date.valueOf(paciente.getDataNascimento()),
            paciente.getStatus().name(),
            paciente.getId()
        );
        return paciente;
    }
}
