package com.hospital.santajoana.domain.services;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.repository.PedidoRepository;


@Service
public class PedidoMediator extends BaseMediator<Pedido, LocalDateTime> {
    
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


        var dataEntradaEstadia = pedido.getDataEntradaEstadia();
        var camareiraId = pedido.getCamareiraId();

        if(camareiraMediator.findById(camareiraId).isEmpty()){
            throw new IllegalArgumentException("Camareira não encontrada.");
        }

        if(estadiaMediator.findById(dataEntradaEstadia).isEmpty()){
            throw new IllegalArgumentException("Estadia não encontrada.");
        }

        return pedidoRepository.save(pedido);
    }
    
    public Pedido updateStatus(LocalDateTime id, Pedido.StatusPedido status) {
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


    public List<Pedido> findPedidosBydataEntradaEstadia(LocalDateTime dataEntradaEstadia){
        if(!estadiaMediator.findById(dataEntradaEstadia).isPresent()){
            
            throw new IllegalArgumentException("Estadia com id "+ dataEntradaEstadia+ " Não encontrada");
        }

        return pedidoRepository.findPedidosBydataEntradaEstadia(dataEntradaEstadia);
    }

    //Retorna os pedidos da ultima estadia do paciente
    public List<Pedido> findLatestPedidosByPacienteId(Long pacienteId) {

        Optional<Estadia> estadia = estadiaMediator.findMostRecentEstadiaByPacienteId(pacienteId);

        if(!estadia.isPresent()) return List.of();// Se não houver estadia, retorna uma lista vazia

        return this.findPedidosBydataEntradaEstadia(estadia.get().getId());

    }


}
