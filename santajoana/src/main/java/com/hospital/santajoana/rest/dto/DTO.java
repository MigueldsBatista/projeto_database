package com.hospital.santajoana.rest.dto;

import java.util.List;

public interface DTO<Entity> {
    
    // Convert a single entity to DTO
    public DTO<Entity> fromEntityToDTO(Entity entity);
    
    // Convert a list of entities to a list of DTOs
    public List<? extends DTO<Entity>> fromEntitiesToDtos(List<Entity> entities);
    
    // The following methods are recommended but optional
    // They'd need to be implemented by specific DTOs as needed
    
    // Convert DTO to Entity (optional)
    // Entity toEntity();
}
