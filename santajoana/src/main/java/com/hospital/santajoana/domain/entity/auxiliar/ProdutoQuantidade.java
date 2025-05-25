package com.hospital.santajoana.domain.entity.auxiliar;

public class ProdutoQuantidade {
    private String nome;
    private String categoria;
    private Integer quantidade;

    public ProdutoQuantidade(String categoria, String nome, Integer quantidade) {
        this.quantidade = quantidade;
        this.categoria = categoria;
        this.nome = nome;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getCategoria() {
        return categoria;
    }
    public String getNome() {
        return nome;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
