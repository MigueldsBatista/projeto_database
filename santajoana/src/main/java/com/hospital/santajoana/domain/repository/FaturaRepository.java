package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;

@Repository
public class FaturaRepository extends BaseRepository<Fatura> {

    public FaturaRepository(JdbcTemplate jdbcTemplate) {
        super("FATURA", "ID_FATURA", jdbcTemplate, (rs, rowNum) -> {
            Timestamp dataPagamento = rs.getTimestamp("DATA_PAGAMENTO");
            Timestamp dataEmissao = rs.getTimestamp("DATA_EMISSAO");
            
            return new Fatura(
                rs.getLong("ID_FATURA"),
                rs.getLong("ID_ESTADIA"),
                rs.getBigDecimal("VALOR_TOTAL"),
                StatusPagamento.valueOf(rs.getString("STATUS_PAGAMENTO")),
                rs.getLong("ID_METODO_PAGAMENTO"),
                dataPagamento != null ? dataPagamento.toLocalDateTime() : null,
                dataEmissao != null ? dataEmissao.toLocalDateTime() : null
            );
        });
    }

    public Fatura save(Fatura fatura) {
        String insertSql = "INSERT INTO FATURA (ID_ESTADIA, VALOR_TOTAL, STATUS_PAGAMENTO, DATA_PAGAMENTO, ID_METODO_PAGAMENTO) VALUES (?, ?, ?, ?, ?)";
        
        jdbcTemplate.update(insertSql,
            fatura.getEstadiaId(),
            fatura.getValorTotal(),
            fatura.getStatusPagamento().name(),
            fatura.getDataPagamento() != null ? Timestamp.valueOf(fatura.getDataPagamento()) : null,
            fatura.getMetodoPagamentoId());
        return fatura;
    }


    public Fatura update(Fatura fatura) {
        String updateSql = "UPDATE FATURA SET ID_ESTADIA = ?, VALOR_TOTAL = ?, STATUS_PAGAMENTO = ?, DATA_PAGAMENTO = ?, ID_METODO_PAGAMENTO = ? WHERE ID_FATURA = ?";
        jdbcTemplate.update(updateSql,
            fatura.getEstadiaId(),
            fatura.getValorTotal(),
            fatura.getStatusPagamento().name(),
            fatura.getDataPagamento() != null ? Timestamp.valueOf(fatura.getDataPagamento()) : null,
            fatura.getMetodoPagamentoId(),
            fatura.getId()
        );
        return fatura;
    }
}
