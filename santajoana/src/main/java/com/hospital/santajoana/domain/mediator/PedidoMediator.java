package com.hospital.santajoana.domain.mediator;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.repository.PedidoRepository;

@Service
public class PedidoMediator extends BaseMediator<Pedido> {
    
    private final PedidoRepository pedidoRepository;
    
    public PedidoMediator(PedidoRepository pedidoRepository) {
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository;
    }
    
    public Pedido save(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }
    
    public Pedido updateStatus(Long id, Pedido.StatusPedido status) {
        Optional<Pedido> pedido = findById(id);
        
        if (pedido == null || pedido.isEmpty()) {
            throw new IllegalArgumentException("Pedido não encontrado");
        }
        
        Pedido pedidoEntity = pedido.get();
        
        pedidoEntity.setStatus(status);

        return pedidoRepository.updateStatus(pedidoEntity.getId(), status);
    }

    public void delete(Pedido entity) {
        pedidoRepository.deleteById(entity.getId());
    }

    public Pedido update(Pedido pedido) {
        return pedidoRepository.update(pedido);
    }


}
