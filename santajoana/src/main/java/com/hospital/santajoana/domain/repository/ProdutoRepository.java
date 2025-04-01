package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.Produto;
import com.hospital.santajoana.domain.entity.Produto.CategoriaProduto;

@Repository
public class ProdutoRepository extends BaseRepository<Produto> {

    public ProdutoRepository(JdbcTemplate jdbcTemplate) {
        super("PRODUTO","ID_PRODUTO",jdbcTemplate, (rs, rowNum) -> new Produto(
            rs.getLong("ID_PRODUTO"),
            rs.getString("NOME"),
            rs.getString("DESCRICAO"),
            rs.getBigDecimal("PRECO"),
            rs.getInt("TEMPO_PREPARO"),
            CategoriaProduto.valueOf(rs.getString("CATEGORIA")),
            rs.getObject("CALORIAS_KCAL") != null ? rs.getInt("CALORIAS_KCAL") : null,
            rs.getObject("PROTEINAS_G") != null ? rs.getInt("PROTEINAS_G") : null,
            rs.getObject("CARBOIDRATOS_G") != null ? rs.getInt("CARBOIDRATOS_G") : null,
            rs.getObject("GORDURAS_G") != null ? rs.getInt("GORDURAS_G") : null,
            rs.getObject("SODIO_MG") != null ? rs.getInt("SODIO_MG") : null
        ));
    }

    public Produto save(Produto produto) {
        String insertSql = "INSERT INTO PRODUTO (NOME, DESCRICAO, PRECO, TEMPO_PREPARO, CATEGORIA, CALORIAS_KCAL, PROTEINAS_G, CARBOIDRATOS_G, GORDURAS_G, SODIO_MG) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
            produto.getNome(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getTempoPreparo(),
            produto.getCategoria().name(),
            produto.getCaloriasKcal(),
            produto.getProteinasG(),
            produto.getCarboidratosG(),
            produto.getGordurasG(),
            produto.getSodioMg());
        return produto;
    }

    public Produto update(Produto produto) {
        String updateSql = "UPDATE PRODUTO SET NOME = ?, DESCRICAO = ?, PRECO = ?, TEMPO_PREPARO = ?, CATEGORIA = ?, CALORIAS_KCAL = ?, PROTEINAS_G = ?, CARBOIDRATOS_G = ?, GORDURAS_G = ?, SODIO_MG = ? WHERE ID_PRODUTO = ?";
        jdbcTemplate.update(updateSql,
            produto.getNome(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getTempoPreparo(),
            produto.getCategoria().name(),
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
