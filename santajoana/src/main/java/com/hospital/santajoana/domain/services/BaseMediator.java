package com.hospital.santajoana.domain.services;

import com.hospital.santajoana.domain.repository.BaseRepository;
import com.hospital.santajoana.domain.repository.CrudOperations;

import java.util.List;
import java.util.Optional;

public abstract class BaseMediator<T> implements CrudOperations<T> {
    
    private final BaseRepository<T> repository;
    
    public BaseMediator(BaseRepository<T> repository) {
        this.repository = repository;
    }
    
    public List<T> findAll() {
        return repository.findAll();
    }

    public Optional<T> findById(Long id) {
        return repository.findById(id);
    }
    
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
    
    public abstract T save(T entity);
    
    public abstract T update(T entity);
    
    // This method is not part of CrudOperations but is specific to the mediator
    public abstract void delete(T entity);
}
