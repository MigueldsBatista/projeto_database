package com.hospital.santajoana.domain.services;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Camareira;
import com.hospital.santajoana.domain.repository.CamareiraRepository;

@Service
public class CamareiraMediator extends BaseMediator<Camareira> {
    
    private final CamareiraRepository CamareiraRepository;
    
    public CamareiraMediator(CamareiraRepository CamareiraRepository) {
        super(CamareiraRepository);
        this.CamareiraRepository = CamareiraRepository;
    }
    
    public Camareira save(Camareira camareira) {
        return CamareiraRepository.save(camareira);
    }

    public void delete(Camareira entity) {
        CamareiraRepository.deleteById(entity.getId());
    }

    public Camareira update(Camareira camareira) {
        return CamareiraRepository.update(camareira);
    }
    
}
