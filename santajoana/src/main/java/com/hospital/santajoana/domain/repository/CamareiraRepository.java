package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.Camareira;

@Repository
public class CamareiraRepository extends BaseRepository<Camareira> {

    public CamareiraRepository(JdbcTemplate jdbcTemplate) {
        super("CAMAREIRA","ID_CAMAREIRA",jdbcTemplate, (rs, rowNum) -> new Camareira(
            rs.getLong("CAMAREIRA_ID"),
            rs.getString("CRE"),
            rs.getString("NOME"),
            rs.getString("CARGO"),
            rs.getString("SETOR")
        ));
    }

    public Camareira save(Camareira CAMAREIRA) {
        String insertSql = "INSERT INTO CAMAREIRA (CRE, NOME, CARGO, SETOR) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
            CAMAREIRA.getCre(),
            CAMAREIRA.getNome(),
            CAMAREIRA.getCargo(),
            CAMAREIRA.getSetor()
        );
        return CAMAREIRA;
        
    }

    public Camareira update(Camareira CAMAREIRA) {
        String updateSql = "UPDATE CAMAREIRA SET CRE = ?, NOME = ?, CARGO = ?, SETOR = ? WHERE CAMAREIRA_ID = ?";
        jdbcTemplate.update(updateSql,
            CAMAREIRA.getCre(),
            CAMAREIRA.getNome(),
            CAMAREIRA.getCargo(),
            CAMAREIRA.getSetor(),
            CAMAREIRA.getId()
        );
        return CAMAREIRA;
    }




}
