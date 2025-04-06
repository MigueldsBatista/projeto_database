package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.santajoana.domain.entity.CategoriaQuarto;
import com.hospital.santajoana.domain.entity.Quarto;

public class QuartoControllerTest extends BaseControllerTest {

    @Test
    @Transactional
    void testGetAllQuartos() throws Exception {
        // Test GET all quartos - initially should be empty
        mockMvc.perform(get("/api/quartos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
                
        // Create a quarto and verify list size increases
        createDefaultQuarto();
        
        mockMvc.perform(get("/api/quartos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)));
    }
    
    @Test
    @Transactional
    void testCreateQuarto() throws Exception {
        // Create a test quarto

        CategoriaQuarto categoria = createDefaultCategoriaQuarto();

        Quarto quarto = new Quarto(101, categoria.getId());
        
        // Test creating a quarto
        String quartoJson = objectMapper.writeValueAsString(quarto);
        mockMvc.perform(post("/api/quartos/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(quartoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
    
    @Test
    @Transactional
    void testGetQuartoById() throws Exception {
        // Create a quarto first

        CategoriaQuarto categoria = createDefaultCategoriaQuarto();

        var quarto = createDefaultQuarto();
        
        // Test GET by ID
        mockMvc.perform(get("/api/quartos/{id}", quarto.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.numero").value(101))
                .andExpect(jsonPath("$.categoriaId").value(categoria.getId()));
    }
    
    @Test
    @Transactional
    void testUpdateQuarto() throws Exception {
        // Create a quarto first
        var quarto = createDefaultQuarto();

        CategoriaQuarto categoria = createDefaultCategoriaQuarto(); 

        quarto.setNumero(102);
        quarto.setCategoriaId(categoria.getId());
        // Update the quarto
        String quartoJson = objectMapper.writeValueAsString(quarto);
        
        mockMvc.perform(put("/api/quartos/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(quartoJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numero").value(102))
                .andExpect(jsonPath("$.categoriaId").value(categoria.getId()));
    }
    
    @Test
    @Transactional
    void testDeleteQuarto() throws Exception {
        // Create a quarto first
        var quarto = createDefaultQuarto();
        
        // Test deleting quarto
        mockMvc.perform(delete("/api/quartos/delete/{id}", quarto.getId()))
                .andExpect(status().isNoContent());
                
        // Verify it's deleted
        mockMvc.perform(get("/api/quartos/{id}", quarto.getId()))
                .andExpect(status().isNotFound());
    }
}
