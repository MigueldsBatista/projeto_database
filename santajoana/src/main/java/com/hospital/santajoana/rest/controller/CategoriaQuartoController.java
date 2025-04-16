package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.CategoriaQuarto;
import com.hospital.santajoana.domain.services.CategoriaQuartoMediator;

@RequestMapping("/api/categoria-quarto")
@RestController
public class CategoriaQuartoController extends BaseController<CategoriaQuarto, Long> {

    private final CategoriaQuartoMediator mediator;

    public CategoriaQuartoController(CategoriaQuartoMediator mediator) {
        super(mediator);
        this.mediator = mediator;
    }

    // Implement any additional methods specific to CategoriaQuarto if needed

}
