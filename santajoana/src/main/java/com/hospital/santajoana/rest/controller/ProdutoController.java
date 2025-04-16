package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Produto;
import com.hospital.santajoana.domain.services.ProdutoMediator;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController extends BaseController<Produto, Long> {

    public ProdutoController(ProdutoMediator produtoMediator) {
        super(produtoMediator);
    }
}
