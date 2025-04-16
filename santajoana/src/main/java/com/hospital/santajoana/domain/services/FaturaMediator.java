package com.hospital.santajoana.domain.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;
import com.hospital.santajoana.domain.repository.FaturaRepository;

@Service
public class FaturaMediator extends BaseMediator<Fatura, LocalDateTime> {
    
    private final FaturaRepository faturaRepository;
    private final EstadiaMediator estadiaMediator;

    public FaturaMediator(FaturaRepository faturaRepository, EstadiaMediator estadiaMediator) {
        super(faturaRepository);
        this.faturaRepository = faturaRepository;
        this.estadiaMediator = estadiaMediator;
    }
    
    public Fatura save(Fatura fatura) {
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

    public Optional<Fatura> findByDataEntradaEstadia(LocalDateTime dataEntradaEstadia) {
        return faturaRepository.findByDataEntradaEstadia(dataEntradaEstadia);
    }

}
