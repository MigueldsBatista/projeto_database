package com.hospital.santajoana.domain.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.repository.PedidoRepository;


@Service
public class PedidoMediator extends BaseMediator<Pedido> {
    
    private final PedidoRepository pedidoRepository;
    private final EstadiaMediator estadiaMediator;
    private final CamareiraMediator camareiraMediator;
    
    public PedidoMediator(PedidoRepository pedidoRepository, EstadiaMediator estadiaMediator, CamareiraMediator camareiraMediator) {
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository;
        this.estadiaMediator = estadiaMediator;
        this.camareiraMediator = camareiraMediator;
    }
    
    public Pedido save(Pedido pedido) {


        var estadiaId = pedido.getEstadiaId();
        var camareiraId = pedido.getCamareiraId();

        if(camareiraMediator.findById(camareiraId).isEmpty()){
            throw new IllegalArgumentException("Camareira não encontrada.");
        }

        if(estadiaMediator.findById(estadiaId).isEmpty()){
            throw new IllegalArgumentException("Estadia não encontrada.");
        }

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


    public List<Pedido> findPedidosByEstadiaId(Long estadiaId){
        if(!estadiaMediator.findById(estadiaId).isPresent()){
            
            throw new IllegalArgumentException("Estadia com id "+ estadiaId+ " Não encontrada");
        }

        return pedidoRepository.findPedidosByEstadiaId(estadiaId);
    }

    //Retorna os pedidos da ultima estadia do paciente
    public List<Pedido> findLatestPedidosByPacienteId(Long pacienteId) {

        Optional<Estadia> estadia = estadiaMediator.findMostRecentEstadiaByPacienteId(pacienteId);

        if(!estadia.isPresent()) return List.of();// Se não houver estadia, retorna uma lista vazia

        return this.findPedidosByEstadiaId(estadia.get().getId());

    }


}
