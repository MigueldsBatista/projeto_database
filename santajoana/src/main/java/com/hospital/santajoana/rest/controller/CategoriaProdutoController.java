package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.CategoriaProduto;
import com.hospital.santajoana.domain.services.CategoriaProdutoMediator;

@RestController
@RequestMapping("/api/categoria-produto")
public class CategoriaProdutoController extends BaseController<CategoriaProduto> {

    private final CategoriaProdutoMediator mediator;

    public CategoriaProdutoController(CategoriaProdutoMediator mediator) {
        super(mediator);
        this.mediator = mediator;
    }

    

}
