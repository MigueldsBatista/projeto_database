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
        fatura.setStatusPagamento(StatusPagamento.PENDENTE);
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
        var estadia = createDefaultEstadia();

        Fatura fatura = new Fatura(estadia.getId());
        
        // Test creating a fatura
        String faturaJson = objectMapper.writeValueAsString(fatura);

        mockMvc.perform(post("/api/faturas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(faturaJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.estadiaId").value(fatura.getEstadiaId()))
                .andExpect(jsonPath("$.dataEmissao").exists())
                .andExpect(jsonPath("$.statusPagamento").exists());
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
                .andExpect(jsonPath("$.dataEmissao").exists())
                .andExpect(jsonPath("$.dataPagamento").value(fatura.getDataPagamento() != null ? fatura.getDataPagamento().toString() : null))
                .andExpect(jsonPath("$.statusPagamento").value(fatura.getStatusPagamento().getDescricao()));
}

@Test
@Transactional
void testUpdateFatura() throws Exception {
        // Setup dependencies and create fatura - this also creates a MetodoPagamento
        Fatura fatura = createDefaultFatura();
        
        // Get the actual MetodoPagamento ID from the database record
        Long actualMetodoPagamentoId = fatura.getMetodoPagamentoId();
        System.out.println("Original MetodoPagamentoId: " + actualMetodoPagamentoId);
        
        // Update the fatura
        fatura.setStatusPagamento(StatusPagamento.PAGO);
        LocalDateTime paymentDate = LocalDateTime.now();
        fatura.setDataPagamento(paymentDate);
        
        // Make sure we keep the existing MetodoPagamentoId that worked during creation
        // The createDefaultFatura method already set this with a valid ID, so we shouldn't change it
        System.out.println("MetodoPagamentoId before JSON conversion: " + fatura.getMetodoPagamentoId());
        
        // Convert to JSON and log the serialized content for debugging
        String faturaJson = objectMapper.writeValueAsString(fatura);
        System.out.println("Serialized fatura JSON: " + faturaJson);
        
        // Verify the MetodoPagamentoId is included in the JSON
        Fatura deserializedFatura = objectMapper.readValue(faturaJson, Fatura.class);
        System.out.println("MetodoPagamentoId after deserialization: " + deserializedFatura.getMetodoPagamentoId());
        
        mockMvc.perform(put("/api/faturas/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(faturaJson))
                .andDo(result -> {
                    System.out.println("Update Response: " + result.getResponse().getContentAsString());
                })
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(fatura.getId()))
                .andExpect(jsonPath("$.statusPagamento").value("Pago"))
                .andExpect(jsonPath("$.dataPagamento").exists())
                .andExpect(jsonPath("$.valorTotal").value(fatura.getValorTotal().doubleValue()))
                .andExpect(jsonPath("$.metodoPagamentoId").value(fatura.getMetodoPagamentoId()));

        // Verify the update was persisted by getting the fatura again
        mockMvc.perform(get("/api/faturas/{id}", fatura.getId()))
                .andExpect(status().isOk())
                .andDo(result -> {
                    System.out.println("Get Response: " + result.getResponse().getContentAsString());
                })
                .andExpect(jsonPath("$.statusPagamento").value("Pago"))
                .andExpect(jsonPath("$.dataPagamento").exists())
                .andExpect(jsonPath("$.metodoPagamentoId").value(fatura.getMetodoPagamentoId()));
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
