package com.hospital.santajoana.rest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Quarto;
import com.hospital.santajoana.domain.services.QuartoMediator;

@RestController
@RequestMapping("/api/quartos")
public class QuartoController extends BaseController<Quarto, Long> {

    public QuartoController(QuartoMediator quartoMediator) {
        super(quartoMediator);
    }

    
    @GetMapping("/livres")
    public ResponseEntity<?> getQuartoLivre() {
        return ((QuartoMediator) mediator).findFreeQuarto()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
