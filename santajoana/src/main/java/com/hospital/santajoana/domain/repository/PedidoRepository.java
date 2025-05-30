package com.hospital.santajoana.domain.repository;

import java.util.List;
import java.time.LocalDateTime;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.entity.Pedido.StatusPedido;
import com.hospital.santajoana.domain.entity.auxiliar.ProdutoQuantidade;

import lombok.Getter;

@Getter
@Repository
public class PedidoRepository extends BaseRepository<Pedido, LocalDateTime> {
    
    @SuppressWarnings("unused")
    public PedidoRepository(JdbcTemplate jdbcTemplate) {
        super("PEDIDO","DATA_PEDIDO", jdbcTemplate, (rs, rowNum) -> {
            java.sql.Timestamp dataPedidoTimestamp = rs.getTimestamp("DATA_PEDIDO");
            java.sql.Timestamp dataEntradaEstadiaTimestamp = rs.getTimestamp("DATA_ENTRADA_ESTADIA");
            
            LocalDateTime dataPedido = dataPedidoTimestamp != null ? dataPedidoTimestamp.toLocalDateTime() : null;
            LocalDateTime dataEntradaEstadia = dataEntradaEstadiaTimestamp != null ? dataEntradaEstadiaTimestamp.toLocalDateTime() : null;
            
            return new Pedido(
                dataEntradaEstadia,
                rs.getLong("ID_CAMAREIRA"),
                StatusPedido.fromString(rs.getString("STATUS")),
                dataPedido
            );
        });
    }

    public Pedido save(Pedido pedido) {
        String insertSql = "INSERT INTO PEDIDO (DATA_ENTRADA_ESTADIA, ID_CAMAREIRA) VALUES (?, ?)";
        jdbcTemplate.update(insertSql,
            pedido.getDataEntradaEstadia(),
            pedido.getCamareiraId()
        );
        return findLastInserted();
    }

    public Pedido update(Pedido pedido) {
        String updateSql = "UPDATE PEDIDO SET DATA_ENTRADA_ESTADIA = ?, ID_CAMAREIRA = ?, STATUS = ? WHERE DATA_PEDIDO = ?";
        jdbcTemplate.update(updateSql,
            pedido.getDataEntradaEstadia(),
            pedido.getCamareiraId(),
            pedido.getStatus() != null ? pedido.getStatus().getDescricao() : null,
            pedido.getId()
        );
        return findById(pedido.getId()).orElse(null);
    }

    public Pedido updateStatus(LocalDateTime pedidoId, StatusPedido status) {
        String updateSql = "UPDATE PEDIDO SET STATUS = ? WHERE DATA_PEDIDO = ?";
        jdbcTemplate.update(updateSql,
            status.getDescricao(),
            pedidoId
        );
        return findById(pedidoId).orElse(null);
    }

    public List<Pedido> findPedidosBydataEntradaEstadia(LocalDateTime dataEntradaEstadia){

        String sql = "SELECT * FROM PEDIDO WHERE DATA_ENTRADA_ESTADIA = ?";
        
        return findBySql(sql, dataEntradaEstadia);

    }

    public Double findMediapedidosByDia() {
        
        String sql= """
                SELECT 
                AVG(pedidos_por_dia) AS media_pedidos_por_dia
                FROM (
                SELECT 
                    DATE(p.`DATA_PEDIDO`) AS dia,
                    COUNT(*) AS pedidos_por_dia
                FROM PEDIDO p
                GROUP BY DATE(p.`DATA_PEDIDO`)
                ) AS contagem_diaria;

                """;

        return jdbcTemplate.queryForObject(sql, Double.class);


    }

}