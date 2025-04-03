package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.santajoana.domain.entity.Estadia;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.entity.Quarto;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class EstadiaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testEndpoints() throws Exception {
        // Test GET all estadias


// Create a test paciente for the other operations
        Paciente testPaciente = new Paciente(
            "João Silva", 
            "12345678900", 
            LocalDate.of(1980, 1, 1), 
            StatusPaciente.INTERNADO
        );

        // Test creating a paciente
        String pacienteJson = objectMapper.writeValueAsString(testPaciente);
        mockMvc.perform(post("/api/pacientes/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pacienteJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));


        mockMvc.perform(get("/api/estadias"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));


                        // Create a test quarto for the other operations
        Quarto testQuarto = new Quarto(101, "Enfermaria");

        // Test creating a quarto
        String quartoJson = objectMapper.writeValueAsString(testQuarto);
        mockMvc.perform(post("/api/quartos/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(quartoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        // Create a test estadia
        Estadia testEstadia = new Estadia(1L, 1L);

        // Test creating an estadia
        String estadiaJson = objectMapper.writeValueAsString(testEstadia);
        mockMvc.perform(post("/api/estadias/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(estadiaJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        // Test GET by ID
        mockMvc.perform(get("/api/estadias/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
