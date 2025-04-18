package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;
import com.hospital.santajoana.domain.services.FaturaMediator;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/faturas")
public class FaturaController extends BaseController<Fatura, LocalDateTime> {

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


    @PostMapping("/create")
    @Override
    public ResponseEntity<Fatura> create(Fatura entity) {

        var existingFatura = faturaMediator.findByDataEntradaEstadia(entity.getDataEntradaEstadia());
        if (existingFatura.isPresent()) {
            throw new IllegalArgumentException("Fatura em aberto já registrada pra essa estadia: " + entity.getDataEntradaEstadia());
        }

        return super.create(entity);
    }

    @GetMapping("/estadia/{dataEntradaEstadia}")
    public ResponseEntity<Fatura> findByDataEntradaEstadia(@PathVariable LocalDateTime dataEntradaEstadia){
        return faturaMediator.findByDataEntradaEstadia(dataEntradaEstadia).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/update/status")
    public ResponseEntity<Fatura> updateStatus(@PathVariable("id") String id, @RequestBody Map<String, String> status){
        LocalDateTime dataEmissao = LocalDateTime.parse(id);
        var result = faturaMediator.updateStatus(dataEmissao, Fatura.StatusPagamento.fromString(status.get("status")));
        return result.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }


}
