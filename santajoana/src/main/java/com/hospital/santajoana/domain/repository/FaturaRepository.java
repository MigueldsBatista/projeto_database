package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;

@Repository
public class FaturaRepository extends BaseRepository<Fatura, LocalDateTime> {

    public FaturaRepository(JdbcTemplate jdbcTemplate) {
        super("FATURA", "DATA_EMISSAO", jdbcTemplate, (rs, rowNum) -> {
            // Extrair valores das colunas
            Timestamp dataEntradaEstadia = rs.getTimestamp("DATA_ENTRADA_ESTADIA");
            java.time.LocalDateTime dataEntradaEstadiaLocal = dataEntradaEstadia != null ? dataEntradaEstadia.toLocalDateTime() : null;

            Long idMetodoPagamento = rs.getLong("ID_METODO_PAGAMENTO");
            
            // Verificar se valores decimais são nulos
            java.math.BigDecimal valorTotal = rs.getBigDecimal("VALOR_TOTAL");
            if (rs.wasNull()) {
                valorTotal = null;
            }
            
            // Verificar status de pagamento
            String statusStr = rs.getString("STATUS_PAGAMENTO");
            StatusPagamento statusPagamento = statusStr != null ? StatusPagamento.fromString(statusStr) : null;
            
            // Verificar timestamps e converter para LocalDateTime se não forem nulos
            Timestamp dataPagamento = rs.getTimestamp("DATA_PAGAMENTO");
            java.time.LocalDateTime dataPagamentoLocal = dataPagamento != null ? dataPagamento.toLocalDateTime() : null;
            
            Timestamp dataEmissao = rs.getTimestamp("DATA_EMISSAO");
            java.time.LocalDateTime dataEmissaoLocal = dataEmissao != null ? dataEmissao.toLocalDateTime() : null;

            return new Fatura(
                dataEntradaEstadiaLocal,
                    dataEmissaoLocal,
                    valorTotal,
                    statusPagamento,
                    idMetodoPagamento,
                    dataPagamentoLocal
                    );
        });
    }

    public Fatura save(Fatura fatura) {
        String insertSql = "INSERT INTO FATURA (DATA_ENTRADA_ESTADIA) VALUES (?)";

        jdbcTemplate.update(insertSql,
                fatura.getDataEntradaEstadia()
        );

        return findByDataEntradaEstadia(fatura.getDataEntradaEstadia()).orElse(null);
    }

    public Fatura update(Fatura fatura) {
        String updateSql = "UPDATE FATURA SET DATA_ENTRADA_ESTADIA = ?, VALOR_TOTAL = ?, STATUS_PAGAMENTO = ?, DATA_PAGAMENTO = ?, ID_METODO_PAGAMENTO = ? WHERE DATA_EMISSAO = ?";
        jdbcTemplate.update(updateSql,
                fatura.getDataEntradaEstadia(),
                fatura.getValorTotal(),
                fatura.getStatusPagamento() != null ? fatura.getStatusPagamento().getDescricao() : null,
                fatura.getDataPagamento() != null ? Timestamp.valueOf(fatura.getDataPagamento()) : null,
                fatura.getMetodoPagamentoId(),
                fatura.getId());

        return findByDataEntradaEstadia(fatura.getDataEntradaEstadia()).orElse(null);
    }

    public Optional<Fatura> findByDataEntradaEstadia(LocalDateTime dataEntradaEstadia) {
        String sql = "SELECT * FROM FATURA WHERE DATA_ENTRADA_ESTADIA = ?";
        return findBySql(sql, dataEntradaEstadia).stream().findFirst();
    }

    public List<Fatura> findByStatus(StatusPagamento status) {
        String sql = "SELECT * FROM FATURA WHERE STATUS_PAGAMENTO = ?";
        String descricao = status.getDescricao();
        return findBySql(sql, descricao);
    }
}
