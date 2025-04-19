package com.hospital.santajoana;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.santajoana.controllers.BaseControllerTest;
import com.hospital.santajoana.domain.entity.Camareira;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;

@SpringBootTest
@AutoConfigureMockMvc
public class OptionalProfilePictureTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @Transactional
    public void testCreatePacienteWithoutProfilePicture() throws Exception {
        // Create a paciente with null profile picture
        Paciente paciente = new Paciente(
            "Test Patient", 
            "98765432100", 
            LocalDate.of(1990, 5, 15), 
            StatusPaciente.INTERNADO
        );
        paciente.setEmail("test.patient@example.com");
        paciente.setSenha("password123");
        // Explicitly set null profile picture
        paciente.setFotoPerfilBase64(null);
        
        // Make the request to create the paciente
        String pacienteJson = objectMapper.writeValueAsString(paciente);
        String response = mockMvc.perform(post("/api/pacientes/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pacienteJson))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        // Deserialize response and check profile picture is null
        Paciente createdPaciente = objectMapper.readValue(response, Paciente.class);
        assertNull(createdPaciente.getFotoPerfilBase64(), "Profile picture should be null");
        
        // Now fetch the paciente by ID to verify null profile picture was saved correctly
        mockMvc.perform(get("/api/pacientes/{id}", createdPaciente.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fotoPerfilBase64").doesNotExist());
    }
    
    @Test
    @Transactional
    public void testCreateCamareiraWithoutProfilePicture() throws Exception {
        // Create a camareira with null profile picture
        Camareira camareira = new Camareira();
        camareira.setNome("Test Camareira");
        camareira.setCargo("Test Cargo");
        camareira.setCpf("98765432100");
        camareira.setCre("CRE123456");
        camareira.setSetor("Test Setor");
        camareira.setDataNascimento(LocalDate.of(1985, 3, 20));
        camareira.setEmail("test.camareira@example.com");
        camareira.setSenha("password123");
        // Explicitly set null profile picture
        camareira.setFotoPerfilBase64(null);
        
        // Make the request to create the camareira
        String camareiraJson = objectMapper.writeValueAsString(camareira);
        String response = mockMvc.perform(post("/api/camareiras/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(camareiraJson))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        // Deserialize response and check profile picture is null
        Camareira createdCamareira = objectMapper.readValue(response, Camareira.class);
        assertNull(createdCamareira.getFotoPerfilBase64(), "Profile picture should be null");
        
        // Now fetch the camareira by ID to verify null profile picture was saved correctly
        mockMvc.perform(get("/api/camareiras/{id}", createdCamareira.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fotoPerfilBase64").doesNotExist());
    }
    
    @Test
    @Transactional
    public void testUpdatePacienteWithProfilePicture() throws Exception {
        // First create a paciente without profile picture
        Paciente paciente = createDefaultPaciente();
        assertNull(paciente.getFotoPerfilBase64());
        
        // Now update with a profile picture
        String profilePic = "base64encodedpicture";
        paciente.setFotoPerfilBase64(profilePic);
        
        // Make the update request
        String pacienteJson = objectMapper.writeValueAsString(paciente);
        String response = mockMvc.perform(put("/api/pacientes/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pacienteJson))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        // Verify profile picture was updated
        Paciente updatedPaciente = objectMapper.readValue(response, Paciente.class);
        assertEquals(profilePic, updatedPaciente.getFotoPerfilBase64());
    }
    
    @Test
    @Transactional
    public void testUpdateCamareiraWithProfilePicture() throws Exception {
        // First create a camareira without profile picture
        Camareira camareira = createDefaultCamareira();
        assertNull(camareira.getFotoPerfilBase64());
        
        // Now update with a profile picture
        String profilePic = "base64encodedpicture";
        camareira.setFotoPerfilBase64(profilePic);
        
        // Make the update request
        String camareiraJson = objectMapper.writeValueAsString(camareira);
        String response = mockMvc.perform(put("/api/camareiras/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(camareiraJson))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        // Verify profile picture was updated
        Camareira updatedCamareira = objectMapper.readValue(response, Camareira.class);
        assertEquals(profilePic, updatedCamareira.getFotoPerfilBase64());
    }
}
