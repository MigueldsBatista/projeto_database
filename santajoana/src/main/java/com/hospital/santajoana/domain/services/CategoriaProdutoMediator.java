package com.hospital.santajoana.domain.services;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.CategoriaProduto;
import com.hospital.santajoana.domain.repository.CategoriaProdutoRepository;

@Service
public class CategoriaProdutoMediator extends BaseMediator<CategoriaProduto> {

    private final CategoriaProdutoRepository repository;

    public CategoriaProdutoMediator(CategoriaProdutoRepository repository) {
        super(repository);
        this.repository = repository;
    }

    public CategoriaProduto save(CategoriaProduto categoriaProduto) {
        return repository.save(categoriaProduto);
    }

    public CategoriaProduto update(CategoriaProduto categoriaProduto) {
        return repository.update(categoriaProduto);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public void delete(CategoriaProduto categoriaProduto) {
        repository.deleteById(categoriaProduto.getId());
    }

}
