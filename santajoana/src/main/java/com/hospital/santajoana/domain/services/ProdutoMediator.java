package com.hospital.santajoana.domain.services;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Produto;
import com.hospital.santajoana.domain.repository.ProdutoRepository;

@Service
public class ProdutoMediator extends BaseMediator<Produto, Long> {
    
    private final ProdutoRepository produtoRepository;
    
    public ProdutoMediator(ProdutoRepository produtoRepository) {
        super(produtoRepository);
        this.produtoRepository = produtoRepository;
    }
    
    public Produto save(Produto produto) {
        return produtoRepository.save(produto);
    }
    
    public void delete(Produto entity) {
        produtoRepository.deleteById(entity.getId());
    }

    public Produto update(Produto produto) {
        return produtoRepository.update(produto);
    }

}
