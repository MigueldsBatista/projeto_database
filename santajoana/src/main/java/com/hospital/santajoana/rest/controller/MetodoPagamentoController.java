package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.MetodoPagamento;
import com.hospital.santajoana.domain.mediator.MetodoPagamentoMediator;

@RestController
@RequestMapping("/api/metodos-pagamento")
public class MetodoPagamentoController extends BaseController<MetodoPagamento> {

    private final MetodoPagamentoMediator metodoPagamentoMediator;

    public MetodoPagamentoController(MetodoPagamentoMediator metodoPagamentoMediator) {
        super(metodoPagamentoMediator);
        this.metodoPagamentoMediator = metodoPagamentoMediator;
    }

}
