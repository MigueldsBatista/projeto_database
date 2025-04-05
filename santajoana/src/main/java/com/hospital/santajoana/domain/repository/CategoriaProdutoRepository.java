package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.CategoriaProduto;

@Repository
public class CategoriaProdutoRepository extends BaseRepository<CategoriaProduto> {

    public CategoriaProdutoRepository(JdbcTemplate jdbcTemplate) {
        super("CATEGORIA_PRODUTO", "ID_CATEGORIA", jdbcTemplate, (rs, rowNum) -> new CategoriaProduto(
            rs.getLong("ID_CATEGORIA"),
            rs.getString("NOME"),
            rs.getString("DESCRICAO")
        ));
    }

    public CategoriaProduto save(CategoriaProduto categoriaProduto) {
        String insertSql = "INSERT INTO CATEGORIA_PRODUTO (NOME, DESCRICAO) VALUES (?, ?)";
        jdbcTemplate.update(insertSql,
            categoriaProduto.getNome(),
            categoriaProduto.getDescricao());
        var savedCategoria = findLastInserted();
        return savedCategoria;
    }

    public CategoriaProduto update(CategoriaProduto categoriaProduto) {
        String updateSql = "UPDATE CATEGORIA_PRODUTO SET NOME = ?, DESCRICAO = ? WHERE ID_CATEGORIA = ?";
        jdbcTemplate.update(updateSql,
            categoriaProduto.getNome(),
            categoriaProduto.getDescricao(),
            categoriaProduto.getId()
        );
        return categoriaProduto;
    }
}
