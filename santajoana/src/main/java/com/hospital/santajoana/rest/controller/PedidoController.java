package com.hospital.santajoana.rest.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.entity.Pedido.StatusPedido;
import com.hospital.santajoana.domain.services.PedidoMediator;
import com.hospital.santajoana.domain.services.ProdutoPedidoMediator;
import com.hospital.santajoana.rest.dto.ProdutoPedidoDTO;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController extends BaseController<Pedido> {

    private final PedidoMediator pedidoMediator;
    private final ProdutoPedidoMediator produtoPedidoMediator;

    public PedidoController(PedidoMediator pedidoMediator, ProdutoPedidoMediator produtoPedidoMediator) {
        super(pedidoMediator);
        this.pedidoMediator = pedidoMediator;
        this.produtoPedidoMediator=produtoPedidoMediator;
    }
    
    @PutMapping("/update/status/{id}")
    public ResponseEntity<Pedido> updateStatus(@PathVariable Long id, @RequestParam String status) {//
        //exemplo: /api/pedidos/1/status?status=FINALIZADO
            StatusPedido statusPedido = StatusPedido.fromString(status);
            Pedido updatedPedido = pedidoMediator.updateStatus(id, statusPedido);
            return ResponseEntity.ok(updatedPedido);
    }

    @GetMapping("/{id}/produtos")
    public ResponseEntity<List<ProdutoPedidoDTO>> findProdutosbyPedidoId(Long pedidoId){

        List<ProdutoPedidoDTO> produtos = produtoPedidoMediator.findProdutosbyPedidoId(pedidoId);

        return ResponseEntity.ok(produtos);

}



}
