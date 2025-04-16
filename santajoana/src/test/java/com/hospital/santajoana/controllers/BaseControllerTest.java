package com.hospital.santajoana.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.santajoana.domain.entity.*;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;
import com.hospital.santajoana.domain.entity.Pedido.StatusPedido;
import com.hospital.santajoana.domain.entity.Fatura.StatusPagamento;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
@AutoConfigureMockMvc
public abstract class BaseControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;
    
    @Autowired
    protected JdbcTemplate jdbcTemplate;
    
    @BeforeEach
    public void setUp() {
        // Add explicit cleanup to ensure database is clean before each test
        cleanup();
        
        // Log tables state after cleanup
        logTableCounts();
    }
    
    private void logTableCounts() {
        String[] tables = {"PRODUTO", "PEDIDO", "PACIENTE", "ESTADIA", "QUARTO", "CAMAREIRA", "METODO_PAGAMENTO", "FATURA"};
        for (String table : tables) {
            try {
                Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
                System.out.println("Table " + table + " has " + count + " records");
            } catch (Exception e) {
                System.err.println("Error counting " + table + ": " + e.getMessage());
            }
        }
    }
    
    @AfterEach
    public void cleanup() {
        // Enhance cleanup to be more thorough
        try {
            // First try to delete records instead of truncate
            // In reverse order of dependencies to avoid constraint violations
            jdbcTemplate.execute("DELETE FROM PRODUTO_PEDIDO");
            jdbcTemplate.execute("DELETE FROM PEDIDO");
            jdbcTemplate.execute("DELETE FROM FATURA");
            jdbcTemplate.execute("DELETE FROM ESTADIA");
            jdbcTemplate.execute("DELETE FROM PACIENTE");
            jdbcTemplate.execute("DELETE FROM QUARTO");
            jdbcTemplate.execute("DELETE FROM CAMAREIRA");
            jdbcTemplate.execute("DELETE FROM METODO_PAGAMENTO");
            jdbcTemplate.execute("DELETE FROM PRODUTO"); // Make sure PRODUTO is cleaned
            jdbcTemplate.execute("DELETE FROM CATEGORIA_PRODUTO");
            jdbcTemplate.execute("DELETE FROM CATEGORIA_QUARTO");
            
            // Now try the H2 specific approach as fallback
            jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
            jdbcTemplate.execute("TRUNCATE TABLE PRODUTO_PEDIDO");
            jdbcTemplate.execute("TRUNCATE TABLE PEDIDO");
            jdbcTemplate.execute("TRUNCATE TABLE FATURA");
            jdbcTemplate.execute("TRUNCATE TABLE ESTADIA");
            jdbcTemplate.execute("TRUNCATE TABLE PACIENTE");
            jdbcTemplate.execute("TRUNCATE TABLE QUARTO");
            jdbcTemplate.execute("TRUNCATE TABLE CAMAREIRA");
            jdbcTemplate.execute("TRUNCATE TABLE METODO_PAGAMENTO");
            jdbcTemplate.execute("TRUNCATE TABLE PRODUTO"); // Make sure PRODUTO is explicitly truncated
            jdbcTemplate.execute("TRUNCATE TABLE CATEGORIA_PRODUTO");
            jdbcTemplate.execute("TRUNCATE TABLE CATEGORIA_QUARTO");
            jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");
            
            // Verify all tables are empty
            String[] tables = {"PRODUTO_PEDIDO", "PEDIDO", "FATURA", "ESTADIA", "PACIENTE", 
                              "QUARTO", "CAMAREIRA", "METODO_PAGAMENTO", "PRODUTO", 
                              "CATEGORIA_PRODUTO", "CATEGORIA_QUARTO"};
                              
            for (String table : tables) {
                Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
                if (count > 0) {
                    System.err.println("WARNING: " + table + " table still has " + count + " records after cleanup!");
                }
            }
            
        } catch (Exception e) {
            System.err.println("Failed to clean up test database: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Helper methods to create entities
    protected ResultActions savePacienteEntity(Paciente paciente) throws Exception {
        String pacienteJson = objectMapper.writeValueAsString(paciente);
        return mockMvc.perform(post("/api/pacientes/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pacienteJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Paciente created: " + result.getResponse().getContentAsString());
                });
    }
    
    
    protected Paciente createDefaultPaciente() throws Exception {
        Paciente paciente = new Paciente(
            "João Silva", 
            "12345678900", 
            LocalDate.of(1980, 1, 1), 
            StatusPaciente.INTERNADO
        );
        String responseJson = savePacienteEntity(paciente)
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readValue(responseJson, Paciente.class);
    }
    

    protected ResultActions saveCategoriaQuartoEntity(CategoriaQuarto categoriaQuarto) throws Exception {
        String categoriaQuartoJson = objectMapper.writeValueAsString(categoriaQuarto);
        return mockMvc.perform(post("/api/categoria-quarto/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(categoriaQuartoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("CategoriaQuarto created: " + result.getResponse().getContentAsString());
    });
    }

    protected CategoriaQuarto createDefaultCategoriaQuarto() throws Exception {

        CategoriaQuarto categoriaQuarto = new CategoriaQuarto("Enfermaria", "Enfermaria com 4 leitos");
        String categoriaQuartoJson = saveCategoriaQuartoEntity(categoriaQuarto)
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readValue(categoriaQuartoJson, CategoriaQuarto.class);
    }
   
    protected CategoriaQuarto createDefaultCategoriaQuarto(String name) throws Exception {

        CategoriaQuarto categoriaQuarto = new CategoriaQuarto(name, "Enfermaria com 4 leitos");
        String categoriaQuartoJson = saveCategoriaQuartoEntity(categoriaQuarto)
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readValue(categoriaQuartoJson, CategoriaQuarto.class);
    }
   

    protected ResultActions saveCategoriaProdutoEntity(CategoriaProduto categoriaProduto) throws Exception {
        String categoriaProdutoJson = objectMapper.writeValueAsString(categoriaProduto);
        return mockMvc.perform(post("/api/categoria-produto/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(categoriaProdutoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("CategoriaProduto created: " + result.getResponse().getContentAsString());
                });
    }
    protected CategoriaProduto createDefaultCategoriaProduto() throws Exception {
        CategoriaProduto categoriaProduto = new CategoriaProduto("Almoço", "Refeições do almoço");
        String categoriaProdutoJson = saveCategoriaProdutoEntity(categoriaProduto)
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readValue(categoriaProdutoJson, CategoriaProduto.class);
    }
    protected CategoriaProduto createDefaultCategoriaProduto(String name) throws Exception {
        CategoriaProduto categoriaProduto = new CategoriaProduto(name, "Refeições do almoço");
        String categoriaProdutoJson = saveCategoriaProdutoEntity(categoriaProduto)
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readValue(categoriaProdutoJson, CategoriaProduto.class);
    }

    protected ResultActions saveQuartoEntity(Quarto quarto) throws Exception {
        String quartoJson = objectMapper.writeValueAsString(quarto);
        return mockMvc.perform(post("/api/quartos/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(quartoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Quarto created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Quarto createDefaultQuarto() throws Exception {

        CategoriaQuarto categoriaQuarto = createDefaultCategoriaQuarto();

        Quarto quarto = new Quarto(101, categoriaQuarto.getId());
        String quartoJson = saveQuartoEntity(quarto)
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readValue(quartoJson, Quarto.class);
    }
    
    protected ResultActions saveEstadiaEntity(Estadia estadia) throws Exception {
        String estadiaJson = objectMapper.writeValueAsString(estadia);
        return mockMvc.perform(post("/api/estadias/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(estadiaJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Estadia created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Estadia createDefaultEstadia() throws Exception {
        // First ensure we have a paciente and quarto
        var paciente = createDefaultPaciente();
        var quarto = createDefaultQuarto();
        
        // Create the estadia with IDs 1 since they should be the first records
        Estadia estadia = new Estadia(paciente.getId(), quarto.getId());
        String estadiaJson = saveEstadiaEntity(estadia)
            .andReturn()
            .getResponse()
            .getContentAsString();

        return objectMapper.readValue(estadiaJson, Estadia.class);
    }
    
    protected ResultActions savePedidoEntity(Pedido pedido) throws Exception {
        String pedidoJson = objectMapper.writeValueAsString(pedido);
        return mockMvc.perform(post("/api/pedidos/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(pedidoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Pedido created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Pedido createDefaultPedido() throws Exception {
        // First ensure we have an estadia
        var estadia = createDefaultEstadia();
        var camareira = createDefaultCamareira();

        Pedido pedido = new Pedido();
        
        pedido.setDataEntradaEstadia(estadia.getId());
        pedido.setCamareiraId(camareira.getId());
        
        String pedidoJson = savePedidoEntity(pedido)
            .andReturn()
            .getResponse()
            .getContentAsString();
        // Assuming the response contains the created Pedido object
        return objectMapper.readValue(pedidoJson, Pedido.class);
    }
    
    protected ResultActions saveProdutoEntity(Produto produto) throws Exception {
        String produtoJson = objectMapper.writeValueAsString(produto);
        return mockMvc.perform(post("/api/produtos/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(produtoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Produto created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Produto createDefaultProduto() throws Exception {
        // First ensure we have an estadia
        CategoriaProduto categoriaProduto = createDefaultCategoriaProduto();

        Produto produto = new Produto();
        produto.setNome("Refeição Completa");
        produto.setDescricao("Refeição com arroz, feijão e carne");
        produto.setPreco(new BigDecimal("25.9"));
        produto.setCategoriaId(categoriaProduto.getId());
        produto.setCaloriasKcal(500);
        produto.setProteinasG(30);
        produto.setCarboidratosG(60);
        produto.setGordurasG(20);
        produto.setSodioMg(200);
        produto.setTempoPreparoMinutos(30);
        
        String produtoJson = saveProdutoEntity(produto)
            .andReturn()
            .getResponse()
            .getContentAsString();
        // Assuming the response contains the created Produto object
        return objectMapper.readValue(produtoJson, Produto.class);
    }
    
    protected ResultActions saveFaturaEntity(Fatura fatura) throws Exception {
        String faturaJson = objectMapper.writeValueAsString(fatura);
        return mockMvc.perform(post("/api/faturas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(faturaJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Fatura created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Fatura createDefaultFatura() throws Exception {
        // First ensure we have an estadia
        var estadia = createDefaultEstadia();
        
        // Create method first and then use it
        MetodoPagamento metodoPagamento = createDefaultMetodoPagamento();
        
        Fatura fatura = new Fatura(estadia.getId());
        fatura.setDataEntradaEstadia(estadia.getId());
        fatura.setStatusPagamento(StatusPagamento.PENDENTE);
        fatura.setValorTotal(new BigDecimal("1000.00"));
        
        // Use the id directly from the created method to avoid toString conversion issues
        fatura.setMetodoPagamentoId(metodoPagamento.getId());
        
        String faturaJson = saveFaturaEntity(fatura)
            .andReturn()
            .getResponse()
            .getContentAsString();

        return objectMapper.readValue(faturaJson, Fatura.class);
    }
    
    protected ResultActions saveCamareiraEntity(Camareira camareira) throws Exception {
        String camareiraJson = objectMapper.writeValueAsString(camareira);
        return mockMvc.perform(post("/api/camareiras/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(camareiraJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("Camareira created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected Camareira createDefaultCamareira() throws Exception {
        Camareira camareira = new Camareira();
        camareira.setNome("Maria Silva");
        camareira.setCargo("Camareira");
        camareira.setCpf("12345678900");
        camareira.setCre("123456789");
        camareira.setSetor("Limpeza");
        camareira.setDataNascimento(LocalDate.of(1990, 1, 1));
        
        String camareiraJson = saveCamareiraEntity(camareira)
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readValue(camareiraJson, Camareira.class);
    }

    protected ResultActions saveMetodoPagamentoEntity(MetodoPagamento metodoPagamento) throws Exception {
        String metodoPagamentoJson = objectMapper.writeValueAsString(metodoPagamento);
        return mockMvc.perform(post("/api/metodos-pagamento/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(metodoPagamentoJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andDo(result -> {
                    // Optionally log the result
                    System.out.println("MetodoPagamento created: " + result.getResponse().getContentAsString());
                });
    }
    
    protected MetodoPagamento createDefaultMetodoPagamento() throws Exception {
        MetodoPagamento metodoPagamento = new MetodoPagamento();

        metodoPagamento.setTipo("Cartão de Crédito");

        String metodoPagamentoJson = saveMetodoPagamentoEntity(metodoPagamento)
            .andReturn()
            .getResponse()
            .getContentAsString();

        return objectMapper.readValue(metodoPagamentoJson, MetodoPagamento.class);
    }

}
