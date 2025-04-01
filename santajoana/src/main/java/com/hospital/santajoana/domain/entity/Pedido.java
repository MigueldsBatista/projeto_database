package com.hospital.santajoana.domain.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
        EM_ANDAMENTO("Em andamento"),
        ENTREGUE("Entregue"),
        PAGO("Pago");
        
        private String descricao;
        
        StatusPedido(String descricao) {
            this.descricao = descricao;
        }
    
    }
}
