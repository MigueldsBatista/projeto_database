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
        createDefaultEstadia();
        jdbcTemplate.execute("INSERT INTO metodo_pagamento (id, descricao) VALUES (1, 'Cartão de Crédito')");
        
        Fatura fatura = new Fatura();
        fatura.setEstadiaId(1L);
        fatura.setValorTotal(new BigDecimal("1500.00"));
        fatura.setStatusPagamento(StatusPagamento.Pendente);
        fatura.setMetodoPagamentoId(1L);
        fatura.setDataEmissao(LocalDateTime.now());
        saveFaturaEntity(fatura);
        
        // Verify list size increases
        mockMvc.perform(get("/api/faturas"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)));
    }
    
    @Test
    @Transactional
    void testCreateFatura() throws Exception {
        // Setup dependencies
        createDefaultEstadia();
        jdbcTemplate.execute("INSERT INTO metodo_pagamento (id, descricao) VALUES (1, 'Cartão de Crédito')");

        // Create a test fatura
        Fatura fatura = new Fatura();
        fatura.setEstadiaId(1L);
        fatura.setValorTotal(new BigDecimal("1500.00"));
        fatura.setStatusPagamento(StatusPagamento.Pendente);
        fatura.setMetodoPagamentoId(1L);
        fatura.setDataEmissao(LocalDateTime.now());
        
        // Test creating a fatura
        String faturaJson = objectMapper.writeValueAsString(fatura);
        mockMvc.perform(post("/api/faturas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(faturaJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
    
    @Test
    @Transactional
    void testGetFaturaById() throws Exception {
        // Setup dependencies and create fatura
        createDefaultEstadia();
        jdbcTemplate.execute("INSERT INTO metodo_pagamento (id, descricao) VALUES (1, 'Cartão de Crédito')");
        
        Fatura fatura = new Fatura();
        fatura.setEstadiaId(1L);
        fatura.setValorTotal(new BigDecimal("1500.00"));
        fatura.setStatusPagamento(StatusPagamento.Pendente);
        fatura.setMetodoPagamentoId(1L);
        fatura.setDataEmissao(LocalDateTime.now());
        saveFaturaEntity(fatura);
        
        // Test GET by ID
        mockMvc.perform(get("/api/faturas/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.estadiaId").value(1))
                .andExpect(jsonPath("$.valorTotal").value(1500.00))
                .andExpect(jsonPath("$.statusPagamento").value("Pendente"));
    }
    
    @Test
    @Transactional
    void testUpdateFatura() throws Exception {
        // Setup dependencies and create fatura
        createDefaultEstadia();
        jdbcTemplate.execute("INSERT INTO metodo_pagamento (id, descricao) VALUES (1, 'Cartão de Crédito')");
        
        Fatura fatura = new Fatura();
        fatura.setEstadiaId(1L);
        fatura.setValorTotal(new BigDecimal("1500.00"));
        fatura.setStatusPagamento(StatusPagamento.Pendente);
        fatura.setMetodoPagamentoId(1L);
        fatura.setDataEmissao(LocalDateTime.now());
        saveFaturaEntity(fatura);
        
        // Update the fatura
        fatura.setId(1L);
        fatura.setStatusPagamento(StatusPagamento.Pago);
        fatura.setDataPagamento(LocalDateTime.now());
        String faturaJson = objectMapper.writeValueAsString(fatura);
        
        mockMvc.perform(put("/api/faturas/update/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(faturaJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusPagamento").value("Pago"));
    }
    
    @Test
    @Transactional
    void testDeleteFatura() throws Exception {
        // Setup dependencies and create fatura
        createDefaultEstadia();
        jdbcTemplate.execute("INSERT INTO metodo_pagamento (id, descricao) VALUES (1, 'Cartão de Crédito')");
        
        Fatura fatura = new Fatura();
        fatura.setEstadiaId(1L);
        fatura.setValorTotal(new BigDecimal("1500.00"));
        fatura.setStatusPagamento(StatusPagamento.Pendente);
        fatura.setMetodoPagamentoId(1L);
        fatura.setDataEmissao(LocalDateTime.now());
        saveFaturaEntity(fatura);
        
        // Test deleting fatura
        mockMvc.perform(delete("/api/faturas/delete/{id}", 1L))
                .andExpect(status().isNoContent());
                
        // Verify it's deleted
        mockMvc.perform(get("/api/faturas/{id}", 1L))
                .andExpect(status().isNotFound());
    }
}
