package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.MetodoPagamento;
import com.hospital.santajoana.domain.entity.MetodoPagamento.TipoPagamento;

@Repository
public class MetodoPagamentoRepository extends BaseRepository<MetodoPagamento> {

    public MetodoPagamentoRepository(JdbcTemplate jdbcTemplate) {
        super("METODO_PAGAMENTO","ID_METODO_PAGAMENTO", jdbcTemplate, (rs, rowNum) -> new MetodoPagamento(
            rs.getLong("ID_METODO_PAGAMENTO"),
            TipoPagamento.valueOf(rs.getString("TIPO"))
        ));
    }

    public MetodoPagamento save(MetodoPagamento metodoPagamento) {
        String insertSql = "INSERT INTO METODO_PAGAMENTO (TIPO) VALUES (?)";
        jdbcTemplate.update(insertSql,
            metodoPagamento.getTipo().name());
        return metodoPagamento;
    }

    public MetodoPagamento update(MetodoPagamento metodoPagamento) {
        String updateSql = "UPDATE METODO_PAGAMENTO SET TIPO = ? WHERE ID_METODO_PAGAMENTO = ?";
        jdbcTemplate.update(updateSql,
            metodoPagamento.getTipo().name(),
            metodoPagamento.getId()
        );
        return metodoPagamento;
    }
}
