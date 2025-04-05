package com.hospital.santajoana.rest.controller;

import java.util.List;
import java.util.Optional;
import com.hospital.santajoana.domain.mediator.PedidoMediator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.mediator.EstadiaMediator;

@RestController
@RequestMapping("/api/estadias")
public class EstadiaController extends BaseController<Estadia> {

    private final PedidoMediator pedidoMediator;

    private final EstadiaMediator estadiaMediator;

    public EstadiaController(EstadiaMediator estadiaMediator, PedidoMediator pedidoMediator) {
        super(estadiaMediator);
        this.estadiaMediator = estadiaMediator;
        this.pedidoMediator = pedidoMediator;
    }

    public ResponseEntity<Estadia> update(Long id, Estadia entity) {

        Optional<Estadia> original = estadiaMediator.findById(id);
        if(original.isPresent() && original.get().getPacienteId() != entity.getPacienteId()){
            throw new IllegalArgumentException("Paciente não pode ser alterado.");
        }

        return super.update(id, entity);
    }

    @GetMapping("/{estadiaId}/pedidos")
    public ResponseEntity<List<Pedido>> findPedidosByEstadiaId(@PathVariable Long estadiaId){
        
        var pedidos = pedidoMediator.findPedidosByEstadiaId(estadiaId);

        return ResponseEntity.ok(pedidos);
    }


    
}
