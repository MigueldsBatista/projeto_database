package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;

import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;

@Repository
public class PacienteRepository extends BaseRepository<Paciente>{

    public PacienteRepository(JdbcTemplate jdbcTemplate) {
        super("PACIENTE", "ID_PACIENTE", jdbcTemplate, (rs, rowNum) -> {
            Paciente paciente = new Paciente(
                rs.getString("NOME"),
                rs.getString("CPF"),
                rs.getDate("DATA_NASCIMENTO").toLocalDate(),
                StatusPaciente.fromString(rs.getString("STATUS"))
            );
            paciente.setId(rs.getLong("ID_PACIENTE"));
            
            return paciente;
        });
    }

    @Override
    public Paciente save(Paciente paciente) {
        String insertSql =
        "INSERT INTO PACIENTE (NOME, CPF, DATA_NASCIMENTO, STATUS) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
            paciente.getNome(),
            paciente.getCpf(),
            Date.valueOf(paciente.getDataNascimento()),
            paciente.getStatus().getDescricao()
            );
        return paciente;
    }

    @Override
    public Paciente update(Paciente paciente) {
        // Check if ID exists before attempting update
        if (paciente.getId() == null) {
            throw new IllegalArgumentException("Cannot update a Paciente without an ID");
        }
        
        String updateSql = "UPDATE PACIENTE SET NOME = ?, CPF = ?, DATA_NASCIMENTO = ?, STATUS = ? WHERE ID_PACIENTE = ?";
        jdbcTemplate.update(updateSql,
            paciente.getNome(),
            paciente.getCpf(),
            Date.valueOf(paciente.getDataNascimento()),
            paciente.getStatus().getDescricao(),
            paciente.getId()
        );
        

        return paciente;
    }

    public Paciente updateStatus(Paciente paciente) {
        // Check if ID exists before attempting update
        if (paciente.getId() == null) {
            throw new IllegalArgumentException("Cannot update a Paciente without an ID");
        }
        
        String updateSql = "UPDATE PACIENTE SET STATUS = ? WHERE ID_PACIENTE = ?";
        jdbcTemplate.update(updateSql,
            paciente.getStatus().getDescricao(),
            paciente.getId()
        );
        
        return paciente;
    }
}
