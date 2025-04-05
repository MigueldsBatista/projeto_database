package com.hospital.santajoana.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.CategoriaProduto;
import com.hospital.santajoana.domain.entity.Produto;

@Repository
public class ProdutoRepository extends BaseRepository<Produto> {
    
    private final CategoriaProdutoRepository categoriaProdutoRepository;

    public ProdutoRepository(JdbcTemplate jdbcTemplate, CategoriaProdutoRepository categoriaProdutoRepository) {
        super("PRODUTO","ID_PRODUTO",jdbcTemplate, (rs, rowNum) -> {
            Produto produto = new Produto();
            produto.setId(rs.getLong("ID_PRODUTO"));
            produto.setNome(rs.getString("NOME"));
            produto.setDescricao(rs.getString("DESCRICAO"));
            produto.setPreco(rs.getBigDecimal("PRECO"));
            produto.setTempoPreparoMinutos(rs.getInt("TEMPO_PREPARO"));
            produto.setCategoriaId(rs.getObject("ID_CATEGORIA") != null ? rs.getLong("ID_CATEGORIA") : null);
            produto.setCaloriasKcal(rs.getObject("CALORIAS_KCAL") != null ? rs.getInt("CALORIAS_KCAL") : null);
            produto.setProteinasG(rs.getObject("PROTEINAS_G") != null ? rs.getInt("PROTEINAS_G") : null);
            produto.setCarboidratosG(rs.getObject("CARBOIDRATOS_G") != null ? rs.getInt("CARBOIDRATOS_G") : null);
            produto.setGordurasG(rs.getObject("GORDURAS_G") != null ? rs.getInt("GORDURAS_G") : null);
            produto.setSodioMg(rs.getObject("SODIO_MG") != null ? rs.getInt("SODIO_MG") : null);
            return produto;
        });
        this.categoriaProdutoRepository = categoriaProdutoRepository;
    }

    @Override
    public List<Produto> findAll() {
        List<Produto> produtos = super.findAll();
        produtos.forEach(this::loadCategoria);
        return produtos;
    }

    @Override
    public Optional<Produto> findById(Long id) {

        var produto = super.findById(id);
        
        if (produto.isPresent()) {

            loadCategoria(produto.get());
            return produto;

        }
        
        return Optional.empty();
    }

    private void loadCategoria(Produto produto) {
        if (produto.getCategoriaId() != null) {
            categoriaProdutoRepository.findById(produto.getCategoriaId())
                .ifPresent(produto::setCategoriaFromId);
        }
    }

    public Produto save(Produto produto) {
        // Handle categoria relationship
        if (produto.getCategoria() != null && produto.getCategoria().getId() == null) {
            CategoriaProduto savedCategoria = categoriaProdutoRepository.save(produto.getCategoria());
            produto.setCategoriaFromId(savedCategoria);
        } else if (produto.getCategoria() != null) {
            produto.setCategoriaId();
        }
        
        String insertSql = "INSERT INTO PRODUTO (NOME, DESCRICAO, PRECO, TEMPO_PREPARO, ID_CATEGORIA, CALORIAS_KCAL, PROTEINAS_G, CARBOIDRATOS_G, GORDURAS_G, SODIO_MG) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
            produto.getNome(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getTempoPreparoMinutos(),
            produto.getCategoriaId(),
            produto.getCaloriasKcal(),
            produto.getProteinasG(),
            produto.getCarboidratosG(),
            produto.getGordurasG(),
            produto.getSodioMg());
        var produtoSaved = findLastInserted();
        loadCategoria(produtoSaved);
        return produtoSaved;
    }

    public Produto update(Produto produto) {
        // Handle categoria relationship
        if (produto.getCategoria() != null && produto.getCategoria().getId() == null) {
            CategoriaProduto savedCategoria = categoriaProdutoRepository.save(produto.getCategoria());
            produto.setCategoriaFromId(savedCategoria);
        } else if (produto.getCategoria() != null) {
            produto.setCategoriaId();
        }
        
        String updateSql = "UPDATE PRODUTO SET NOME = ?, DESCRICAO = ?, PRECO = ?, TEMPO_PREPARO = ?, ID_CATEGORIA = ?, CALORIAS_KCAL = ?, PROTEINAS_G = ?, CARBOIDRATOS_G = ?, GORDURAS_G = ?, SODIO_MG = ? WHERE ID_PRODUTO = ?";
        jdbcTemplate.update(updateSql,
            produto.getNome(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getTempoPreparoMinutos(),
            produto.getCategoriaId(),
            produto.getCaloriasKcal(),
            produto.getProteinasG(),
            produto.getCarboidratosG(),
            produto.getGordurasG(),
            produto.getSodioMg(),
            produto.getId()
        );
        loadCategoria(produto);
        return produto;
    }

    public List<Produto> findProdutosByPedidoId(Long pedidoId){
        String sql = "SELECT p.* FROM PRODUTO p " +
                     "JOIN PRODUTO_PEDIDO pp ON p.ID_PRODUTO = pp.ID_PRODUTO " +
                     "WHERE pp.ID_PEDIDO = ?";

        List<Produto> produtos = findBySql(sql, pedidoId);
        produtos.forEach(this::loadCategoria);
        return produtos;
    }
}
