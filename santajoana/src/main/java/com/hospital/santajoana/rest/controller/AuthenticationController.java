package com.hospital.santajoana.rest.controller;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hospital.santajoana.domain.entity.Camareira;
import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.services.CamareiraMediator;
import com.hospital.santajoana.domain.services.PacienteMediator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    
    private final PacienteMediator pacienteMediator;
    private final CamareiraMediator camareiraMediator;
    
    public AuthenticationController(PacienteMediator pacienteMediator, CamareiraMediator camareiraMediator) {
        this.pacienteMediator = pacienteMediator;
        this.camareiraMediator = camareiraMediator;
    }
    
    @PostMapping("/pacientes/login")
    public ResponseEntity<AuthResponse> authenticatePaciente(@RequestBody AuthRequest request) {

        var existingPaciente = pacienteMediator.findByEmail(request.getEmail());

        if (existingPaciente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, null, null, null, null, null));
        }

        boolean isAuthenticated = pacienteMediator.authenticate(request.getEmail(), request.getSenha());
        
        if (!isAuthenticated) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, null, null, null, null, null));

        }
            
        Paciente paciente = existingPaciente.get();

        AuthResponse response = new AuthResponse(
            true,
            paciente.getId(),
            paciente.getNome(),
            "paciente",
            paciente.getEmail(),
            paciente.getFotoPerfilBase64()
        );

        return ResponseEntity.ok(response);

        
    }
     
    @PostMapping("/camareiras/login")
    public ResponseEntity<AuthResponse> authenticateCamareira(@RequestBody AuthRequest request) {
        var existingCamareira = camareiraMediator.findByEmail(request.getEmail());
        
        if (existingCamareira == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, null, null, null, null, null));
        }
        
        boolean isAuthenticated = camareiraMediator.authenticate(request.getEmail(), request.getSenha());
        
        if (!isAuthenticated) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, null, null, null, null, null));
        }
        
        Camareira camareira = existingCamareira.get();
        
        AuthResponse response = new AuthResponse(
            true,
            camareira.getId(),
            camareira.getNome(),
            "camareira",
            camareira.getEmail(),
            camareira.getFotoPerfilBase64()
        );
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pacientes/update/password")
    public ResponseEntity<AuthResponse> updatePacientePassword(
            @RequestBody Map<String, String> request) {

            Long id = Long.valueOf(request.get("id"));
            String candidate = request.get("senhaAtual");
            String newPassword = request.get("novaSenha");

            boolean updated = pacienteMediator.updatePassword(id, candidate, newPassword);
            
            if (!updated) {
                return ResponseEntity.badRequest().build();
            }
            
            return ResponseEntity.noContent().build();

    }
    
    @PostMapping("/pacientes/profile-picture/{id}")
    public ResponseEntity<AuthResponse> updatePacienteProfilePicture(
            @PathVariable Long id, 
            @RequestBody ProfilePictureRequest request) {
                
        Paciente paciente = pacienteMediator.updateProfilePicture(id, request.getProfilePicture());
            
        AuthResponse response = new AuthResponse(
            true,
            paciente.getId(),
            paciente.getNome(),
            "paciente",
            paciente.getEmail(),
            paciente.getFotoPerfilBase64()
        );
        return ResponseEntity.ok(response);
       
    }
    
    @PostMapping("/camareiras/profile-picture/{id}")
    public ResponseEntity<AuthResponse> updateCamareiraProfilePicture(
            @PathVariable Long id, 
            @RequestBody ProfilePictureRequest request) {
        try {
            Camareira camareira = camareiraMediator.updateProfilePicture(id, request.getProfilePicture());
            
            AuthResponse response = new AuthResponse(
                true,
                camareira.getId(),
                camareira.getNome(),
                "camareira",
                camareira.getEmail(),
                camareira.getFotoPerfilBase64()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new AuthResponse(false, null, null, null, null, null));
        }
    }
    
    // Request and Response classes
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
    public static class AuthRequest {
        private String email;
        private String senha;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
    public static class AuthResponse {
        private boolean authenticated;
        private Long id;
        private String name;
        private String role;
        private String email;
        private String profilePicture;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfilePictureRequest {
        private String profilePicture;
    }
}
