package com.hospital.santajoana.domain.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON serialization
public class Pedido extends Entity {
    
    private Long estadiaId;
    private Long camareiraId;
    private StatusPedido status;
    private LocalDateTime dataPedido;
    
    public Pedido(LocalDateTime dataPedido, StatusPedido status) {
        this.dataPedido = dataPedido;
        this.status = status;
    }

    public Pedido(Long pedidoId, Long estadiaId, Long camareiraId, StatusPedido status, LocalDateTime dataPedido) {
        super(pedidoId); 
        this.estadiaId = estadiaId;
        this.camareiraId = camareiraId;
        this.status = status;
        this.dataPedido = dataPedido;
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
        
        @JsonValue // Add this annotation to use descricao for serialization
        public String getDescricao() {
            return descricao;
        }
        
        @JsonCreator // Add this annotation to use fromString for deserialization
        public static StatusPedido fromString(String descricao) {
            for (StatusPedido status : StatusPedido.values()) {
                String descricaoAtual =status.getDescricao();
                if (descricaoAtual.equalsIgnoreCase(descricao)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("StatusPedido inválido: " + descricao);
        }
    }
}
