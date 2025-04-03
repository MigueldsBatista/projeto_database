package com.hospital.santajoana.domain.mediator;

import com.hospital.santajoana.domain.entity.ProdutoPedido;
import com.hospital.santajoana.domain.repository.ProdutoPedidoRepository;

public class ProdutoPedidoMediator extends BaseMediator<ProdutoPedido> {

    private final ProdutoPedidoRepository produtoPedidoRepository;

    public ProdutoPedidoMediator(ProdutoPedidoRepository produtoPedidoRepository) {
        super(produtoPedidoRepository);
        this.produtoPedidoRepository = produtoPedidoRepository;
    }

    public ProdutoPedido save(ProdutoPedido produtoPedido) {
        return produtoPedidoRepository.save(produtoPedido);
    }

    public void delete(ProdutoPedido entity) {
        produtoPedidoRepository.deleteById(entity.getId());
    }

    public ProdutoPedido update(ProdutoPedido produtoPedido) {
        return produtoPedidoRepository.update(produtoPedido);
    }

}
