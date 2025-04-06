package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.santajoana.domain.entity.Camareira;

public class CamareiraControllerTest extends BaseControllerTest {

    @Test
    @Transactional
    void testGetAllCamareiras() throws Exception {
        // Test GET all camareiras - initially should be empty
        mockMvc.perform(get("/api/camareiras"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
                
        // Create a test camareira and verify list size increases
        createDefaultCamareira();
        
        mockMvc.perform(get("/api/camareiras"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)));
    }
    
    @Test
    @Transactional
    void testCreateCamareira() throws Exception {
        // Create a test camareira
        Camareira camareira = new Camareira();
        camareira.setNome("Ana Silva");
        camareira.setCpf("98765432100");
        camareira.setCre("54321");
        camareira.setCargo("Camareira");
        camareira.setSetor("Limpeza");
        camareira.setDataNascimento(LocalDate.parse("1990-01-01"));
        
        // Test creating a camareira
        String camareiraJson = objectMapper.writeValueAsString(camareira);
        mockMvc.perform(post("/api/camareiras/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(camareiraJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
    
    @Test
    @Transactional
    void testGetCamareiraById() throws Exception {
        // Create a camareira first
        Camareira camareira = createDefaultCamareira();
        
        // Test GET by ID
        mockMvc.perform(get("/api/camareiras/{id}", camareira.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.nome").value(camareira.getNome()))
                .andExpect(jsonPath("$.cre").value(camareira.getCre()))
                .andExpect(jsonPath("$.setor").value(camareira.getSetor()))
                .andExpect(jsonPath("$.dataNascimento").value(camareira.getDataNascimento().toString()))
                .andExpect(jsonPath("$.id").value(camareira.getId()));
    }
    
    @Test
    @Transactional
    void testUpdateCamareira() throws Exception {
        // Create a camareira first
        Camareira camareira = createDefaultCamareira();
        
        mockMvc.perform(get("/api/camareiras/{id}", camareira.getId()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.nome").value(camareira.getNome()))
        .andExpect(jsonPath("$.cre").value(camareira.getCre()))
        .andExpect(jsonPath("$.setor").value(camareira.getSetor()))
        .andExpect(jsonPath("$.dataNascimento").value(camareira.getDataNascimento().toString()))
        .andExpect(jsonPath("$.id").value(camareira.getId()));


        camareira.setSetor("Hospitalidade");
        camareira.setCargo("Camareira Sênior");
        camareira.setDataNascimento(LocalDate.parse("1985-05-15"));
        camareira.setNome("Maria Oliveira dos Anjos");

        String camareiraJson = objectMapper.writeValueAsString(camareira);
        
        mockMvc.perform(put("/api/camareiras/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(camareiraJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.setor").value(camareira.getSetor()))
                .andExpect(jsonPath("$.cargo").value(camareira.getCargo()))
                .andExpect(jsonPath("$.dataNascimento").value(camareira.getDataNascimento().toString()))
                .andExpect(jsonPath("$.nome").value(camareira.getNome()))
                .andExpect(jsonPath("$.id").value(camareira.getId()));
    }
    
    @Test
    @Transactional
    void testDeleteCamareira() throws Exception {
        // Create a camareira first
        var camareira = createDefaultCamareira();
        
        // Test deleting camareira
        mockMvc.perform(delete("/api/camareiras/delete/{id}", camareira.getId()))
                .andExpect(status().isNoContent());
                
        // Verify it's deleted
        mockMvc.perform(get("/api/camareiras/{id}", camareira.getId()))
                .andExpect(status().isNotFound());
    }
}
