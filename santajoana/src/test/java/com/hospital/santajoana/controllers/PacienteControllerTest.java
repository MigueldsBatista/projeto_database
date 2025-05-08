package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;

public class PacienteControllerTest extends BaseControllerTest {

    @Test
    @Transactional
    void testGetAllPacientes() throws Exception {
        // Test GET all pacientes - initially should be empty
        mockMvc.perform(get("/api/pacientes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
                
        // Create a paciente and verify list size increases
        createDefaultPaciente();
        
        mockMvc.perform(get("/api/pacientes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)));
    }
    
    @Test
    @Transactional
    void testCreatePaciente() throws Exception {
        // Create a test paciente
        Paciente paciente = new Paciente();
        paciente.setNome("João Silva");
        paciente.setCpf("12345678900");
        paciente.setEmail("joaosilva@gmail.com");
        paciente.setDataNascimento(LocalDate.parse("1985-05-15"));
        paciente.setTelefone("11987654321");
        paciente.setSenha("senha123");
        paciente.setEndereco("Rua das Flores, 123");
        paciente.setStatus(StatusPaciente.INTERNADO);
        // Test creating a paciente
        String pacienteJson = objectMapper.writeValueAsString(paciente);
        mockMvc.perform(post("/api/pacientes/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pacienteJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
    
    @Test
    @Transactional
    void testGetPacienteById() throws Exception {
        // Create a paciente first
        Paciente createdPaciente = createDefaultPaciente();
        
        // Test GET by ID
        mockMvc.perform(get("/api/pacientes/{id}", createdPaciente.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.nome").value("João Silva"))
                .andExpect(jsonPath("$.cpf").value("12345678900"))
                .andExpect(jsonPath("$.status").value("Internado"));
    }
    
    @Test
    @Transactional
    void testUpdatePaciente() throws Exception {
        // Create a paciente first
        Paciente createdPaciente = createDefaultPaciente();
        
        // Update the paciente
        createdPaciente.setStatus(StatusPaciente.ALTA);
        String pacienteJson = objectMapper.writeValueAsString(createdPaciente);
        
        mockMvc.perform(put("/api/pacientes/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pacienteJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Alta"));
    }
    
    @Test
    @Transactional
    void testDeletePaciente() throws Exception {
        // Create a paciente first
        Paciente createdPaciente = createDefaultPaciente();
        
        // Test deleting paciente
        mockMvc.perform(delete("/api/pacientes/delete/{id}", createdPaciente.getId()))
                .andExpect(status().isNoContent());
                
        // Verify it's deleted
        mockMvc.perform(get("/api/pacientes/{id}", createdPaciente.getId()))
                .andExpect(status().isNotFound());
    }
}
