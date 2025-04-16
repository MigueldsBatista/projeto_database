package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hospital.santajoana.domain.entity.ProdutoPedido;
import com.hospital.santajoana.domain.services.ProdutoPedidoMediator;

// @RestController
// @RequestMapping("/api/produto-pedidos")
// public class ProdutoPedidoController extends BaseController<ProdutoPedido> {

//     private final ProdutoPedidoMediator produtoPedidoMediator;

//     public ProdutoPedidoController(ProdutoPedidoMediator produtoPedidoMediator) {
//         super(produtoPedidoMediator);
//         this.produtoPedidoMediator = produtoPedidoMediator;
//     }

//     @DeleteMapping("/delete")
//     public void delete(@RequestParam Long produtoId, @RequestParam Long pedidoId) {
//         produtoPedidoMediator.delete(produtoId, pedidoId);
//     }
// }
