package com.hospital.santajoana.rest.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Produto;
import com.hospital.santajoana.domain.entity.auxiliar.ProdutoQuantidade;
import com.hospital.santajoana.domain.services.ProdutoMediator;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController extends BaseController<Produto, Long> {

    private final ProdutoMediator produtoMediator;

    public ProdutoController(ProdutoMediator produtoMediator) {
        super(produtoMediator);
        this.produtoMediator = produtoMediator;
    }

    @GetMapping("/mais-pedidos-por-categoria")
    public ResponseEntity<List<ProdutoQuantidade>> findMaisPedidosPorCategoria() {
        List<ProdutoQuantidade> produtos = produtoMediator.findMaisPedidosByCategoria();
        return ResponseEntity.ok(produtos);
    }
}
