package com.hospital.santajoana.domain.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Produto;
import com.hospital.santajoana.domain.entity.ProdutoPedido;
import com.hospital.santajoana.domain.repository.ProdutoRepository;
import com.hospital.santajoana.domain.repository.ProdutoPedidoRepository;
import com.hospital.santajoana.rest.dto.ProdutoPedidoDTO;


@Service
public class ProdutoPedidoMediator {

    private final ProdutoRepository produtoRepository;
    private final ProdutoPedidoRepository produtoPedidoRepository;

    public ProdutoPedidoMediator(ProdutoRepository produtoRepository, ProdutoPedidoRepository produtoPedidoRepository){
        this.produtoPedidoRepository=produtoPedidoRepository;
        this.produtoRepository=produtoRepository;
    }

    public List<ProdutoPedido> findProdutosbyPedidoId(Long pedidoId) {
        
        return produtoPedidoRepository.findByPedidoId(pedidoId);
    }
    
    public ProdutoPedidoDTO addProdutoToPedido(Long pedidoId, Long produtoId, Integer quantidade) {
        ProdutoPedido produtoPedido = new ProdutoPedido(produtoId, pedidoId, quantidade);
        ProdutoPedido saved = produtoPedidoRepository.save(produtoPedido);
        
        Produto produto = produtoRepository.findById(produtoId)
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        
        return ProdutoPedidoDTO.fromEntities(produto, saved);
    }

    public ProdutoPedido save(ProdutoPedido produtoPedido) {
        return produtoPedidoRepository.save(produtoPedido);
    }

    public void delete(Long produtoId, Long pedidoId) {
        produtoPedidoRepository.deleteById(produtoId, pedidoId);
    }

    public ProdutoPedido update(ProdutoPedido produtoPedido) {
        return produtoPedidoRepository.update(produtoPedido);
    }

}