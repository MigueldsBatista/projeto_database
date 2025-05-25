package com.hospital.santajoana.rest.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.entity.Pedido.StatusPedido;
import com.hospital.santajoana.domain.entity.Produto;
import com.hospital.santajoana.domain.entity.ProdutoPedido;
import com.hospital.santajoana.domain.services.PedidoMediator;
import com.hospital.santajoana.domain.services.ProdutoMediator;
import com.hospital.santajoana.domain.services.ProdutoPedidoMediator;
import com.hospital.santajoana.rest.dto.ProdutoPedidoDTO;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController extends BaseController<Pedido, LocalDateTime> {

    private final PedidoMediator pedidoMediator;
    private final ProdutoPedidoMediator produtoPedidoMediator;
    private final ProdutoMediator produtoMediator;

    public PedidoController(PedidoMediator pedidoMediator, ProdutoPedidoMediator produtoPedidoMediator, ProdutoMediator produtoMediator) {
        super(pedidoMediator);
        this.pedidoMediator = pedidoMediator;
        this.produtoPedidoMediator = produtoPedidoMediator;
        this.produtoMediator = produtoMediator;
    }
    
    @PatchMapping("/update/status/{id}")
    public ResponseEntity<Pedido> updateStatus(@PathVariable("id") String id, @RequestBody Map<String, String> statusMap) {
        LocalDateTime dataPedido = LocalDateTime.parse(id);
        Pedido updatedPedido = pedidoMediator.updateStatus(dataPedido, StatusPedido.fromString(statusMap.get("status")));
        return ResponseEntity.ok(updatedPedido);
    }

    @GetMapping("/{id}/produtos")
    public ResponseEntity<List<ProdutoPedidoDTO>> findPedidoProdutos(@PathVariable LocalDateTime id) {
        
        List<ProdutoPedidoDTO> dtos = new ArrayList<>();

        List<ProdutoPedido> produtosPedidos = produtoPedidoMediator.findProdutosbyPedidoData(id);

        for (ProdutoPedido produtoPedido : produtosPedidos) {

            Produto produto = produtoMediator.findById(produtoPedido.getProdutoId()).get();
                               
            dtos.add(ProdutoPedidoDTO.fromEntities(produto, produtoPedido));
        }

        return ResponseEntity.ok(dtos);
    }


}