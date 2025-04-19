package com.hospital.santajoana.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.santajoana.domain.entity.Camareira;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.rest.controller.AuthenticationController.AuthRequest;

public class AuthenticationControllerTest extends BaseControllerTest {

    @Test
    @Transactional
    void testAuthenticatePaciente_Success() throws Exception {
        // Create a paciente with known credentials
        Paciente paciente = new Paciente(
            "Auth Paciente", 
            "97531246800", 
            LocalDate.of(1985, 5, 15), 
            StatusPaciente.INTERNADO
        );
        paciente.setEmail("auth.paciente@example.com");
        paciente.setSenha("senha123");
        
        // Save the paciente to the database
        savePacienteEntity(paciente);
        
        // Create auth request
        AuthRequest request = new AuthRequest("auth.paciente@example.com", "senha123");
        String requestJson = objectMapper.writeValueAsString(request);
        
        // Perform authentication
        mockMvc.perform(post("/api/auth/pacientes/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.name").value("Auth Paciente"))
                .andExpect(jsonPath("$.role").value("paciente"))
                .andExpect(jsonPath("$.email").value("auth.paciente@example.com"));
    }
    
    @Test
    @Transactional
    void testAuthenticatePaciente_Failure() throws Exception {
        // Create auth request with invalid credentials
        AuthRequest request = new AuthRequest("nonexistent@example.com", "wrongpassword");
        String requestJson = objectMapper.writeValueAsString(request);
        
        // Perform authentication
        mockMvc.perform(post("/api/auth/pacientes/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.authenticated").value(false));
    }
    
    @Test
    @Transactional
    void testAuthenticateCamareira_Success() throws Exception {
        // Create a camareira with known credentials
        Camareira camareira = new Camareira();
        camareira.setNome("Auth Camareira");
        camareira.setCpf("86420975300");
        camareira.setCre("CRE54321");
        camareira.setCargo("Camareira Sênior");
        camareira.setSetor("Limpeza");
        camareira.setDataNascimento(LocalDate.of(1988, 10, 20));
        camareira.setEmail("auth.camareira@example.com");
        camareira.setSenha("senha456");
        
        // Save the camareira to the database
        saveCamareiraEntity(camareira);
        
        // Create auth request
        AuthRequest request = new AuthRequest("auth.camareira@example.com", "senha456");
        String requestJson = objectMapper.writeValueAsString(request);
        
        // Perform authentication
        mockMvc.perform(post("/api/auth/camareiras/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.name").value("Auth Camareira"))
                .andExpect(jsonPath("$.role").value("camareira"))
                .andExpect(jsonPath("$.email").value("auth.camareira@example.com"));
    }
    
    @Test
    @Transactional
    void testAuthenticateCamareira_Failure() throws Exception {
        // Create auth request with invalid credentials
        AuthRequest request = new AuthRequest("nonexistent@example.com", "wrongpassword");
        String requestJson = objectMapper.writeValueAsString(request);
        
        // Perform authentication
        mockMvc.perform(post("/api/auth/camareiras/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.authenticated").value(false));
    }
    
    @Test
    @Transactional
    void testAuthenticateWithProfilePicture() throws Exception {
        // Create a paciente with known credentials and profile picture
        Paciente paciente = new Paciente(
            "Picture Paciente", 
            "12345888800", 
            LocalDate.of(1990, 3, 25), 
            StatusPaciente.INTERNADO
        );
        paciente.setEmail("picture.paciente@example.com");
        paciente.setSenha("senha789");
        paciente.setFotoPerfilBase64("base64encodedpicture");
        
        // Save the paciente to the database
        savePacienteEntity(paciente);
        
        // Create auth request
        AuthRequest request = new AuthRequest("picture.paciente@example.com", "senha789");
        String requestJson = objectMapper.writeValueAsString(request);
        
        // Perform authentication
        mockMvc.perform(post("/api/auth/pacientes/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.profilePicture").value("base64encodedpicture"));
    }
}
