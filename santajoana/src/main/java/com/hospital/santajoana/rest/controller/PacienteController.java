package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.mediator.PacienteMediator;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController extends BaseController<Paciente> {

    public PacienteController(PacienteMediator pacienteMediator) {
        super(pacienteMediator);
    }
    
}
