package com.hospital.santajoana.rest.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.services.EstadiaMediator;
import com.hospital.santajoana.domain.services.PacienteMediator;
import com.hospital.santajoana.domain.services.PedidoMediator;
import com.hospital.santajoana.domain.services.QuartoMediator;

@RestController
@RequestMapping("/api/estadias")
public class EstadiaController extends BaseController<Estadia, LocalDateTime> {

    private final PedidoMediator pedidoMediator;
    private final PacienteMediator pacienteMediator;
    private final QuartoMediator quartoMediator;
    private final EstadiaMediator estadiaMediator;

    public EstadiaController(EstadiaMediator estadiaMediator, PedidoMediator pedidoMediator, PacienteMediator pacienteMediator, QuartoMediator quartoMediator) {
        super(estadiaMediator);
        this.estadiaMediator = estadiaMediator;
        this.pedidoMediator = pedidoMediator;
        this.pacienteMediator = pacienteMediator;
        this.quartoMediator = quartoMediator;
    }

    @Override
    @PutMapping("/update")
    public ResponseEntity<Estadia> update(@RequestBody Estadia entity) {
        if (entity.getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Estadia> original = estadiaMediator.findById(entity.getId());
        if(original.isPresent() && !original.get().getPacienteId().equals(entity.getPacienteId())){
            throw new IllegalArgumentException("Paciente não pode ser alterado.");
        }

        return super.update(entity);
    }

    @GetMapping("/{dataEntradaEstadia}/pedidos")
    public ResponseEntity<List<Pedido>> findPedidosBydataEntradaEstadia(@PathVariable LocalDateTime dataEntradaEstadia){
        
        var pedidos = pedidoMediator.findPedidosBydataEntradaEstadia(dataEntradaEstadia);

        return ResponseEntity.ok(pedidos);
    }
    @GetMapping("/tempo-medio")
    public ResponseEntity<Map<String, Object>> findTempoMedioEstadia(){
        
        var tempo = estadiaMediator.findTempoMedioEstadia();
        Map<String, Object> tempoMedio = Map.of(
            "tempoMedio", tempo
        );
        return ResponseEntity.ok(tempoMedio);
    }

    @GetMapping
    @Override
    public ResponseEntity<List<Estadia>> findAll(@RequestParam(required = false) Map<String, String> params) {

        var estadias = estadiaMediator.findAll();
        estadias.forEach(estadia -> {
            var paciente = pacienteMediator.findById(estadia.getPacienteId());
            if (paciente.isPresent()) {
                estadia.setPacienteNome(paciente.get().getNome());
            }
            var quarto = quartoMediator.findById(estadia.getQuartoId());
            if (quarto.isPresent()) {
                estadia.setQuartoNumero(quarto.get().getNumero());
            }
        });

        return ResponseEntity.ok(estadias);
    }
    @GetMapping("/{estadiaId}")
    @Override
    public ResponseEntity<Estadia> findById(@PathVariable LocalDateTime estadiaId) {
        var estadiaOpt = estadiaMediator.findById(estadiaId);
        if (estadiaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var estadia = estadiaOpt.get();

        var pacienteOpt = pacienteMediator.findById(estadia.getPacienteId());
        var quartoOpt = quartoMediator.findById(estadia.getQuartoId());

        if (pacienteOpt.isEmpty() || quartoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        estadia.setPacienteNome(pacienteOpt.get().getNome());
        estadia.setQuartoNumero(quartoOpt.get().getNumero());

        return ResponseEntity.ok(estadia);
        }
    }