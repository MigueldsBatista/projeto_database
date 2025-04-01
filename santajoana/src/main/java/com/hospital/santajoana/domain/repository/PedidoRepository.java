package com.hospital.santajoana.domain.repository;

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
            StatusPedido.valueOf(rs.getString("STATUS")),
            rs.getTimestamp("DATA_PEDIDO").toLocalDateTime()
        ));
    }

    public Pedido save(Pedido pedido) {
        String insertSql = "INSERT INTO PEDIDO (ID_ESTADIA, ID_CAMAREIRA, STATUS) VALUES (?, ?, ?)";
        jdbcTemplate.update(insertSql,
            pedido.getEstadiaId(),
            pedido.getCamareiraId(),
            pedido.getStatus().name());
        return pedido;
    }

    public Pedido update(Pedido pedido) {
        String updateSql = "UPDATE PEDIDO SET ID_ESTADIA = ?, ID_CAMAREIRA = ?, STATUS = ? WHERE ID_PEDIDO = ?";
        jdbcTemplate.update(updateSql,
            pedido.getEstadiaId(),
            pedido.getCamareiraId(),
            pedido.getStatus().name(),
            pedido.getId()
        );
        return pedido;
    }
}
