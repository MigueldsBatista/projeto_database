package com.hospital.santajoana.rest.controller;

import org.springframework.http.ResponseEntity;

import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.services.EstadiaMediator;
import com.hospital.santajoana.domain.services.PacienteMediator;
import com.hospital.santajoana.domain.services.PedidoMediator;
import com.hospital.santajoana.domain.entity.Pedido;
import java.util.List;
import java.util.Map;

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

}