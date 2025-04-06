package com.hospital.santajoana.domain.services;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.MetodoPagamento;
import com.hospital.santajoana.domain.repository.MetodoPagamentoRepository;


@Service
public class MetodoPagamentoMediator extends BaseMediator<MetodoPagamento> {

    
    private final MetodoPagamentoRepository metodoPagamentoRepository;

    public MetodoPagamentoMediator(MetodoPagamentoRepository metodoPagamentoRepository) {
        super(metodoPagamentoRepository);
        this.metodoPagamentoRepository = metodoPagamentoRepository;
    }

    public void delete(MetodoPagamento entity) {
        metodoPagamentoRepository.deleteById(entity.getId());
    };

    public MetodoPagamento update(MetodoPagamento entity) {

        return metodoPagamentoRepository.update(entity);
    }

    public MetodoPagamento save(MetodoPagamento entity) {
        return metodoPagamentoRepository.save(entity);
    }

    // Implement any additional methods specific to MetodoPagamento if needed

}
