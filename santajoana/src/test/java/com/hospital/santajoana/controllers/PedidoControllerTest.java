package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.santajoana.domain.entity.Camareira;
import com.hospital.santajoana.domain.entity.Pedido;
import com.hospital.santajoana.domain.entity.Pedido.StatusPedido;

public class PedidoControllerTest extends BaseControllerTest {

    @Test
    @Transactional
    void testGetAllPedidos() throws Exception {
        // Test GET all pedidos - initially should be empty
        mockMvc.perform(get("/api/pedidos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
                
        // Create a pedido and verify list size increases
        createDefaultPedido();
        
        mockMvc.perform(get("/api/pedidos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)));
    }
    
    @Test
    @Transactional
    void testCreatePedido() throws Exception {
        // Create necessary dependencies first
        createDefaultEstadia();
        
        // Create a camareira
        Camareira camareira = new Camareira();
        camareira.setNome("Ana Souza");
        camareira.setCpf("98765432100");
        camareira.setCre("54321");
        camareira.setCargo("Camareira");
        camareira.setSetor("Limpeza");
        saveCamareiraEntity(camareira);

        // Create a test pedido
        Pedido pedido = new Pedido();
        pedido.setEstadiaId(1L);
        pedido.setCamareiraId(1L);
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setDataPedido(LocalDateTime.now());
        
        // Test creating a pedido
        String pedidoJson = objectMapper.writeValueAsString(pedido);
        mockMvc.perform(post("/api/pedidos/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pedidoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
    
    @Test
    @Transactional
    void testGetPedidoById() throws Exception {
        // Setup: Create camareira and estadia before creating pedido
        createDefaultEstadia();
        
        Camareira camareira = new Camareira();
        camareira.setNome("Ana Souza");
        camareira.setCpf("98765432100");
        camareira.setCre("54321");
        camareira.setCargo("Camareira");
        camareira.setSetor("Limpeza");
        saveCamareiraEntity(camareira);
        
        // Create a pedido
        Pedido pedido = new Pedido();
        pedido.setEstadiaId(1L);
        pedido.setCamareiraId(1L);
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setDataPedido(LocalDateTime.now());
        savePedidoEntity(pedido);
        
        // Test GET by ID
        mockMvc.perform(get("/api/pedidos/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.estadiaId").value(1))
                .andExpect(jsonPath("$.camareiraId").value(1))
                .andExpect(jsonPath("$.status").value("PENDENTE"));
    }
    
    @Test
    @Transactional
    void testUpdatePedido() throws Exception {
        // Setup: Create dependencies and pedido
        createDefaultEstadia();
        
        Camareira camareira = new Camareira();
        camareira.setNome("Ana Souza");
        camareira.setCpf("98765432100");
        camareira.setCre("54321");
        camareira.setCargo("Camareira");
        camareira.setSetor("Limpeza");
        saveCamareiraEntity(camareira);
        
        Pedido pedido = new Pedido();
        pedido.setEstadiaId(1L);
        pedido.setCamareiraId(1L);
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setDataPedido(LocalDateTime.now());
        savePedidoEntity(pedido);
        
        // Update the pedido
        pedido.setId(1L);
        pedido.setStatus(StatusPedido.EM_PREPARO);
        String pedidoJson = objectMapper.writeValueAsString(pedido);
        
        mockMvc.perform(put("/api/pedidos/update/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(pedidoJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("EM_PREPARO"));
    }
    
    @Test
    @Transactional
    void testDeletePedido() throws Exception {
        // Setup: Create dependencies and pedido
        createDefaultEstadia();
        
        Camareira camareira = new Camareira();
        camareira.setNome("Ana Souza");
        camareira.setCpf("98765432100");
        camareira.setCre("54321");
        camareira.setCargo("Camareira");
        camareira.setSetor("Limpeza");
        saveCamareiraEntity(camareira);
        
        Pedido pedido = new Pedido();
        pedido.setEstadiaId(1L);
        pedido.setCamareiraId(1L);
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setDataPedido(LocalDateTime.now());
        savePedidoEntity(pedido);
        
        // Test deleting pedido
        mockMvc.perform(delete("/api/pedidos/delete/{id}", 1L))
                .andExpect(status().isNoContent());
                
        // Verify it's deleted
        mockMvc.perform(get("/api/pedidos/{id}", 1L))
                .andExpect(status().isNotFound());
    }
}
