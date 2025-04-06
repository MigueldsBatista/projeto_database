package com.hospital.santajoana;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.entity.Pedido.StatusPedido;

@SpringBootTest
public class EnumSerializationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testEnumSerialization() throws JsonProcessingException {
        // Test Paciente.StatusPaciente serialization
        assertEquals("\"Internado\"", objectMapper.writeValueAsString(StatusPaciente.INTERNADO));
        
        // Test Pedido.StatusPedido serialization
        assertEquals("\"Em Preparo\"", objectMapper.writeValueAsString(StatusPedido.EM_PREPARO));
        
        // Test Produto.CategoriaProduto serialization
        
        // Debug print
        System.out.println("StatusPaciente.INTERNADO serializes to: " + 
                objectMapper.writeValueAsString(StatusPaciente.INTERNADO));
        System.out.println("StatusPedido.EM_PREPARO serializes to: " + 
                objectMapper.writeValueAsString(StatusPedido.EM_PREPARO));
    }

    @Test
    public void testEnumDeserialization() throws JsonProcessingException {
        // Test Paciente.StatusPaciente deserialization
        assertEquals(StatusPaciente.INTERNADO, 
                objectMapper.readValue("\"Internado\"", StatusPaciente.class));
        
        // Test Pedido.StatusPedido deserialization
        assertEquals(StatusPedido.EM_PREPARO, 
                objectMapper.readValue("\"Em Preparo\"", StatusPedido.class));
        
        // Test Produto.CategoriaProduto deserialization
    }
}
