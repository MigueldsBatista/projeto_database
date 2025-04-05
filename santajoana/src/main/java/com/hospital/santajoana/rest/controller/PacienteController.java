package com.hospital.santajoana.rest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.mediator.EstadiaMediator;
import com.hospital.santajoana.domain.mediator.PacienteMediator;
import com.hospital.santajoana.domain.mediator.PedidoMediator;
import com.hospital.santajoana.domain.entity.Pedido;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController extends BaseController<Paciente> {

    private final PacienteMediator pacienteMediator;
    private final PedidoMediator pedidoMediator;

    public PacienteController(PacienteMediator pacienteMediator, PedidoMediator pedidoMediator, EstadiaMediator estadiaMediator) {
        super(pacienteMediator);
        this.pacienteMediator = pacienteMediator;
        this.pedidoMediator=pedidoMediator;
    }
    
    @PutMapping("/update/status/{id}")
    public ResponseEntity<Paciente> updateStatus(@PathVariable Long id, @RequestParam String status) {
            StatusPaciente statusPaciente = StatusPaciente.fromString(status);

            Paciente updated = pacienteMediator.updateStatus(id, statusPaciente);
            return ResponseEntity.ok(updated);
        }
    
    @GetMapping("/{id}/pedidos")
    public ResponseEntity<List<Pedido>> getPedidosByPacienteId(@PathVariable Long id) {

        List<Pedido> pedidos = pedidoMediator.findLatestPedidosByPacienteId(id);

        return ResponseEntity.ok(pedidos);
    }

}