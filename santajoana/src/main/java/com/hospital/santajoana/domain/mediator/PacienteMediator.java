package com.hospital.santajoana.domain.mediator;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.repository.PacienteRepository;

@Service
public class PacienteMediator extends BaseMediator<Paciente>  {
    
    private final PacienteRepository pacienteRepository;
    
    public PacienteMediator(PacienteRepository pacienteRepository) {
        super(pacienteRepository);
        this.pacienteRepository = pacienteRepository;
    }
    
    public Paciente save(Paciente paciente) {
        if(this.findByCpf(paciente.getCpf()).isPresent()){
            throw new IllegalArgumentException("Paciente já cadastrado.");
        }

        return pacienteRepository.save(paciente);

    }
    
    public void delete(Paciente entity) {
        pacienteRepository.deleteById(entity.getId());
    }

    public Paciente update(Paciente paciente) {
        return pacienteRepository.update(paciente);
    }

    public Optional<Paciente> findByCpf(String cpf) {
        String sql = "SELECT * FROM PACIENTE WHERE CPF = ?";
        return pacienteRepository.findBySql(sql, cpf)
        .stream().
        findFirst();

    }

    public Paciente updateStatus(Long id, Paciente.StatusPaciente status) {
        Optional<Paciente> paciente = findById(id);
        
        if (paciente == null || paciente.isEmpty()) {
            throw new IllegalArgumentException("Paciente não encontrado");
        }
        
        Paciente pacienteEntity = paciente.get();
        pacienteEntity.setStatus(status);
        return pacienteRepository.updateStatus(pacienteEntity);
    }



}
