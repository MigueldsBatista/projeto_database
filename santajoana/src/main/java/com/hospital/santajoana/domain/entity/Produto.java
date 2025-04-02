package com.hospital.santajoana.domain.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonValue;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Produto {
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer tempoPreparoMinutos;
    private CategoriaProduto categoria;
    private Integer caloriasKcal;
    private Integer ProteinasG;
    private Integer CarboidratosG;
    private Integer GordurasG;
    private Integer sodioMg;

    public enum CategoriaProduto {
        CAFE_DA_MANHA("Café da Manhã"),
        ALMOCO("Almoço"),
        JANTAR("Jantar"),
        SOBREMESA("Sobremesa"),
        BEBIDAS("Bebidas");

        private final String descricao;

        CategoriaProduto(String descricao) {
            this.descricao = descricao;
        }

        @JsonValue// This annotation is used to serialize the enum value as a string
        public String getDescricao() {
            return descricao;
        }

        @JsonCreator// This annotation is used to deserialize the string value back to the enum
        public static CategoriaProduto fromString(String descricao) {
            for (CategoriaProduto status : CategoriaProduto.values()) {
                if (status.getDescricao().equalsIgnoreCase(descricao)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Categoria Produto inválido: " + descricao);
        }
    }
    public Produto(String nome, String descricao, BigDecimal preco) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;

    }

    
}
