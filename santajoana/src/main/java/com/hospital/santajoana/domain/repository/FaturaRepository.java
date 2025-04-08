package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;

@Repository
public class FaturaRepository extends BaseRepository<Fatura> {

    public FaturaRepository(JdbcTemplate jdbcTemplate) {
        super("FATURA", "ID_FATURA", jdbcTemplate, (rs, rowNum) -> {
            // Extrair valores das colunas
            Long idFatura = rs.getLong("ID_FATURA");
            Long idEstadia = rs.getLong("ID_ESTADIA");
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
                    idFatura,
                    idEstadia,
                    valorTotal,
                    statusPagamento,
                    idMetodoPagamento,
                    dataPagamentoLocal,
                    dataEmissaoLocal);
        });
    }

    public Fatura save(Fatura fatura) {
        String insertSql = "INSERT INTO FATURA (ID_ESTADIA) VALUES (?)";

        jdbcTemplate.update(insertSql,
                fatura.getEstadiaId()
                );

                var savedFatura = findLastInserted();
                
        return savedFatura;
    }

    public Fatura update(Fatura fatura) {
        String updateSql = "UPDATE FATURA SET ID_ESTADIA = ?, VALOR_TOTAL = ?, STATUS_PAGAMENTO = ?, DATA_PAGAMENTO = ?, ID_METODO_PAGAMENTO = ? WHERE ID_FATURA = ?";
        jdbcTemplate.update(updateSql,
                fatura.getEstadiaId(),
                fatura.getValorTotal(),
                fatura.getStatusPagamento().getDescricao(),
                fatura.getDataPagamento() != null ? Timestamp.valueOf(fatura.getDataPagamento()) : null,
                fatura.getMetodoPagamentoId(),
                fatura.getId());
            var updatedFatura = findById(fatura.getId());
        return updatedFatura.get();
    }

    public Optional<Fatura> findByEstadiaId(Long estadiaId) {
        String sql = "SELECT * FROM FATURA WHERE ID_ESTADIA = ?";
        return findBySql(sql, estadiaId).stream().findFirst();
    }

    public List<Fatura> findByStatus(StatusPagamento status) {
        String sql = "SELECT * FROM FATURA WHERE STATUS_PAGAMENTO = ?";
        String descricao = status.getDescricao();
        return findBySql(sql, descricao);
    }
}
