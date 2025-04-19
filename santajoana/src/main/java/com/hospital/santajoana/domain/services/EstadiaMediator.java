package com.hospital.santajoana.domain.services;

import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.repository.EstadiaRepository;


@Service
public class EstadiaMediator extends BaseMediator<Estadia, LocalDateTime> {
    private final EstadiaRepository repository;
    private final PacienteMediator pacienteMediator;

    public EstadiaMediator(EstadiaRepository repository, PacienteMediator pacienteMediator) {
        super(repository);
        this.repository = repository;
        this.pacienteMediator=pacienteMediator;
    }

    public Estadia save(Estadia estadia) {
        Optional<Estadia> existingEstadia = this.findMostRecentEstadiaByPacienteId(estadia.getPacienteId());

        Optional<Paciente> paciente = pacienteMediator.findById(estadia.getPacienteId());


        if(
            existingEstadia.isPresent() &&
            paciente.isPresent() && 
            !paciente.get().getStatus().equals(StatusPaciente.ALTA)
            ){
            throw new IllegalArgumentException("Paciente já possui uma estadia ativa.");
        }

        if(!paciente.isPresent()){
            throw new IllegalArgumentException("Paciente não encontrado.");
        }

        var pacienteEntity = paciente.get();
        pacienteEntity.setStatus(StatusPaciente.INTERNADO);
        pacienteMediator.update(paciente.get());//Precisa atualizar o paciente para que o status seja atualizado no banco de dados
        return repository.save(estadia);

    }

    public Estadia update(Estadia estadia) {
        return repository.update(estadia);
    }

    public void deleteById(LocalDateTime id) {
        repository.deleteById(id);
    }

    public void delete(Estadia entity) {
        repository.deleteById(entity.getId());          
    }

    public Optional<Estadia> findMostRecentEstadiaByPacienteId(Long pacienteId){

        return repository.findMostRecentEstadiaByPacienteId(pacienteId);
    }



}
