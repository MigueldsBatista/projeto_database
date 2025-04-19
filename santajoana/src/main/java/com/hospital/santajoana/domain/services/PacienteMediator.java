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
            throw new IllegalArgumentException("Paciente com esse CPF já cadastrado.");
        }

        if(this.findByEmail(paciente.getEmail()).isPresent()){
            throw new IllegalArgumentException("Paciente com esse email já cadastrado.");
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
            throw new IllegalArgumentException("Paciente com esse CPF já cadastrado.");
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
            throw new IllegalArgumentException("Paciente com esse CPF já cadastrado.");
        }


        Paciente paciente = new Paciente();
        paciente.setCpf(camareira.getCpf());
        paciente.setNome(camareira.getNome());
        paciente.setDataNascimento(camareira.getDataNascimento());
        paciente.setTelefone(camareira.getTelefone());
        paciente.setEndereco(camareira.getEndereco());
        paciente.setSenha(camareira.getSenha());
        paciente.setEmail(camareira.getEmail());
        paciente.setFotoPerfilBase64(camareira.getFotoPerfilBase64());

        return save(paciente);
    }

    /**
     * Authenticate a user by email and password
     * @param email The user's email
     * @param senha The user's password
     * @return true if authentication is successful, false otherwise
     */
    public boolean authenticate(String email, String senha) {
        return pacienteRepository.authenticate(email, senha);
    }
    
    /**
     * Find a paciente by their email
     * @param email The paciente's email
     * @return The paciente if found, null otherwise
     */
    public Optional<Paciente> findByEmail(String email) {
        return pacienteRepository.findByEmail(email);
    }

    /**
     * Update profile picture for a paciente
     * @param id The paciente ID
     * @param fotoPerfilBase64 The base64 string of the profile picture
     * @return The updated paciente
     */
    public Paciente updateProfilePicture(Long id, String fotoPerfilBase64) {
        return pacienteRepository.updateProfilePicture(id, fotoPerfilBase64);
    }


    public boolean updatePassword(Long id, String candidatePassword, String newPassword) {
        Optional<Paciente> paciente = findById(id);
        

        if (candidatePassword == null || candidatePassword.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("Senha atual ou antiga não pode ser vazia");
        }

        if (candidatePassword==newPassword) {
            throw new IllegalArgumentException("A nova senha não pode ser igual à senha atual");
        }

        if (paciente == null || paciente.isEmpty()) {
            throw new IllegalArgumentException("Paciente não encontrado");
        }
        
        if (!paciente.get().getSenha().equals(candidatePassword)) {
            throw new IllegalArgumentException("Senha atual inválida");
        }
        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("Nova senha não pode ser vazia");
        }

        Paciente pacienteEntity = paciente.get();
        pacienteEntity.setSenha(newPassword);

        return pacienteRepository.updatePassword(id, newPassword);
    }
}
