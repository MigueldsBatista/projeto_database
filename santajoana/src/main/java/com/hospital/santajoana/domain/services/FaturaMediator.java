package com.hospital.santajoana.domain.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;
import com.hospital.santajoana.domain.repository.FaturaRepository;

@Service
public class FaturaMediator extends BaseMediator<Fatura, LocalDateTime> {
    
    private final FaturaRepository faturaRepository;
    private final EstadiaMediator estadiaMediator;
    private final JdbcTemplate jdbcTemplate;

    public FaturaMediator(FaturaRepository faturaRepository, EstadiaMediator estadiaMediator, JdbcTemplate jdbcTemplate) {
        super(faturaRepository);
        this.faturaRepository = faturaRepository;
        this.estadiaMediator = estadiaMediator;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Fatura> findAll() {
        return faturaRepository.findAll();
    }

    public Optional<Fatura> findByDataEntradaEstadia(LocalDateTime dataEntradaEstadia) {
        if (dataEntradaEstadia == null) {
            throw new IllegalArgumentException("Data de entrada da estadia não pode ser nula");
        }
        return faturaRepository.findByDataEntradaEstadia(dataEntradaEstadia);
    }

    public List<Fatura> findByPacienteId(Long pacienteId) {
        if (pacienteId == null) {
            throw new IllegalArgumentException("ID do paciente não pode ser nulo");
        }
        return faturaRepository.findByPacienteId(pacienteId);
    }

    public Fatura save(Fatura fatura) {
        if (fatura == null) {
            throw new IllegalArgumentException("Fatura não pode ser nula");
        }
        var id = fatura.getDataEntradaEstadia();
        Optional<Estadia> estadiaExistente = estadiaMediator.findById(id);
        if(estadiaExistente.isEmpty()){
            throw new IllegalArgumentException("Estadia não encontrada.");
        }
        Estadia estadia = estadiaExistente.get();

        if(estadia.getDataSaida() != null){
            throw new IllegalArgumentException("Estadia já finalizada.");
        }
        Optional<Fatura> faturaExistente = findByDataEntradaEstadia(estadia.getId());

        if(faturaExistente.isPresent() && faturaExistente.get().getStatusPagamento() == StatusPagamento.PENDENTE){
            throw new IllegalArgumentException("Fatura já existe para esta estadia.");
        }

        return faturaRepository.save(fatura);
    }
    
    public void delete(Fatura entity) {
        faturaRepository.deleteById(entity.getId());
    }

    public Fatura update(Fatura entity) {
        return faturaRepository.update(entity);
    }

     public Optional<Fatura> updateStatus(LocalDateTime faturaId, StatusPagamento status) {
        return faturaRepository.findById(faturaId).map(fatura -> {

            fatura.setStatusPagamento(status);
            fatura.setDataPagamento(LocalDateTime.now());
            return faturaRepository.update(fatura);
        });
    }

    public List<Fatura> findByStatus(StatusPagamento status) {
        return faturaRepository.findByStatus(status);
    }

    public Optional<Fatura> findMostRecentFaturaByPacienteId(Long pacienteId){

        var estadia = estadiaMediator.findMostRecentEstadiaByPacienteId(pacienteId);
        
        if(estadia.isEmpty()){
            return Optional.empty();
        }

        return faturaRepository.findByDataEntradaEstadia(estadia.get().getDataEntrada());
    }

    /**
     * Updates the total value of a fatura by calling the stored procedure
     * @param dataEmissao The invoice issuance date
     */
    public void updateValorTotal(LocalDateTime dataEmissao) {
        try {
            // Call the stored procedure to update the fatura total
            jdbcTemplate.update("CALL update_fatura_total(?)", dataEmissao);
        } catch (Exception e) {
            // Log error and handle gracefully
            System.err.println("Error updating fatura total: " + e.getMessage());
            throw new RuntimeException("Error updating fatura total", e);
        }
    }
    
    /**
     * Manually calculates the total value for a fatura as a fallback method
     * @param estadia The estadia entrada date
     * @return The calculated total value
     */
    public double calculateFaturaTotal(LocalDateTime estadiaEntrada) {
        String sql = "SELECT COALESCE(SUM(pp.QUANTIDADE * p.PRECO), 0) " +
                     "FROM PEDIDO pd " +
                     "JOIN PRODUTO_PEDIDO pp ON pd.DATA_PEDIDO = pp.DATA_PEDIDO " +
                     "JOIN PRODUTO p ON pp.ID_PRODUTO = p.ID_PRODUTO " +
                     "WHERE pd.DATA_ENTRADA_ESTADIA = ?";
        
        return jdbcTemplate.queryForObject(sql, Double.class, estadiaEntrada);
    }
}
