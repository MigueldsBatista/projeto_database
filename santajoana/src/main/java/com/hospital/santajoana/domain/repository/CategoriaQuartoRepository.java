package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.CategoriaQuarto;

@Repository
public class CategoriaQuartoRepository extends BaseRepository<CategoriaQuarto, Long> {

    @SuppressWarnings("unused")
    public CategoriaQuartoRepository(JdbcTemplate jdbcTemplate) {
        super("CATEGORIA_QUARTO", "ID_CATEGORIA", jdbcTemplate, (rs, rowNum) -> {
            CategoriaQuarto categoriaQuarto = new CategoriaQuarto(
                rs.getString("NOME"),
                rs.getString("DESCRICAO")
            );
            categoriaQuarto.setId(rs.getLong("ID_CATEGORIA"));
            return categoriaQuarto;
        });
    }

    public CategoriaQuarto save(CategoriaQuarto categoriaQuarto) {
        String insertSql = "INSERT INTO CATEGORIA_QUARTO (NOME, DESCRICAO) VALUES (?, ?)";
        jdbcTemplate.update(insertSql,
            categoriaQuarto.getNome(),
            categoriaQuarto.getDescricao()
        );
        var savedCategoriaQuarto = findLastInserted();
        
        return savedCategoriaQuarto;
    }

    public CategoriaQuarto update(CategoriaQuarto categoriaQuarto) {
        String updateSql = "UPDATE CATEGORIA_QUARTO SET NOME = ?, DESCRICAO = ? WHERE ID_CATEGORIA = ?";
        jdbcTemplate.update(updateSql,
            categoriaQuarto.getNome(),
            categoriaQuarto.getDescricao(),
            categoriaQuarto.getId()
        );
        return categoriaQuarto;
    }
}


