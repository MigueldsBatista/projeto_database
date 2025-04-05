package com.hospital.santajoana.rest.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.entity.Quarto;
import com.hospital.santajoana.domain.services.EstadiaMediator;
import com.hospital.santajoana.domain.services.PacienteMediator;
import com.hospital.santajoana.domain.services.PedidoMediator;
import com.hospital.santajoana.domain.services.QuartoMediator;
import com.hospital.santajoana.rest.dto.EstadiaDTO;

@RestController
@RequestMapping("/api/estadias")
public class EstadiaController extends BaseController<Estadia> {

    private final PedidoMediator pedidoMediator;
    private final EstadiaMediator estadiaMediator;
    private final PacienteMediator pacienteMediator;
    private final QuartoMediator quartoMediator;

    public EstadiaController(
        EstadiaMediator estadiaMediator, 
        PedidoMediator pedidoMediator,
        PacienteMediator pacienteMediator,
        QuartoMediator quartoMediator) {
        super(estadiaMediator);
        this.estadiaMediator = estadiaMediator;
        this.pedidoMediator = pedidoMediator;
        this.pacienteMediator = pacienteMediator;
        this.quartoMediator = quartoMediator;
    }

    // Override these methods to handle DTO conversions

    @GetMapping
    public ResponseEntity<List<EstadiaDTO>> findAll() {
        List<Estadia> estadias = estadiaMediator.findAll();
        List<EstadiaDTO> estadiaDTOs = new EstadiaDTO().fromEntitiesToDtos(estadias);
        return ResponseEntity.ok(estadiaDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EstadiaDTO> findById(@PathVariable Long id) {
        Optional<Estadia> optionalEstadia = estadiaMediator.findById(id);
        if (optionalEstadia.isPresent()) {
            EstadiaDTO dto = new EstadiaDTO().fromEntityToDTO(optionalEstadia.get());
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/create")
    public ResponseEntity<EstadiaDTO> create(@RequestBody EstadiaDTO estadiaDTO) {
        // Get referenced entities from their IDs
        Optional<Paciente> pacienteOpt = pacienteMediator.findById(estadiaDTO.getPacienteId());
        Optional<Quarto> quartoOpt = quartoMediator.findById(estadiaDTO.getQuartoId());
        
        if (pacienteOpt.isEmpty() || quartoOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Convert DTO to Entity using full objects
        LocalDateTime entrada = estadiaDTO.getDataEntrada() != null ? 
            LocalDateTime.parse(estadiaDTO.getDataEntrada()) : LocalDateTime.now();
        
        LocalDateTime saida = estadiaDTO.getDataSaida() != null ? 
            LocalDateTime.parse(estadiaDTO.getDataSaida()) : null;
            
        Estadia estadia = new Estadia(
            estadiaDTO.getId(), 
            pacienteOpt.get(), 
            quartoOpt.get(), 
            entrada, 
            saida
        );
        
        // Save and convert back to DTO
        Estadia savedEstadia = estadiaMediator.save(estadia);
        EstadiaDTO savedDTO = new EstadiaDTO().fromEntityToDTO(savedEstadia);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<EstadiaDTO> update(@PathVariable Long id, @RequestBody EstadiaDTO estadiaDTO) {
        Optional<Estadia> originalOpt = estadiaMediator.findById(id);
        if (originalOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Estadia original = originalOpt.get();
        
        // Check if paciente is being changed (which is not allowed)
        if (!original.getPaciente().getId().equals(estadiaDTO.getPacienteId())) {
            return ResponseEntity.badRequest().body(null); // Cannot change paciente
        }
        
        // Get referenced entities
        Optional<Paciente> pacienteOpt = pacienteMediator.findById(estadiaDTO.getPacienteId());
        Optional<Quarto> quartoOpt = quartoMediator.findById(estadiaDTO.getQuartoId());
        
        if (pacienteOpt.isEmpty() || quartoOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Create updated entity
        LocalDateTime entrada = estadiaDTO.getDataEntrada() != null ? 
            LocalDateTime.parse(estadiaDTO.getDataEntrada()) : original.getDataEntrada();
        
        LocalDateTime saida = estadiaDTO.getDataSaida() != null ? 
            LocalDateTime.parse(estadiaDTO.getDataSaida()) : original.getDataSaida();
            
        Estadia estadia = new Estadia(
            id, 
            pacienteOpt.get(), 
            quartoOpt.get(), 
            entrada,
            saida
        );
        
        // Update and convert back to DTO
        Estadia updatedEstadia = estadiaMediator.update(id, estadia);
        EstadiaDTO updatedDTO = new EstadiaDTO().fromEntityToDTO(updatedEstadia);
        
        return ResponseEntity.ok(updatedDTO);
    }

    @GetMapping("/{estadiaId}/pedidos")
    public ResponseEntity<List<Pedido>> findPedidosByEstadiaId(@PathVariable Long estadiaId){
        var pedidos = pedidoMediator.findPedidosByEstadiaId(estadiaId);
        return ResponseEntity.ok(pedidos);
    }
}
