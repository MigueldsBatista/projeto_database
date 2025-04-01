package com.hospital.santajoana.domain.mediator;

import org.springframework.stereotype.Service;

import com.hospital.santajoana.domain.entity.Camareira;
import com.hospital.santajoana.domain.repository.CamareiraRepository;

@Service
public class CamareiraMediator extends BaseMediator<Camareira> {
    
    private final CamareiraRepository CAMAREIRARepository;
    
    public CamareiraMediator(CamareiraRepository CAMAREIRARepository) {
        super(CAMAREIRARepository);
        this.CAMAREIRARepository = CAMAREIRARepository;
    }
    
    public Camareira save(Camareira CAMAREIRA) {
        return CAMAREIRARepository.save(CAMAREIRA);
    }

    public void delete(Camareira entity) {
        CAMAREIRARepository.deleteById(entity.getId());
    }

    public Camareira update(Camareira CAMAREIRA) {
        return CAMAREIRARepository.update(CAMAREIRA);
    }
    
}
