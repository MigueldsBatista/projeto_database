package com.hospital.santajoana.domain.mediator;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.repository.EstadiaRepository;


@Service
public class EstadiaMediator extends BaseMediator<Estadia> {
    private final EstadiaRepository repository;
    private final PacienteMediator pacienteMediator;

    public EstadiaMediator(EstadiaRepository repository, PacienteMediator pacienteMediator) {
        super(repository);
        this.repository = repository;
        this.pacienteMediator=pacienteMediator;
    }

    public Estadia save(Estadia estadia) {
        Optional<Estadia> existingEstadia = repository.getMostRecentEstadiaByPacienteId(estadia.getPacienteId());

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

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public void delete(Estadia entity) {
        repository.deleteById(entity.getId());          
    }

}
