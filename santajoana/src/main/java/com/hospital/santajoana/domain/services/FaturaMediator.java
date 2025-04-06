package com.hospital.santajoana.domain.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.repository.FaturaRepository;

@Service
public class FaturaMediator extends BaseMediator<Fatura> {
    
    private final FaturaRepository faturaRepository;
    
    public FaturaMediator(FaturaRepository faturaRepository) {
        super(faturaRepository);
        this.faturaRepository = faturaRepository;
    }
    
    public Fatura save(Fatura fatura) {
        return faturaRepository.save(fatura);
    }
    
    public void delete(Fatura entity) {
        faturaRepository.deleteById(entity.getId());
    }

    public Fatura update(Fatura entity) {
        return faturaRepository.update(entity);
    }

     public Optional<Fatura> marcarComoPaga(Long faturaId, Long metodoPagamentoId) {
        return faturaRepository.findById(faturaId).map(fatura -> {
            fatura.setStatusPagamento(Fatura.StatusPagamento.Pago);
            fatura.setMetodoPagamentoId(metodoPagamentoId);
            fatura.setDataPagamento(LocalDateTime.now());
            return faturaRepository.update(fatura);
        });
    }

    public List<Fatura> findByStatus(Fatura.StatusPagamento status) {
        return faturaRepository.findByStatus(status);
    }

    public Optional<Fatura> findByEstadiaId(Long estadiaId) {
        return faturaRepository.findByEstadiaId(estadiaId);
    }

}
