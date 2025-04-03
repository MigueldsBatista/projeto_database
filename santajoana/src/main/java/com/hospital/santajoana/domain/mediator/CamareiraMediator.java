package com.hospital.santajoana.domain.mediator;

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
    
    public Camareira save(Camareira CAMAREIRA) {
        return CamareiraRepository.save(CAMAREIRA);
    }

    public void delete(Camareira entity) {
        CamareiraRepository.deleteById(entity.getId());
    }

    public Camareira update(Camareira CAMAREIRA) {
        return CamareiraRepository.update(CAMAREIRA);
    }
    
}
