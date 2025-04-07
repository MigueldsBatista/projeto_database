package com.hospital.santajoana.domain.repository;

import java.util.List;
import java.util.Optional;

/**
 * Interface defining standard CRUD operations to be implemented by repositories.
 * @param <T> the entity type
 */
public interface CrudOperations<T> {
    
    /**
     * Save a new entity to the database.
     * @param entity the entity to save
     * @return the saved entity with any generated ID
     */
    T save(T entity);
    
    /**
     * Update an existing entity in the database.
     * @param entity the entity to update
     * @return the updated entity
     */
    T update(T entity);
    
    /**
     * Find all entities of type T.
     * @return a list of all entities
     */
    List<T> findAll();
    
    /**
     * Find an entity by its ID.
     * @param id the entity ID
     * @return an Optional containing the entity if found, or empty if not found
     */
    Optional<T> findById(Long id);
    
    /**
     * Delete an entity by its ID.
     * @param id the entity ID to delete
     */
    void deleteById(Long id);
}
