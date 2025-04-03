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
import com.hospital.santajoana.domain.entity.Camareira;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class CamareiraControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testEndpoints() throws Exception {
        // Test GET all camareiras
        mockMvc.perform(get("/api/camareiras"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        // Create a test camareira
        Camareira testCamareira = new Camareira(
            "12345678900", 
            "Maria Silva", 
            LocalDate.of(1985, 3, 15),
            "11999999999",
            "Rua das Flores, 123",
            "CRE123456",
            "Camareira",
            "Ala A"
        );

        // Test creating a camareira
        String camareiraJson = objectMapper.writeValueAsString(testCamareira);
        mockMvc.perform(post("/api/camareiras/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(camareiraJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        // Test GET by ID
        mockMvc.perform(get("/api/camareiras/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
