package com.hospital.santajoana.rest.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.services.EstadiaMediator;
import com.hospital.santajoana.domain.services.PedidoMediator;

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

    @Override
    @PutMapping("/update")
    public ResponseEntity<Estadia> update(@RequestBody Estadia entity) {
        if (entity.getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Estadia> original = estadiaMediator.findById(entity.getId());
        if(original.isPresent() && original.get().getPacienteId() != entity.getPacienteId()){
            throw new IllegalArgumentException("Paciente não pode ser alterado.");
        }

        return super.update(entity);
    }

    @GetMapping("/{estadiaId}/pedidos")
    public ResponseEntity<List<Pedido>> findPedidosByEstadiaId(@PathVariable Long estadiaId){
        
        var pedidos = pedidoMediator.findPedidosByEstadiaId(estadiaId);

        return ResponseEntity.ok(pedidos);
    }
}
