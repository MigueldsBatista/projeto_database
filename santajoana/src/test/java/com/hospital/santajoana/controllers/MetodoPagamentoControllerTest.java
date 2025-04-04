package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.santajoana.domain.entity.MetodoPagamento;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class MetodoPagamentoControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

@Test
void testGetAllMetodosPagamento() throws Exception {
        // Test GET all metodos pagamento
        
        mockMvc.perform(get("/api/metodos-pagamento"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(0)));
        
        var metodosPagamento = createDefaultMetodoPagamento();

        mockMvc.perform(get("/api/metodos-pagamento"))
                        .andExpect(status().isOk())
                        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                        .andExpect(jsonPath("$", hasSize(1)))
                        .andExpect(jsonPath("$[0].tipo").value(metodosPagamento.getTipo()));
}

@Test
void testCreateMetodoPagamento() throws Exception {
        // Create a test metodo pagamento
        MetodoPagamento testMetodoPagamento = new MetodoPagamento("Cartão de Crédito");

        // Test creating a metodo pagamento
        String metodoPagamentoJson = objectMapper.writeValueAsString(testMetodoPagamento);

        mockMvc.perform(post("/api/metodos-pagamento/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(metodoPagamentoJson))
                        .andExpect(status().isCreated())
                        .andExpect(content().contentType(MediaType.APPLICATION_JSON));
}

@Test
void testGetMetodoPagamentoById() throws Exception {
        // Test GET by ID
        var metodoPagamento = createDefaultMetodoPagamento();

        mockMvc.perform(get("/api/metodos-pagamento/{id}", metodoPagamento.getId()))
                        .andExpect(status().isOk())
                        .andExpect(content().contentType(MediaType.APPLICATION_JSON));
}
}
