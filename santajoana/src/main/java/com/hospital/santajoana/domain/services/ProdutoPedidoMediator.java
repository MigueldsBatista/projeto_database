package com.hospital.santajoana.domain.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.ProdutoPedido;
import com.hospital.santajoana.domain.repository.ProdutoPedidoRepository;

@Service
public class ProdutoPedidoMediator extends BaseMediator<ProdutoPedido, LocalDateTime> {

    private final ProdutoPedidoRepository produtoPedidoRepository;
    private final PedidoMediator pedidoMediator;
    private final FaturaMediator faturaMediator;

    public ProdutoPedidoMediator(ProdutoPedidoRepository produtoPedidoRepository, 
                               PedidoMediator pedidoMediator,
                               FaturaMediator faturaMediator) {
        super(produtoPedidoRepository);
        this.produtoPedidoRepository = produtoPedidoRepository;
        this.pedidoMediator = pedidoMediator;
        this.faturaMediator = faturaMediator;
    }

    public List<ProdutoPedido> findProdutosbyPedidoData(LocalDateTime data) {
        if (data == null) {
            throw new IllegalArgumentException("Data do pedido não pode ser nula");
        }
        return produtoPedidoRepository.findByPedidoData(data);
    }
    
    public ProdutoPedido save(ProdutoPedido produtoPedido) {
        if (produtoPedido == null) {
            throw new IllegalArgumentException("Produto pedido não pode ser nulo");
        }
        
        var dataPedido = produtoPedido.getDataPedido();
        if (dataPedido == null) {
            throw new IllegalArgumentException("Data do pedido não pode ser nula");
        }
        
        var pedido = pedidoMediator.findById(dataPedido);
        if (pedido.isEmpty()) {
            throw new IllegalStateException("Pedido não encontrado para a data informada");
        }
        var fatura = faturaMediator.findByDataEntradaEstadia(pedido.get().getDataEntradaEstadia());

        if (fatura.isEmpty()) {
            throw new IllegalStateException("Fatura não encontrada para a data informada");
        }
        
        // Salva o produto pedido
        ProdutoPedido savedProdutoPedido = produtoPedidoRepository.save(produtoPedido);
        
        // Atualiza o valor total da fatura
        faturaMediator.updateValorTotal(fatura.get().getDataEmissao());
        
        return savedProdutoPedido;
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