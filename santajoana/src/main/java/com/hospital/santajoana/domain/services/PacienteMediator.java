package com.hospital.santajoana.domain.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Camareira;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.repository.PacienteRepository;

@Service
public class PacienteMediator extends BaseMediator<Paciente, Long> {

    private final CamareiraMediator camareiraMediator;
    
    private final PacienteRepository pacienteRepository;
    
    public PacienteMediator(PacienteRepository pacienteRepository, CamareiraMediator camareiraMediator) {
        super(pacienteRepository);
        this.pacienteRepository = pacienteRepository;
        this.camareiraMediator = camareiraMediator;
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

    public Paciente updateStatus(Long id, StatusPaciente status) {
        Optional<Paciente> paciente = findById(id);
        
        if (paciente == null || paciente.isEmpty()) {
            throw new IllegalArgumentException("Paciente não encontrado");
        }
        
        Paciente pacienteEntity = paciente.get();
        pacienteEntity.setStatus(status);
        return pacienteRepository.updateStatus(pacienteEntity);
    }


    public Paciente saveFromCamareira(Camareira camareira) {
        var existingPaciente = findByCpf(camareira.getCpf());

        if (existingPaciente.isPresent()) {
            throw new IllegalArgumentException("Paciente já cadastrado.");
        }

        var existingCamareira = camareiraMediator.findByCpf(camareira.getCpf());

        if (!existingCamareira.isPresent()) {
            throw new IllegalArgumentException("Camareira não cadastrada.");
        }

        Paciente paciente = new Paciente();

        paciente.setNome(camareira.getNome());
        paciente.setCpf(camareira.getCpf());
        paciente.setDataNascimento(camareira.getDataNascimento());
        paciente.setTelefone(camareira.getTelefone());
        paciente.setEndereco(camareira.getEndereco());
        
        return save(paciente);
    }
    public Paciente saveFromCamareiraCpf(String cpf) {

        var existingCamareira = camareiraMediator.findByCpf(cpf);

        if (!existingCamareira.isPresent()) {
            throw new IllegalArgumentException("Camareira não cadastrada.");
        }

        Camareira camareira = existingCamareira.get();
        var existingPaciente = this.findByCpf(camareira.getCpf());

        if (existingPaciente.isPresent()) {
            throw new IllegalArgumentException("Paciente já cadastrado.");
        }

        Paciente paciente = new Paciente(
            camareira.getCpf(),
            camareira.getNome(),
            camareira.getDataNascimento(),
            camareira.getEndereco(),
            camareira.getTelefone(),
            StatusPaciente.INTERNADO
        );

        return save(paciente);
    }


}
