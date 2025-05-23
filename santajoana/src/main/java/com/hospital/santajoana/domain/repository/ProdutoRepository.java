package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.Produto;

@Repository
public class ProdutoRepository extends BaseRepository<Produto, Long> {

    public ProdutoRepository(JdbcTemplate jdbcTemplate) {
        super("PRODUTO","ID_PRODUTO",jdbcTemplate, (rs, rowNum) -> {
            Produto produto = new Produto(
            rs.getLong("ID_PRODUTO"),
            rs.getString("NOME"),
            rs.getString("DESCRICAO"),
            rs.getBigDecimal("PRECO"),
            rs.getInt("TEMPO_PREPARO"),
            rs.getLong("ID_CATEGORIA_PRODUTO"),
            rs.getObject("CALORIAS_KCAL") != null ? rs.getInt("CALORIAS_KCAL") : null,
            rs.getObject("PROTEINAS_G") != null ? rs.getInt("PROTEINAS_G") : null,
            rs.getObject("CARBOIDRATOS_G") != null ? rs.getInt("CARBOIDRATOS_G") : null,
            rs.getObject("GORDURAS_G") != null ? rs.getInt("GORDURAS_G") : null,
            rs.getObject("SODIO_MG") != null ? rs.getInt("SODIO_MG") : null
        );
        produto.setId(rs.getLong("ID_PRODUTO"));
        return produto;
        }
        );
    }

    public Produto save(Produto produto) {
        String insertSql = "INSERT INTO PRODUTO (NOME, DESCRICAO, PRECO, TEMPO_PREPARO, ID_CATEGORIA_PRODUTO, CALORIAS_KCAL, PROTEINAS_G, CARBOIDRATOS_G, GORDURAS_G, SODIO_MG) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
            produto.getNome(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getTempoPreparoMinutos(),
            produto.getCategoriaId(),
            produto.getCaloriasKcal(),
            produto.getProteinasG(),
            produto.getCarboidratosG(),
            produto.getGordurasG(),
            produto.getSodioMg());
            var produtoSaved = findLastInserted();
        return produtoSaved;
    }

    public Produto update(Produto produto) {
        String updateSql = "UPDATE PRODUTO SET NOME = ?, DESCRICAO = ?, PRECO = ?, TEMPO_PREPARO = ?, ID_CATEGORIA_PRODUTO = ?, CALORIAS_KCAL = ?, PROTEINAS_G = ?, CARBOIDRATOS_G = ?, GORDURAS_G = ?, SODIO_MG = ? WHERE ID_PRODUTO = ?";
        jdbcTemplate.update(updateSql,
            produto.getNome(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getTempoPreparoMinutos(),
            produto.getCategoriaId(),
            produto.getCaloriasKcal(),
            produto.getProteinasG(),
            produto.getCarboidratosG(),
            produto.getGordurasG(),
            produto.getSodioMg(),
            produto.getId()
        );
        return produto;
    }
}
