package com.hospital.santajoana.controllers;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.MediaType;

import com.hospital.santajoana.domain.entity.Produto;
import com.hospital.santajoana.domain.entity.Produto.CategoriaProduto;

public class ProdutoControllerTest extends BaseControllerTest {

    @Test
    @Transactional
    void testGetAllProdutos() throws Exception {
        
        mockMvc.perform(get("/api/produtos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        var produto = createDefaultProduto();
        mockMvc.perform(get("/api/produtos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(produto.getId()))
                .andExpect(jsonPath("$[0].nome").value(produto.getNome()))
                .andExpect(jsonPath("$[0].descricao").value(produto.getDescricao()))
                .andExpect(jsonPath("$[0].preco").value(produto.getPreco().doubleValue()))
                .andExpect(jsonPath("$[0].tempoPreparoMinutos").value(produto.getTempoPreparoMinutos()));
    }

    @Test
    @Transactional
    void testCreateProduto() throws Exception {
        Produto testProduto = new Produto();
        testProduto.setNome("Refeição Teste");
        testProduto.setDescricao("Refeição com arroz, feijão e carne");
        testProduto.setPreco(BigDecimal.valueOf(25.50));
        testProduto.setTempoPreparoMinutos(30);
        testProduto.setCategoria(CategoriaProduto.ALMOCO);
        testProduto.setCaloriasKcal(500);
        testProduto.setProteinasG(30);
        testProduto.setCarboidratosG(60);
        testProduto.setGordurasG(20);
        testProduto.setSodioMg(200);

        String produtoJson = objectMapper.writeValueAsString(testProduto);
        mockMvc.perform(post("/api/produtos/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(produtoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nome").value(testProduto.getNome()))
                .andExpect(jsonPath("$.descricao").value(testProduto.getDescricao()))
                .andExpect(jsonPath("$.preco").value(testProduto.getPreco()))
                .andExpect(jsonPath("$.tempoPreparoMinutos").value(testProduto.getTempoPreparoMinutos()))
                .andExpect(jsonPath("$.categoria").value(testProduto.getCategoria().getDescricao()))
                .andExpect(jsonPath("$.caloriasKcal").value(testProduto.getCaloriasKcal()))
                .andExpect(jsonPath("$.proteinasG").value(testProduto.getProteinasG()))
                .andExpect(jsonPath("$.carboidratosG").value(testProduto.getCarboidratosG()))
                .andExpect(jsonPath("$.gordurasG").value(testProduto.getGordurasG()))
                .andExpect(jsonPath("$.sodioMg").value(testProduto.getSodioMg()));
    }

    @Test
    @Transactional
    void testGetProdutoById() throws Exception {

        var produto = createDefaultProduto();

        mockMvc.perform(get("/api/produtos/{id}", produto.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(produto.getId()))
                .andExpect(jsonPath("$.nome").value(produto.getNome()))
                .andExpect(jsonPath("$.descricao").value(produto.getDescricao()))
                .andExpect(jsonPath("$.categoria").value(produto.getCategoria().getDescricao()));
    }

    @Test
    @Transactional
    void testUpdateProduto() throws Exception {
        Produto firstProduto = createDefaultProduto();

        Produto updatedProduto = new Produto();
        updatedProduto.setId(firstProduto.getId());
        updatedProduto.setNome("Refeição Atualizada");
        updatedProduto.setDescricao("Refeição com arroz, feijão e carne");
        updatedProduto.setPreco(BigDecimal.valueOf(30.00));
        updatedProduto.setTempoPreparoMinutos(25);
        updatedProduto.setCategoria(CategoriaProduto.JANTAR);
        updatedProduto.setCaloriasKcal(600);
        updatedProduto.setProteinasG(35);
        updatedProduto.setCarboidratosG(70);
        updatedProduto.setGordurasG(25);
        updatedProduto.setSodioMg(250);

        String produtoJson = objectMapper.writeValueAsString(updatedProduto);
        mockMvc.perform(put("/api/produtos/update/{id}", firstProduto.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(produtoJson))
                .andDo(result -> {
                    System.out.println("Response: " + result.getResponse().getContentAsString());
                })
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(firstProduto.getId()))
                .andExpect(jsonPath("$.nome").value(updatedProduto.getNome()))
                .andExpect(jsonPath("$.descricao").value(updatedProduto.getDescricao()))
                .andExpect(jsonPath("$.preco").value(updatedProduto.getPreco()))
                .andExpect(jsonPath("$.tempoPreparoMinutos").value(updatedProduto.getTempoPreparoMinutos()))
                .andExpect(jsonPath("$.categoria").value(updatedProduto.getCategoria().getDescricao()))
                .andExpect(jsonPath("$.caloriasKcal").value(updatedProduto.getCaloriasKcal()))
                .andExpect(jsonPath("$.proteinasG").value(updatedProduto.getProteinasG()))
                .andExpect(jsonPath("$.carboidratosG").value(updatedProduto.getCarboidratosG()))
                .andExpect(jsonPath("$.gordurasG").value(updatedProduto.getGordurasG()))
                .andExpect(jsonPath("$.sodioMg").value(updatedProduto.getSodioMg()));
    }

    @Test
    @Transactional
    void testDeleteProduto() throws Exception {
        var produto = createDefaultProduto();
        mockMvc.perform(delete("/api/produtos/delete/{id}", produto.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/produtos/delete/{id}", produto.getId()))
                .andExpect(status().isNotFound());
    }
}
