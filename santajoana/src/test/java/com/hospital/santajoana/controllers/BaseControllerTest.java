package com.hospital.santajoana.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.santajoana.domain.entity.*;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.entity.Pedido.StatusPedido;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
@AutoConfigureMockMvc
public abstract class BaseControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;
    
    @Autowired
    protected JdbcTemplate jdbcTemplate;
    
    @BeforeEach
    public void setUp() {
        // Setup code if needed
    }
    
    @AfterEach
    public void cleanup() {
        // Clean up all tables after each test
        // Using H2-compatible syntax to disable and enable referential integrity
        try {
            // Disable referential integrity constraints
            jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
            
            // Truncate all tables
            jdbcTemplate.execute("TRUNCATE TABLE fatura");
            jdbcTemplate.execute("TRUNCATE TABLE pedido");
            jdbcTemplate.execute("TRUNCATE TABLE estadia");
            jdbcTemplate.execute("TRUNCATE TABLE paciente");
            jdbcTemplate.execute("TRUNCATE TABLE quarto");
            jdbcTemplate.execute("TRUNCATE TABLE camareira");
            jdbcTemplate.execute("TRUNCATE TABLE metodo_pagamento");
            
            // Re-enable referential integrity constraints
            jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");
        } catch (Exception e) {
            // If H2-specific commands fail, try a more database-agnostic approach
            // This is a fallback for other databases that might be used in different environments
            try {
                // Delete from tables in reverse order of dependencies
                jdbcTemplate.execute("DELETE FROM fatura");
                jdbcTemplate.execute("DELETE FROM pedido");
                jdbcTemplate.execute("DELETE FROM estadia");
                jdbcTemplate.execute("DELETE FROM paciente");
                jdbcTemplate.execute("DELETE FROM quarto");
                jdbcTemplate.execute("DELETE FROM camareira");
                jdbcTemplate.execute("DELETE FROM metodo_pagamento");
            } catch (Exception ex) {
                // Log the exception if both approaches fail
                System.err.println("Failed to clean up test database: " + ex.getMessage());
            }
        }
    }
    
    // Helper methods to create entities
    protected ResultActions savePacienteEntity(Paciente paciente) throws Exception {
        String pacienteJson = objectMapper.writeValueAsString(paciente);
        return mockMvc.perform(post("/api/pacientes/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pacienteJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Paciente created: " + result.getResponse().getContentAsString());
                });
    }
    
    
    protected Paciente createDefaultPaciente() throws Exception {
        Paciente paciente = new Paciente(
            "João Silva", 
            "12345678900", 
            LocalDate.of(1980, 1, 1), 
            StatusPaciente.INTERNADO
        );
        String responseJson = savePacienteEntity(paciente)
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readValue(responseJson, Paciente.class);
    }
    
    protected ResultActions saveQuartoEntity(Quarto quarto) throws Exception {
        String quartoJson = objectMapper.writeValueAsString(quarto);
        return mockMvc.perform(post("/api/quartos/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(quartoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Quarto created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Quarto createDefaultQuarto() throws Exception {
        Quarto quarto = new Quarto(101, "Enfermaria");
        String quartoJson = saveQuartoEntity(quarto)
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readValue(quartoJson, Quarto.class);
    }
    
    protected ResultActions saveEstadiaEntity(Estadia estadia) throws Exception {
        String estadiaJson = objectMapper.writeValueAsString(estadia);
        return mockMvc.perform(post("/api/estadias/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(estadiaJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Estadia created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Estadia createDefaultEstadia() throws Exception {
        // First ensure we have a paciente and quarto
        var paciente = createDefaultPaciente();
        var quarto = createDefaultQuarto();
        
        // Create the estadia with IDs 1 since they should be the first records
        Estadia estadia = new Estadia(paciente.getId(), quarto.getId());
        String estadiaJson = saveEstadiaEntity(estadia)
            .andReturn()
            .getResponse()
            .getContentAsString();

        return objectMapper.readValue(estadiaJson, Estadia.class);
    }
    
    protected ResultActions savePedidoEntity(Pedido pedido) throws Exception {
        String pedidoJson = objectMapper.writeValueAsString(pedido);
        return mockMvc.perform(post("/api/pedidos/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pedidoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Pedido created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Pedido createDefaultPedido() throws Exception {
        // First ensure we have an estadia
        createDefaultEstadia();
        
        Pedido pedido = new Pedido();
        pedido.setEstadiaId(1L);
        pedido.setCamareiraId(1L); // Assuming we have a camareira with ID 1
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setDataPedido(LocalDateTime.now());
        
        savePedidoEntity(pedido);
        return pedido;
    }
    
    protected ResultActions saveFaturaEntity(Fatura fatura) throws Exception {
        String faturaJson = objectMapper.writeValueAsString(fatura);
        return mockMvc.perform(post("/api/faturas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(faturaJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Fatura created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Fatura createDefaultFatura() throws Exception {
        // First ensure we have an estadia
        createDefaultEstadia();
        
        Fatura fatura = new Fatura();
        fatura.setEstadiaId(1L);
        fatura.setValorTotal(new BigDecimal("1000.00"));
        fatura.setStatusPagamento(StatusPagamento.Pendente);
        fatura.setMetodoPagamentoId(1L); // Assuming we have a metodo_pagamento with ID 1
        fatura.setDataEmissao(LocalDateTime.now());
        
        saveFaturaEntity(fatura);
        return fatura;
    }
    
    protected ResultActions saveCamareiraEntity(Camareira camareira) throws Exception {
        String camareiraJson = objectMapper.writeValueAsString(camareira);
        return mockMvc.perform(post("/api/camareiras/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(camareiraJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Camareira created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Camareira createDefaultCamareira() throws Exception {
        Camareira camareira = new Camareira();
        camareira.setNome("Maria Silva");
        camareira.setCargo("Camareira");
        camareira.setCpf("12345678900");
        camareira.setCre("123456789");
        camareira.setSetor("Limpeza");
        
        saveCamareiraEntity(camareira);
        return camareira;
    }
}
