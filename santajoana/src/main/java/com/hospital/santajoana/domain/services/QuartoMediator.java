package com.hospital.santajoana.domain.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Quarto;
import com.hospital.santajoana.domain.repository.QuartoRepository;

@Service
public class QuartoMediator extends BaseMediator<Quarto, Long> {
    
    private final QuartoRepository quartoRepository;
    
    public QuartoMediator(QuartoRepository quartoRepository) {
        super(quartoRepository);
        this.quartoRepository = quartoRepository;
    }
    
    public Quarto save(Quarto quarto) {
        return quartoRepository.save(quarto);
    }
    
    public Optional<Quarto> findById(Long id) {
        return quartoRepository.findById(id);
    }
    
    public void deleteById(Long id) {
        quartoRepository.deleteById(id);
    }

    public void delete(Quarto entity) {
        quartoRepository.deleteById(entity.getId());
    }

    public Quarto update(Quarto quarto) {
        return quartoRepository.update(quarto);
    }
}
