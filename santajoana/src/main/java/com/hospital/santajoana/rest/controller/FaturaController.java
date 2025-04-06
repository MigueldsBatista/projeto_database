package com.hospital.santajoana.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.services.FaturaMediator;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/faturas")
public class FaturaController extends BaseController<Fatura> {

    private final FaturaMediator faturaMediator;

    public FaturaController(FaturaMediator faturaMediator) {
        super(faturaMediator);
        this.faturaMediator = faturaMediator;
    }

    @GetMapping("/estadia/{estadiaId}")
    public ResponseEntity<Fatura> buscarPorEstadia(@PathVariable Long estadiaId){
        return faturaMediator.findById(estadiaId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/pagar")
    public ResponseEntity<Fatura> marcarComoPaga(@PathVariable Long id,@RequestParam Long metodoPagamentoId){
        return faturaMediator.marcarComoPaga(id,metodoPagamentoId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<Fatura>> listarPendentes(){
        return ResponseEntity.ok(faturaMediator.findByStatus(Fatura.StatusPagamento.Pendente));
    }
    
    @GetMapping("/pagas")
    public ResponseEntity<List<Fatura>> listarPagas() {
        return ResponseEntity.ok(faturaMediator.findByStatus(Fatura.StatusPagamento.Pago));
    }    
}
