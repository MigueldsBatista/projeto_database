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
                // Test StatusPaciente serialization to JSON
                String statusPacienteJson = objectMapper.writeValueAsString(StatusPaciente.INTERNADO);
                assertEquals("\"Internado\"", statusPacienteJson);
                
                // Test StatusPedido serialization to JSON
                String statusPedidoJson = objectMapper.writeValueAsString(StatusPedido.EM_PREPARO);
                assertEquals("\"Em Preparo\"", statusPedidoJson);
                
                // Debug print
                System.out.println("StatusPaciente.INTERNADO as JSON: " + statusPacienteJson);
                System.out.println("StatusPedido.EM_PREPARO as JSON: " + statusPedidoJson);
        }

        @Test
        public void testEnumDeserialization() throws JsonProcessingException {
                // Deserialize JSON to StatusPaciente
                StatusPaciente statusPaciente = objectMapper.readValue("\"Internado\"", StatusPaciente.class);
                assertEquals(StatusPaciente.INTERNADO, statusPaciente);
                
                // Deserialize JSON to StatusPedido
                StatusPedido statusPedido1 = objectMapper.readValue("\"Em Preparo\"", StatusPedido.class);
                assertEquals(StatusPedido.EM_PREPARO, statusPedido1);
                
                StatusPedido statusPedido2 = objectMapper.readValue("\"Entregue\"", StatusPedido.class);
                assertEquals(StatusPedido.ENTREGUE, statusPedido2);
        }
        
        @Test
        public void testComplexObjectWithEnums() throws JsonProcessingException {
                // Create test objects with enums
                TestObject testObject = new TestObject();
                testObject.setPacienteStatus(StatusPaciente.INTERNADO);
                testObject.setPedidoStatus(StatusPedido.EM_PREPARO);
                
                // Serialize to JSON
                String json = objectMapper.writeValueAsString(testObject);
                System.out.println("Complex object as JSON: " + json);
                
                // Deserialize from JSON
                TestObject deserializedObject = objectMapper.readValue(json, TestObject.class);
                
                // Verify deserialization worked correctly
                assertEquals(StatusPaciente.INTERNADO, deserializedObject.getPacienteStatus());
                assertEquals(StatusPedido.EM_PREPARO, deserializedObject.getPedidoStatus());
        }
        
        // Inner class for testing complex objects with enums
        static class TestObject {
                private StatusPaciente pacienteStatus;
                private StatusPedido pedidoStatus;
                
                public StatusPaciente getPacienteStatus() {
                        return pacienteStatus;
                }
                
                public void setPacienteStatus(StatusPaciente pacienteStatus) {
                        this.pacienteStatus = pacienteStatus;
                }
                
                public StatusPedido getPedidoStatus() {
                        return pedidoStatus;
                }
                
                public void setPedidoStatus(StatusPedido pedidoStatus) {
                        this.pedidoStatus = pedidoStatus;
                }
        }
}
