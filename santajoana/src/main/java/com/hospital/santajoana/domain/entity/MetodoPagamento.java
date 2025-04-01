package com.hospital.santajoana.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class MetodoPagamento {

    private Long id;
    private TipoPagamento tipo;

    @Getter
    public enum TipoPagamento {
        CREDITO("Crédito"),
        DEBITO("Débito"),
        PIX("Pix");

        private final String descricao;
        
        TipoPagamento(String descricao) {
            this.descricao = descricao;
        }


    }

}
