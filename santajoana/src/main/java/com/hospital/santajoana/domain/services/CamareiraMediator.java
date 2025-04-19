package com.hospital.santajoana.domain.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Camareira;
import com.hospital.santajoana.domain.repository.CamareiraRepository;

@Service
public class CamareiraMediator extends BaseMediator<Camareira, Long> {
    
    private final CamareiraRepository camareiraRepository;
    
    public CamareiraMediator(CamareiraRepository camareiraRepository) {
        super(camareiraRepository);
        this.camareiraRepository = camareiraRepository;
    }
    
    public Camareira save(Camareira camareira) {
        if(this.findByCpf(camareira.getCpf()).isPresent()){
            throw new IllegalArgumentException("Camareira já cadastrada.");
        }
        
        return camareiraRepository.save(camareira);
    }
    
    public void delete(Camareira entity) {
        camareiraRepository.deleteById(entity.getId());
    }

    public Camareira update(Camareira camareira) {
        return camareiraRepository.update(camareira);
    }

    public Optional<Camareira> findByCpf(String cpf) {
        return camareiraRepository.findByCpf(cpf);
    }
    
    /**
     * Authenticate a camareira by email and password
     * @param email The camareira's email
     * @param senha The camareira's password
     * @return true if authentication is successful, false otherwise
     */
    public boolean authenticate(String email, String senha) {
        return camareiraRepository.authenticate(email, senha);
    }
    
    /**
     * Find a camareira by their email
     * @param email The camareira's email
     * @return The camareira if found, null otherwise
     */
    public Optional<Camareira> findByEmail(String email) {
        return camareiraRepository.findByEmail(email);
    }

    /**
     * Update profile picture for a camareira
     * @param id The camareira ID
     * @param fotoPerfilBase64 The base64 string of the profile picture
     * @return The updated camareira
     */
    public Camareira updateProfilePicture(Long id, String fotoPerfilBase64) {
        return camareiraRepository.updateProfilePicture(id, fotoPerfilBase64);
    }
}
