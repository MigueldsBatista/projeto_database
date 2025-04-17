package com.hospital.santajoana.domain.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.ProdutoPedido;
import com.hospital.santajoana.domain.repository.ProdutoPedidoRepository;


@Service
public class ProdutoPedidoMediator extends BaseMediator<ProdutoPedido, LocalDateTime> {

    private final ProdutoPedidoRepository produtoPedidoRepository;

    public ProdutoPedidoMediator(ProdutoPedidoRepository produtoPedidoRepository){
        super(produtoPedidoRepository);
        this.produtoPedidoRepository=produtoPedidoRepository;
    }

    public List<ProdutoPedido> findProdutosbyPedidoData(LocalDateTime data) {
        
        return produtoPedidoRepository.findByPedidoData(data);
    }
    

    public ProdutoPedido save(ProdutoPedido produtoPedido) {
        return produtoPedidoRepository.save(produtoPedido);
    }

    public void delete(ProdutoPedido entity) {
        produtoPedidoRepository.deleteById(entity.getId());
    }

    public void deleteById(ProdutoPedido produtoPedido) {
        produtoPedidoRepository.deleteById(produtoPedido.getId());
    }

    public ProdutoPedido update(ProdutoPedido produtoPedido) {
        return produtoPedidoRepository.update(produtoPedido);
    }

}