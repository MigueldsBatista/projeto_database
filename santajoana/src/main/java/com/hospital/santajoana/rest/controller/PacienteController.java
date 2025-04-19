package com.hospital.santajoana.rest.controller;

import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.services.EstadiaMediator;
import com.hospital.santajoana.domain.services.FaturaMediator;
import com.hospital.santajoana.domain.services.PacienteMediator;
import com.hospital.santajoana.domain.services.PedidoMediator;
import com.hospital.santajoana.domain.services.QuartoMediator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hospital.santajoana.domain.entity.Pedido;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController extends BaseController<Paciente, Long> {

    private final PacienteMediator pacienteMediator;
    private final PedidoMediator pedidoMediator;
    private final EstadiaMediator estadiaMediator;
    private final FaturaMediator faturaMediator;
    private final QuartoMediator quartoMediator;
    
    public PacienteController(PacienteMediator pacienteMediator, PedidoMediator pedidoMediator, EstadiaMediator estadiaMediator, FaturaMediator faturaMediator, QuartoMediator quartoMediator) {
        super(pacienteMediator);
        this.pacienteMediator = pacienteMediator;
        this.pedidoMediator=pedidoMediator;
        this.estadiaMediator=estadiaMediator;
        this.faturaMediator=faturaMediator;
        this.quartoMediator=quartoMediator;

    }

    @PostMapping("/create")
    @Override
    public ResponseEntity<Paciente> create(@RequestBody Paciente paciente) {


        Paciente savedPaciente = pacienteMediator.save(paciente);

        var quartosOptional = quartoMediator.findFreeQuarto();

        if (quartosOptional.isEmpty()) {
            throw new IllegalArgumentException("Não há quartos disponíveis.");
        }

        var quartos = quartosOptional.get();
        if (quartos.isEmpty()) {
            throw new IllegalArgumentException("Não há quartos disponíveis.");
        }

        var estadia = estadiaMediator.save(new Estadia(savedPaciente.getId(), quartos.get(0).getId()));

        if (estadia == null) {
            throw new IllegalArgumentException("Não foi possível criar a estadia.");
        }

        var fatura = faturaMediator.save(new Fatura(estadia.getId()));
        
        if (fatura == null) {
            throw new IllegalArgumentException("Não foi possível criar a fatura.");
        }

        return ResponseEntity.ok(savedPaciente);
    }


    @PatchMapping("/update/status/{id}")
    public ResponseEntity<Paciente> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) throws IllegalArgumentException{
            
        StatusPaciente statusPaciente = StatusPaciente.fromString(statusMap.get("status"));

            Paciente updated = pacienteMediator.updateStatus(id, statusPaciente);

            return ResponseEntity.ok(updated);
        }
    
    @GetMapping("/{id}/pedidos")
    public ResponseEntity<List<Pedido>> getPedidosByPacienteId(@PathVariable Long id) {

        List<Pedido> pedidos = pedidoMediator.findLatestPedidosByPacienteId(id);

        return ResponseEntity.ok(pedidos);
    }

    @PostMapping("/create/from-camareira")
    public ResponseEntity<Paciente> createFromCamareira(@RequestBody Map<String, String> cpfMap) {

        String cpf = cpfMap.get("cpf");

        Paciente savedPaciente = pacienteMediator.saveFromCamareiraCpf(cpf);
        if (savedPaciente == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(savedPaciente);
    }

    @GetMapping("/estadia-recente/{id}")
    public ResponseEntity<Estadia> findEstadiaByPacienteId(@PathVariable Long id) {
        var estadia = estadiaMediator.findMostRecentEstadiaByPacienteId(id);

        if (estadia.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(estadia.get());
    }
    @GetMapping("/fatura-recente/{id}")
    public ResponseEntity<Fatura> findFaturaByPacienteId(@PathVariable Long id) {

        var fatura = faturaMediator.findMostRecentFaturaByPacienteId(id);

        if (fatura.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(fatura.get());
    }
    

}