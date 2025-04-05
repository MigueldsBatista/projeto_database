package com.hospital.santajoana.domain.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Quarto {

    private Long id;
    private Integer numero;
    private String tipo; // Keep for backward compatibility
    private Long categoriaQuartoId; // Add this field
    private CategoriaQuarto categoriaQuarto; // Add this field
    
    public Quarto(Integer numero, String tipo) {
        this.numero = numero;
        this.tipo = tipo;
    }
    
    // Helper method to set categoriaQuartoId from categoriaQuarto object
    public void setCategoriaQuartoId() {
        if (this.categoriaQuarto != null) {
            this.categoriaQuartoId = this.categoriaQuarto.getId();
        }
    }
    
    // Helper method to set categoriaQuarto from categoriaQuartoId
    public void setCategoriaQuartoFromId(CategoriaQuarto categoriaQuarto) {
        this.categoriaQuarto = categoriaQuarto;
        if (categoriaQuarto != null) {
            this.categoriaQuartoId = categoriaQuarto.getId();
        }
    }
}
