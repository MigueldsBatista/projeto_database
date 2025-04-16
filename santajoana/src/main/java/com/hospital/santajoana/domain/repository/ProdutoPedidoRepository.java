package com.hospital.santajoana.domain.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.ProdutoPedido;

@Repository
public class ProdutoPedidoRepository {
    private final JdbcTemplate jdbcTemplate;

    public ProdutoPedidoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public ProdutoPedido save(ProdutoPedido produtoPedido) {
        String insertSql = "INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, ID_PEDIDO, QUANTIDADE) VALUES (?, ?, ?)";
        jdbcTemplate.update(insertSql,
            produtoPedido.getProdutoId(),
            produtoPedido.getPedidoId(),
            produtoPedido.getQuantidade());
        return produtoPedido;
    }

    public ProdutoPedido update(ProdutoPedido produtoPedido) {
        String updateSql = "UPDATE PRODUTO_PEDIDO SET QUANTIDADE = ? WHERE ID_PRODUTO = ? AND ID_PEDIDO = ?";
        jdbcTemplate.update(updateSql,
            produtoPedido.getQuantidade(),
            produtoPedido.getProdutoId(),
            produtoPedido.getPedidoId()
        );
        return produtoPedido;
    }

    public void deleteById(Long produtoId, Long pedidoId) {
        String sql = "DELETE FROM PRODUTO_PEDIDO WHERE ID_PRODUTO = ? AND ID_PEDIDO = ?";
        jdbcTemplate.update(sql, produtoId, pedidoId);
    }

    public List<ProdutoPedido> findByPedidoId(Long pedidoId) {
        String sql = "SELECT * FROM PRODUTO_PEDIDO WHERE ID_PEDIDO = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new ProdutoPedido(
            rs.getLong("ID_PRODUTO"),
            rs.getLong("ID_PEDIDO"),
            rs.getInt("QUANTIDADE")
        ), pedidoId);
    }

    public ProdutoPedido findById(Long produtoId, Long pedidoId) {
        String sql = "SELECT * FROM PRODUTO_PEDIDO WHERE ID_PRODUTO = ? AND ID_PEDIDO = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> new ProdutoPedido(
            rs.getLong("ID_PRODUTO"),
            rs.getLong("ID_PEDIDO"),
            rs.getInt("QUANTIDADE")
        ), produtoId, pedidoId);
    }
}
