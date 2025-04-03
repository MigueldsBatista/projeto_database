package com.hospital.santajoana.domain.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.entity.Pedido.StatusPedido;

@Repository
public class PedidoRepository extends BaseRepository<Pedido> {

    public PedidoRepository(JdbcTemplate jdbcTemplate) {
        super("PEDIDO","ID_PEDIDO", jdbcTemplate, (rs, rowNum) -> new Pedido(
            rs.getLong("ID_PEDIDO"),
            rs.getLong("ID_ESTADIA"),
            rs.getLong("ID_CAMAREIRA"),
            StatusPedido.fromString(rs.getString("STATUS")),
            rs.getTimestamp("DATA_PEDIDO").toLocalDateTime()
        ));
    }

    public Pedido save(Pedido pedido) {
        String insertSql = "INSERT INTO PEDIDO (ID_ESTADIA, ID_CAMAREIRA) VALUES (?, ?)";
        jdbcTemplate.update(insertSql,
            pedido.getEstadiaId(),
            pedido.getCamareiraId()
            );

            pedido.setDataPedido(java.time.LocalDateTime.now());
            pedido.setStatus(StatusPedido.PENDENTE);
        return pedido;
    }

    public Pedido update(Pedido pedido) {
        String updateSql = "UPDATE PEDIDO SET ID_ESTADIA = ?, ID_CAMAREIRA = ?, STATUS = ? WHERE ID_PEDIDO = ?";
        jdbcTemplate.update(updateSql,
            pedido.getEstadiaId(),
            pedido.getCamareiraId(),
            pedido.getStatus().getDescricao(),
            pedido.getId()
        );
        return pedido;
    }

    public List<Pedido> findByEstadiaId(Long estadiaId) {
        String sql = "SELECT * FROM PEDIDO WHERE ID_ESTADIA = ?";
        return findBySql(sql, estadiaId);
    }

    public Pedido updateStatus(Long pedidoId, StatusPedido status) {
        String updateSql = "UPDATE PEDIDO SET STATUS = ? WHERE ID_PEDIDO = ?";
        jdbcTemplate.update(updateSql,
            status.getDescricao(),
            pedidoId
        );
        return findById(pedidoId).orElse(null);
    }
}
