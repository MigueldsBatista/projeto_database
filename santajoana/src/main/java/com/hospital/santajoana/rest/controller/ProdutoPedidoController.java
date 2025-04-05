package com.hospital.santajoana.rest.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import com.hospital.santajoana.domain.entity.ProdutoPedido;
import com.hospital.santajoana.domain.services.ProdutoPedidoMediator;
import com.hospital.santajoana.rest.dto.ProdutoPedidoDTO;

import io.micrometer.core.ipc.http.HttpSender.Response;

public class ProdutoPedidoController extends BaseController<ProdutoPedido> {

    private final ProdutoPedidoMediator produtoPedidoMediator;

    public ProdutoPedidoController(ProdutoPedidoMediator produtoPedidoMediator) {
        super(produtoPedidoMediator);
        this.produtoPedidoMediator = produtoPedidoMediator;
    }



}
