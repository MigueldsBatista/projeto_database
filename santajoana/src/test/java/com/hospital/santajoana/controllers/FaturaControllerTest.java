package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.santajoana.domain.entity.Fatura;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;

public class FaturaControllerTest extends BaseControllerTest {

    @Test
    @Transactional
    void testGetAllFaturas() throws Exception {
        // Test GET all faturas - initially should be empty
        mockMvc.perform(get("/api/faturas"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
                
        // Setup and create a fatura
        var estadia = createDefaultEstadia();
        var metodoPagamento = createDefaultMetodoPagamento();

        Fatura fatura = new Fatura();
        fatura.setStatusPagamento(StatusPagamento.Pendente);
        fatura.setEstadiaId(estadia.getId());
        fatura.setValorTotal(new BigDecimal("1500.00"));
        fatura.setMetodoPagamentoId(metodoPagamento.getId());
        
        mockMvc.perform(post("/api/faturas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(fatura)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
        
        // Verify list size increases
        mockMvc.perform(get("/api/faturas"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)));
    }
    
    @Test
    @Transactional
    void testCreateFatura() throws Exception {

        // Create a test fatura
        Fatura fatura = createDefaultFatura();
        
        // Test creating a fatura
        String faturaJson = objectMapper.writeValueAsString(fatura);
        mockMvc.perform(post("/api/faturas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(faturaJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.estadiaId").value(fatura.getEstadiaId()))
                .andExpect(jsonPath("$.valorTotal").value(fatura.getValorTotal().doubleValue()))
                .andExpect(jsonPath("$.metodoPagamentoId").value(fatura.getMetodoPagamentoId()))
                .andExpect(jsonPath("$.dataEmissao").value(fatura.getDataEmissao().toString()))
                .andExpect(jsonPath("$.dataPagamento").value(fatura.getDataPagamento() != null ? fatura.getDataPagamento().toString() : null))
                .andExpect(jsonPath("$.statusPagamento").value(fatura.getStatusPagamento().toString()));
    }
    
    @Test
    @Transactional
    void testGetFaturaById() throws Exception {
        // Setup dependencies and create fatura
        
        Fatura fatura = createDefaultFatura();
        
        // Test GET by ID
        mockMvc.perform(get("/api/faturas/{id}", fatura.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.estadiaId").value(fatura.getEstadiaId()))
                .andExpect(jsonPath("$.valorTotal").value(fatura.getValorTotal().doubleValue()))
                .andExpect(jsonPath("$.metodoPagamentoId").value(fatura.getMetodoPagamentoId()))
                .andExpect(jsonPath("$.dataEmissao").value(fatura.getDataEmissao().toString()))
                .andExpect(jsonPath("$.dataPagamento").value(fatura.getDataPagamento() != null ? fatura.getDataPagamento().toString() : null))
                .andExpect(jsonPath("$.statusPagamento").value(fatura.getStatusPagamento().toString()));
}

@Test
@Transactional
void testUpdateFatura() throws Exception {
        // Setup dependencies and create fatura
        Fatura fatura = createDefaultFatura();
        
        // Update the fatura
        fatura.setStatusPagamento(StatusPagamento.Pago);
        fatura.setDataPagamento(LocalDateTime.now());
        String faturaJson = objectMapper.writeValueAsString(fatura);
        
        mockMvc.perform(put("/api/faturas/update/{id}", fatura.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(faturaJson))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.statusPagamento").value("Pago"));
}

@Test
@Transactional
void testDeleteFatura() throws Exception {
        // Setup dependencies and create fatura
        Fatura fatura = createDefaultFatura();
        
        // Test deleting fatura
        mockMvc.perform(delete("/api/faturas/delete/{id}", fatura.getId()))
                        .andExpect(status().isNoContent());
                        
        // Verify it's deleted
        mockMvc.perform(get("/api/faturas/{id}", fatura.getId()))
                        .andExpect(status().isNotFound());
}
}
