package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.CategoriaProduto;

@Repository
public class CategoriaProdutoRepository extends BaseRepository<CategoriaProduto, Long> {

    @SuppressWarnings("unused")
    public CategoriaProdutoRepository(JdbcTemplate jdbcTemplate) {
        super("CATEGORIA_PRODUTO", "ID_CATEGORIA", jdbcTemplate, (rs, rowNum) -> {
            CategoriaProduto categoriaProduto = new CategoriaProduto(
                rs.getString("NOME"),
                rs.getString("DESCRICAO"),
                rs.getString("ICONE")
            );
            categoriaProduto.setId(rs.getLong("ID_CATEGORIA"));
            return categoriaProduto;
        });
    }

    public CategoriaProduto save(CategoriaProduto categoriaProduto) {
        String insertSql = "INSERT INTO CATEGORIA_PRODUTO (NOME, DESCRICAO) VALUES (?, ?)";
        jdbcTemplate.update(insertSql,
            categoriaProduto.getNome(),
            categoriaProduto.getDescricao()
        );
        var savedCategoriaProduto = findLastInserted();
        return savedCategoriaProduto;
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
