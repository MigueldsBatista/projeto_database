package com.hospital.santajoana.rest.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hospital.santajoana.domain.services.BaseMediator;

public abstract class BaseController<T> {

    protected final BaseMediator<T> mediator;

    public BaseController(BaseMediator<T> mediator) {
        this.mediator = mediator;
    }

    @GetMapping
    public ResponseEntity<List<T>> findAll() {
        List<T> entities = mediator.findAll();
        return ResponseEntity.ok(entities);
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<T> findById(@PathVariable Long id) {
        Optional<T> entity = mediator.findById(id);
        return entity.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<T> create(@RequestBody T entity) {
        T savedEntity = mediator.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<T> update(@PathVariable Long id, @RequestBody T entity) {
        Optional<T> existingEntity = mediator.findById(id);
        
        if (existingEntity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        T updatedEntity = mediator.update(entity);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<T> entity = mediator.findById(id);
        System.out.println("Entity: " + entity);
        if (entity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        mediator.delete(entity.get());
        return ResponseEntity.noContent().build();
    }
}
