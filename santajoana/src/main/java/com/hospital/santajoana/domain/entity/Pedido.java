package com.hospital.santajoana.domain.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Pedido {
    
    private Long id;
    private Long estadiaId;
    private Long camareiraId;
    private StatusPedido status;
    private LocalDateTime dataPedido;
    
    public Pedido(LocalDateTime dataPedido, StatusPedido status) {
        this.dataPedido = dataPedido;
        this.status = status;
    }

    @Getter
    public enum StatusPedido {
        EM_PREPARO("Em Preparo"),
        ENTREGUE("Entregue"),
        PENDENTE("Pendente");   
        
        private final String descricao;
        
        StatusPedido(String descricao) {
            this.descricao = descricao;
        }
        @JsonCreator// This annotation is used to deserialize the string value back to the enum
        public static StatusPedido fromString(String descricao) {
            for (StatusPedido status : StatusPedido.values()) {
                if (status.getDescricao().equalsIgnoreCase(descricao)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("StatusPedido inválido: " + descricao);
        }
    }
}
