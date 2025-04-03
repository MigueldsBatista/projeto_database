package com.hospital.santajoana.rest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.entity.Pedido.StatusPedido;
import com.hospital.santajoana.domain.mediator.PedidoMediator;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController extends BaseController<Pedido> {

    private final PedidoMediator pedidoMediator;

    public PedidoController(PedidoMediator pedidoMediator) {
        super(pedidoMediator);
        this.pedidoMediator = pedidoMediator;
    }
    
    @PutMapping("/update/status/{id}")
    public ResponseEntity<Pedido> updateStatus(@PathVariable Long id, @RequestParam String status) {//
        //exemplo: /api/pedidos/1/status?status=FINALIZADO
            StatusPedido statusPedido = StatusPedido.fromString(status);
            Pedido updatedPedido = pedidoMediator.updateStatus(id, statusPedido);
            return ResponseEntity.ok(updatedPedido);
        }
    }
