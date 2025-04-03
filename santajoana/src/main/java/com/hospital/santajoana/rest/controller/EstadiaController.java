package com.hospital.santajoana.rest.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.mediator.EstadiaMediator;

@RestController
@RequestMapping("/api/estadias")
public class EstadiaController extends BaseController<Estadia> {

    private final EstadiaMediator estadiaMediator;

    public EstadiaController(EstadiaMediator estadiaMediator) {
        super(estadiaMediator);
        this.estadiaMediator = estadiaMediator;
    }

    public ResponseEntity<Estadia> update(Long id, Estadia entity) {

        Optional<Estadia> original = estadiaMediator.findById(id);
        if(original.isPresent() && original.get().getPacienteId() != entity.getPacienteId()){
            throw new IllegalArgumentException("Paciente não pode ser alterado.");
        }

        return super.update(id, entity);
    }


    
}
