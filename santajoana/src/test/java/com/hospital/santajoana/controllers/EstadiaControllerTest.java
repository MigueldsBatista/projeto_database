package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.santajoana.domain.entity.Estadia;


public class EstadiaControllerTest extends BaseControllerTest {

    @Test
    @Transactional
    void testGetAllEstadias() throws Exception {
        // Test GET all estadias - initially should be empty
        mockMvc.perform(get("/api/estadias"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
                
        // Create an estadia and verify list size increases
        createDefaultEstadia();
        
        mockMvc.perform(get("/api/estadias"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)));
    }
    
    @Test
    @Transactional
    void testCreateEstadia() throws Exception {
        // Create a paciente and quarto first
        var paciente = createDefaultPaciente();
        var quarto = createDefaultQuarto();

        // Create a test estadia using the created entities
        Estadia estadia = new Estadia(paciente.getId(), quarto.getId());
        
        // Test creating an estadia
        String estadiaJson = objectMapper.writeValueAsString(estadia);
        mockMvc.perform(post("/api/estadias/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(estadiaJson))
                .andExpect(status().isCreated())  // Changed from isCreated to isOk to match controller response
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
    
    @Test
    @Transactional
    void testGetEstadiaById() throws Exception {
        // Create an estadia first
        var estadia = createDefaultEstadia();
        
        // Test GET by ID
        mockMvc.perform(get("/api/estadias/{id}", estadia.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.pacienteId").value(estadia.getPacienteId()))
                .andExpect(jsonPath("$.quartoId").value(estadia.getQuartoId()));
    }
    
    @Test
    @Transactional
    void testUpdateEstadia() throws Exception {
        // Create an estadia first
        Estadia estadia = createDefaultEstadia();
        
        // Update the estadia with a checkout date
        LocalDateTime now = LocalDateTime.now().truncatedTo(java.time.temporal.ChronoUnit.MICROS);
        estadia.setDataSaida(now);
        String estadiaJson = objectMapper.writeValueAsString(estadia);
        
        mockMvc.perform(put("/api/estadias/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(estadiaJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dataSaida").value(now.toString()));
    }
    
    @Test
    @Transactional
    void testDeleteEstadia() throws Exception {
        // Create an estadia first
        Estadia estadia = createDefaultEstadia();
        
        // Test deleting estadia
        mockMvc.perform(delete("/api/estadias/delete/{id}", estadia.getId()))
                .andExpect(status().isNoContent());
                
        // Verify it's deleted
        mockMvc.perform(get("/api/estadias/{id}", estadia.getId()))
                .andExpect(status().isNotFound());
    }
}
