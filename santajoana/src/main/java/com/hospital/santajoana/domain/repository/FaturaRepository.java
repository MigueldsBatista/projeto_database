package com.hospital.santajoana.domain.repository;

import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.RowMapper;

import java.time.LocalDateTime;

import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;
import com.hospital.santajoana.domain.entity.auxiliar.AggregatedFatura;

@Repository
public class FaturaRepository extends BaseRepository<Fatura, LocalDateTime> {

    public enum AggregateMethods {
        DIA("DIA"),
        MES("MES"),
        ANO("ANO");

        private final String descricao;

        AggregateMethods(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }

        public static AggregateMethods fromString(String descricao) {
            for (AggregateMethods method : AggregateMethods.values()) {
                if (method.descricao.equalsIgnoreCase(descricao)) {
                    return method;
                }
            }
            throw new IllegalArgumentException("Método de agregação inválido: " + descricao);
        }
    }

    @SuppressWarnings("unused")
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
        var faturaIns = findByDataEntradaEstadia(fatura.getDataEntradaEstadia()).orElse(null);
        return faturaIns;
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

    /**
     * Atualiza o valor total da fatura chamando a stored procedure atualizar_valor_fatura.
     * @param dataPedido Data do pedido para o qual a fatura deve ser atualizada.
     */
    public void updateValorTotal(LocalDateTime dataPedido) {
        String callSql = "CALL atualizar_valor_fatura(?)";
        jdbcTemplate.update(callSql, Timestamp.valueOf(dataPedido));
    }

    public Fatura findByDataPedido(LocalDateTime dataPedido) {
        String sql = "SELECT * FROM FATURA INNER JOIN PEDIDO ON FATURA.DATA_ENTRADA_ESTADIA = PEDIDO.DATA_ENTRADA_ESTADIA WHERE PEDIDO.DATA_PEDIDO = ?";
        return findBySql(sql, dataPedido).stream().findFirst().orElse(null);
    }

    /**
     * Encontra a média de gastos por fatura para um paciente específico
     * @return A média de gastos por fatura para o paciente
     */
    public BigDecimal findAvgPacienteGastoFatura() {

        String sql = """
                SELECT 
                    AVG(VALOR_TOTAL) AS MEDIA
                    FROM FATURA
                    INNER JOIN ESTADIA ON
                    FATURA.DATA_ENTRADA_ESTADIA = ESTADIA.DATA_ENTRADA
                    """;
        RowMapper<BigDecimal> rowMapper = (rs, rowNum) -> rs.getBigDecimal("MEDIA");

        return this.jdbcTemplate.queryForObject(sql, rowMapper);
    }

    /**
     * Encontra a média de gastos por fatura para um paciente específico
     * @return A média de gastos por fatura para o paciente
     */
    public BigDecimal findMonthTotalFaturamento() {

        String sql = """
                SELECT 
                    SUM(VALOR_TOTAL) AS TOTAL
                    FROM FATURA
                    WHERE MONTH(FATURA.DATA_PAGAMENTO) = MONTH(CURRENT_DATE())
                """;
        RowMapper<BigDecimal> rowMapper = (rs, rowNum) -> rs.getBigDecimal("TOTAL");

        return this.jdbcTemplate.queryForObject(sql, rowMapper);
    }

    /**
     * Busca o faturamento total agregado por período
     * @param startDateTime Data inicial do período
     * @param endDateTime Data final do período
     * @param aggregateMethod Método de agregação (DIA, MES, ANO)
     * @return Lista de faturas agregadas por período com valores totalizados
     */
    public List<AggregatedFatura> findAggregatedTotalFaturamento(LocalDateTime startDateTime, LocalDateTime endDateTime,
                                                                   AggregateMethods aggregateMethod) {

        String groupByClause;

        switch (aggregateMethod) {
            case DIA:
                groupByClause = "GROUP BY YEAR(`DATA_PAGAMENTO`), MONTH(`DATA_PAGAMENTO`), DAY(`DATA_PAGAMENTO`)";
                break;
            case MES:
                groupByClause = "GROUP BY YEAR(`DATA_PAGAMENTO`), MONTH(`DATA_PAGAMENTO`)";
                break;
            case ANO:
                groupByClause = "GROUP BY YEAR(`DATA_PAGAMENTO`)";
                break;
            default:
                throw new IllegalArgumentException("Método de agregação inválido: " + aggregateMethod);
        }

        String sql = String.format("""
                SELECT 
                    MIN(`DATA_PAGAMENTO`) AS startDate,
                    MAX(`DATA_PAGAMENTO`) AS endDate,
                    SUM(`VALOR_TOTAL`) AS total
                FROM `FATURA`
                WHERE `DATA_PAGAMENTO` BETWEEN ? AND ?
                %s
                """, groupByClause);

        RowMapper<AggregatedFatura> rowMapper = (rs, rowNum) -> {
            AggregatedFatura agg = new AggregatedFatura();
            agg.setStartDate(rs.getTimestamp("startDate").toLocalDateTime());
            agg.setEndDate(rs.getTimestamp("endDate").toLocalDateTime());
            agg.setTotal(rs.getBigDecimal("total"));
            return agg;
        };

        return jdbcTemplate.query(sql, rowMapper, Timestamp.valueOf(startDateTime), Timestamp.valueOf(endDateTime));
    }
}