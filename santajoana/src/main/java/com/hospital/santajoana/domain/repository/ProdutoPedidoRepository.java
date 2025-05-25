package com.hospital.santajoana.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.ProdutoPedido;

@Repository
public class ProdutoPedidoRepository extends BaseRepository<ProdutoPedido, LocalDateTime> {
    private final JdbcTemplate jdbcTemplate;

    @SuppressWarnings("unused")
    public ProdutoPedidoRepository(JdbcTemplate jdbcTemplate) {
        super("PRODUTO_PEDIDO", "CRIADO_EM", jdbcTemplate, (rs, rowNum) -> {
            return new ProdutoPedido(
                rs.getTimestamp("CRIADO_EM").toLocalDateTime(),
                rs.getLong("ID_PRODUTO"),
                rs.getTimestamp("DATA_PEDIDO").toLocalDateTime(),
                rs.getInt("QUANTIDADE")
            );
        });
        this.jdbcTemplate = jdbcTemplate;
    }

    public ProdutoPedido save(ProdutoPedido produtoPedido) {
        String insertSql = "INSERT INTO PRODUTO_PEDIDO (ID_PRODUTO, DATA_PEDIDO, QUANTIDADE) VALUES (?, ?, ?)";
        jdbcTemplate.update(insertSql,
            produtoPedido.getProdutoId(),
            produtoPedido.getDataPedido(),
            produtoPedido.getQuantidade());

        var lastInserted = super.findLastInserted();

        return lastInserted;
    }

    //OBS: O método update não está atualizando o ID do produto e do pedido, apenas a quantidade.
    public ProdutoPedido update(ProdutoPedido produtoPedido) {
        String updateSql = "UPDATE PRODUTO_PEDIDO SET QUANTIDADE = ? WHERE CRIADO_EM = ?";
        jdbcTemplate.update(updateSql,
            produtoPedido.getQuantidade(),
            produtoPedido.getCriadoEm()
        );
        return produtoPedido;
    }

    public void deleteById(LocalDateTime criadoEm) {
        String sql = "DELETE FROM PRODUTO_PEDIDO WHERE CRIADO_EM = ?";
        jdbcTemplate.update(sql, criadoEm);
    }

    public List<ProdutoPedido> findByPedidoData(LocalDateTime data) {
        String sql = "SELECT * FROM PRODUTO_PEDIDO WHERE DATA_PEDIDO = ?";
        return super.findBySql(sql, data);
    }
    

}
