package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

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
        
        // Create a test pedido
        var estadia = createDefaultEstadia();
        var camareira = createDefaultCamareira();
        
        Pedido pedido = new Pedido();
        pedido.setDataEntradaEstadia(estadia.getDataEntrada());
        pedido.setCamareiraId(camareira.getId());

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
        
        // Create a pedido
        Pedido pedido = createDefaultPedido();
        
        // Test GET by ID
        mockMvc.perform(get("/api/pedidos/{id}", pedido.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.dataEntradaEstadia").value(pedido.getDataEntradaEstadia().toString()))
                .andExpect(jsonPath("$.camareiraId").value(pedido.getCamareiraId()))
                .andExpect(jsonPath("$.status").value(pedido.getStatus().getDescricao()))
                .andExpect(jsonPath("$.dataPedido").exists());
    }
    
    @Test
    @Transactional
    void testUpdatePedido() throws Exception {

        Pedido pedido = createDefaultPedido();

        pedido.setStatus(StatusPedido.EM_PREPARO);

        String pedidoJson = objectMapper.writeValueAsString(pedido);
        
        mockMvc.perform(put("/api/pedidos/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pedidoJson))
                .andDo(result -> {
                    var response = result.getResponse().getContentAsString();
                    System.out.println("Response: " + response);
                })
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Em Preparo"));
    }

    @Test
    @Transactional
    void testDeletePedido() throws Exception {

        Pedido pedido = createDefaultPedido();

        // Test deleting pedido
        mockMvc.perform(delete("/api/pedidos/delete/{id}", pedido.getId()))
                .andExpect(status().isNoContent());
                
        // Verify it's deleted
        mockMvc.perform(get("/api/pedidos/{id}", pedido.getId()))
                .andExpect(status().isNotFound());
    }
}
