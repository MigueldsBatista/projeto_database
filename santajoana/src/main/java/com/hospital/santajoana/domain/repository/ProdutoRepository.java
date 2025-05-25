package com.hospital.santajoana.domain.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.Produto;
import com.hospital.santajoana.domain.entity.auxiliar.ProdutoQuantidade;

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
            rs.getObject("SODIO_MG") != null ? rs.getInt("SODIO_MG") : null,
            rs.getBoolean("ATIVO")
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

    //SHOWABLE FUNCTION
    public List<ProdutoQuantidade> findMaisPedidosByCategoria(){

        String sql = """
        SELECT
                cp.NOME AS categoria,
                p.NOME AS produto,
                COUNT(pp.ID_PRODUTO) AS total_pedidos
            FROM PRODUTO_PEDIDO pp
            JOIN PRODUTO p ON pp.ID_PRODUTO = p.ID_PRODUTO
            JOIN CATEGORIA_PRODUTO cp ON p.ID_CATEGORIA_PRODUTO = cp.ID_CATEGORIA
            GROUP BY cp.ID_CATEGORIA, cp.NOME, p.ID_PRODUTO, p.NOME
            HAVING COUNT(pp.ID_PRODUTO) = (
                SELECT MAX(sub.cnt)
                FROM (
                    SELECT COUNT(*) AS cnt
                    FROM PRODUTO_PEDIDO pp2
                    JOIN PRODUTO p2 ON pp2.ID_PRODUTO = p2.ID_PRODUTO
                    WHERE p2.ID_CATEGORIA_PRODUTO = p.ID_CATEGORIA_PRODUTO
                    GROUP BY pp2.ID_PRODUTO
                ) AS sub
            );
            """;

        RowMapper<ProdutoQuantidade> rowMapper = (rs, rowNum) -> {
            String categoria = rs.getString("categoria");
            String produto = rs.getString("produto");
            int totalPedidos = rs.getInt("total_pedidos");
            return new ProdutoQuantidade(categoria, produto, totalPedidos);
        };
        
        return jdbcTemplate.query(sql, rowMapper);

    }
}
