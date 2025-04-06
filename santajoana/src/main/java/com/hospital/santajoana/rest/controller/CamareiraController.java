package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Camareira;
import com.hospital.santajoana.domain.services.CamareiraMediator;

@RestController
@RequestMapping("/api/camareiras")
public class CamareiraController extends BaseController<Camareira> {
    //embed methods
    //get, post, put, delete
    //get by id
    //get all

    public CamareiraController(CamareiraMediator camareiraMediator) {
        super(camareiraMediator);
    }
}
