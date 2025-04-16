package com.hospital.santajoana.rest.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.hospital.santajoana.domain.entity.Entity;
import com.hospital.santajoana.domain.services.BaseMediator;

public abstract class BaseController<T extends Entity<PK>, PK> {

    protected final BaseMediator<T, PK> mediator;

    public BaseController(BaseMediator<T, PK> mediator) {
        this.mediator = mediator;
    }

    @GetMapping
    public ResponseEntity<List<T>> findAll(@RequestParam(required = false) Map<String, String> params) {

        // By default, we'll return all entities if no specific filter implementation exists
        // Child controllers can override this method to provide specific filtering
        return ResponseEntity.ok(mediator.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> findById(@PathVariable PK id) {
        Optional<T> entity = mediator.findById(id);

        if (entity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity.get());
    }

    @PostMapping("/create")
    public ResponseEntity<T> create(@RequestBody T entity) {
        T savedEntity = mediator.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/update")
    public ResponseEntity<T> update(@RequestBody T entity) {
        if (entity.getId() == null) {
            throw new IllegalArgumentException("Entity ID must not be null for update");
        }
        
        Optional<T> existingEntity = mediator.findById(entity.getId());
        
        if (existingEntity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        T updatedEntity = mediator.update(entity);
        
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable PK id) {
        Optional<T> entity = mediator.findById(id);
        if (entity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        mediator.delete(entity.get());
        return ResponseEntity.noContent().build();
    }
}
