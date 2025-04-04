package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
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
        Camareira camareira = new Camareira();
        camareira.setNome("Maria Silva");
        camareira.setCpf("12345678900");
        camareira.setCre("12345");
        camareira.setCargo("Camareira");
        camareira.setSetor("Limpeza");
        
        saveCamareiraEntity(camareira);
        
        // Test GET by ID
        mockMvc.perform(get("/api/camareiras/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.nome").value("Maria Silva"))
                .andExpect(jsonPath("$.cpf").value("12345678900"))
                .andExpect(jsonPath("$.cargo").value("Camareira"));
    }
    
    @Test
    @Transactional
    void testUpdateCamareira() throws Exception {
        // Create a camareira first
        Camareira camareira = new Camareira();
        camareira.setNome("Maria Silva");
        camareira.setCpf("12345678900");
        camareira.setCre("12345");
        camareira.setCargo("Camareira");
        camareira.setSetor("Limpeza");
        
        saveCamareiraEntity(camareira);
        
        // Update the camareira
        camareira.setId(1L);
        camareira.setSetor("Hospitalidade");
        String camareiraJson = objectMapper.writeValueAsString(camareira);
        
        mockMvc.perform(put("/api/camareiras/update/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(camareiraJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.setor").value("Hospitalidade"));
    }
    
    @Test
    @Transactional
    void testDeleteCamareira() throws Exception {
        // Create a camareira first
        createDefaultCamareira();
        
        // Test deleting camareira
        mockMvc.perform(delete("/api/camareiras/delete/{id}", 1L))
                .andExpect(status().isNoContent());
                
        // Verify it's deleted
        mockMvc.perform(get("/api/camareiras/{id}", 1L))
                .andExpect(status().isNotFound());
    }
}
