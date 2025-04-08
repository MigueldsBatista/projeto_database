package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;
import com.hospital.santajoana.domain.services.FaturaMediator;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/faturas")
public class FaturaController extends BaseController<Fatura> {

    private final FaturaMediator faturaMediator;

    public FaturaController(FaturaMediator faturaMediator) {
        super(faturaMediator);
        this.faturaMediator = faturaMediator;
    }

    @GetMapping
    @Override
    public ResponseEntity<List<Fatura>> findAll(@RequestParam Map<String, String> params) {
        if (params.containsKey("status")) {
            String status = params.get("status");
            StatusPagamento statusPagamento = StatusPagamento.fromString(status);
            List<Fatura> faturas = faturaMediator.findByStatus(statusPagamento);

            if (faturas.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(faturas);
        }
        
        return super.findAll(params);
    }

    @GetMapping("/estadia/{estadiaId}")
    public ResponseEntity<Fatura> findByEstadiaId(@PathVariable Long estadiaId){
        return faturaMediator.findById(estadiaId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/update/status")
    public ResponseEntity<Fatura> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> status){
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    @PutMapping("/update")
    public ResponseEntity<Fatura> update(Fatura entity) {

        return super.update(entity);
    }
}
