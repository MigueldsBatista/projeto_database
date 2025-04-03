package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.Camareira;

@Repository
public class CamareiraRepository extends BaseRepository<Camareira> {

    public CamareiraRepository(JdbcTemplate jdbcTemplate) {
        super("CAMAREIRA", "ID_CAMAREIRA", jdbcTemplate, (rs, rowNum) -> {
            Camareira camareira = new Camareira(
                rs.getString("CPF"),
                rs.getString("NOME"),
                rs.getDate("DATA_NASCIMENTO").toLocalDate(),
                rs.getString("TELEFONE"),
                rs.getString("ENDERECO"),
                rs.getString("CRE"),
                rs.getString("CARGO"),
                rs.getString("SETOR")
            );
            camareira.setId(rs.getLong("ID_CAMAREIRA"));
            return camareira;
        });
    }

    @Override
    public Camareira save(Camareira camareira) {
        String insertSql = "INSERT INTO CAMAREIRA (CPF, NOME, DATA_NASCIMENTO, TELEFONE, ENDERECO, CRE, CARGO, SETOR) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
            camareira.getCpf(),
            camareira.getNome(),
            camareira.getDataNascimento(),
            camareira.getTelefone(),
            camareira.getEndereco(),
            camareira.getCre(),
            camareira.getCargo(),
            camareira.getSetor()
        );
        return camareira;
    }

    @Override
    public Camareira update(Camareira camareira) {
        // Check if ID exists before attempting update
        if (camareira.getId() == null) {
            throw new IllegalArgumentException("Cannot update a Camareira without an ID");
        }
        
        String updateSql = "UPDATE CAMAREIRA SET CPF = ?, NOME = ?, DATA_NASCIMENTO = ?, TELEFONE = ?, ENDERECO = ?, CRE = ?, CARGO = ?, SETOR = ? WHERE ID_CAMAREIRA = ?";
        int rowsAffected = jdbcTemplate.update(updateSql,
            camareira.getCpf(),
            camareira.getNome(),
            camareira.getDataNascimento(),
            camareira.getTelefone(),
            camareira.getEndereco(),
            camareira.getCre(),
            camareira.getCargo(),
            camareira.getSetor(),
            camareira.getId()
        );
        
        // Check if any rows were affected by the update
        if (rowsAffected == 0) {
            throw new RuntimeException("No camareira found with ID: " + camareira.getId());
        }
        
        return camareira;
    }
}
