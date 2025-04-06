package com.hospital.santajoana.domain.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.ProdutoPedido;

@Repository
public class ProdutoPedidoRepository extends BaseRepository<ProdutoPedido> {


    public ProdutoPedidoRepository(JdbcTemplate jdbcTemplate) {
        super("PRODUTO_PEDIDO","ID_PRODUTO_PEDIDO", jdbcTemplate, (rs, rowNum) -> 
        new ProdutoPedido(
            rs.getLong("ID_PRODUTO_PEDIDO"),
            rs.getLong("ID_PRODUTO"),
            rs.getLong("ID_PEDIDO"),
            rs.getInt("QUANTIDADE")
        ));
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
        String updateSql = "UPDATE PRODUTO_PEDIDO SET ID_PRODUTO = ?, ID_PEDIDO = ?, QUANTIDADE = ? WHERE ID_PRODUTO_PEDIDO = ?";
        jdbcTemplate.update(updateSql,
            produtoPedido.getProdutoId(),
            produtoPedido.getPedidoId(),
            produtoPedido.getQuantidade()
        );
        return produtoPedido;
    }

    public List<ProdutoPedido> findByPedidoId(Long pedidoId) {
        String sql = "SELECT * FROM PRODUTO_PEDIDO WHERE ID_PEDIDO = ?";
        return findBySql(sql, pedidoId);
    }}
