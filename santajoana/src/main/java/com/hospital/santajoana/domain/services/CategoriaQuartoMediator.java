package com.hospital.santajoana.domain.services;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.CategoriaQuarto;
import com.hospital.santajoana.domain.repository.CategoriaQuartoRepository;

@Service
public class CategoriaQuartoMediator extends BaseMediator<CategoriaQuarto> {

    private final CategoriaQuartoRepository repository;
    
    public CategoriaQuartoMediator(CategoriaQuartoRepository repository) {
        super(repository);
        this.repository = repository;
    }

    public CategoriaQuarto save(CategoriaQuarto categoriaQuarto) {
        return repository.save(categoriaQuarto);
    }

    public CategoriaQuarto update(CategoriaQuarto categoriaQuarto) {
        return repository.update(categoriaQuarto);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public void delete(CategoriaQuarto categoriaQuarto) {
        repository.deleteById(categoriaQuarto.getId());
    }

}
