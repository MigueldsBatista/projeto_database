package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Quarto;
import com.hospital.santajoana.domain.services.QuartoMediator;

@RestController
@RequestMapping("/api/quartos")
public class QuartoController extends BaseController<Quarto> {

    public QuartoController(QuartoMediator quartoMediator) {
        super(quartoMediator);
    }
}
