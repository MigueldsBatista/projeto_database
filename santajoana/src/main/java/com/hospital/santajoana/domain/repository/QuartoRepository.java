package com.hospital.santajoana.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.CategoriaQuarto;
import com.hospital.santajoana.domain.entity.Quarto;

@Repository
public class QuartoRepository extends BaseRepository<Quarto> {

    private final CategoriaQuartoRepository categoriaQuartoRepository;

    public QuartoRepository(JdbcTemplate jdbcTemplate, CategoriaQuartoRepository categoriaQuartoRepository) {
        super("QUARTO", "ID_QUARTO", jdbcTemplate, (rs, rowNum) -> {
            Quarto quarto = new Quarto();
            quarto.setId(rs.getLong("ID_QUARTO"));
            quarto.setNumero(rs.getInt("NUMERO"));
            quarto.setTipo(rs.getString("TIPO"));
            quarto.setCategoriaQuartoId(rs.getObject("CATEGORIA_QUARTO_ID") != null ? rs.getLong("CATEGORIA_QUARTO_ID") : null);
            return quarto;
        });
        this.categoriaQuartoRepository = categoriaQuartoRepository;
    }

    @Override
    public List<Quarto> findAll() {
        List<Quarto> quartos = super.findAll();
        quartos.forEach(this::loadCategoria);
        return quartos;
    }

    @Override
    public Optional<Quarto> findById(Long id) {
        Optional<Quarto> quartoOpt = super.findById(id);
        quartoOpt.ifPresent(this::loadCategoria);
        return quartoOpt;
    }

    private void loadCategoria(Quarto quarto) {
        if (quarto.getCategoriaQuartoId() != null) {
            categoriaQuartoRepository.findById(quarto.getCategoriaQuartoId())
                .ifPresent(quarto::setCategoriaQuartoFromId);
        }
    }

    public Quarto save(Quarto quarto) {
        // Handle categoria relationship
        if (quarto.getCategoriaQuarto() != null && quarto.getCategoriaQuarto().getId() == null) {

            CategoriaQuarto savedCategoria = categoriaQuartoRepository.save(quarto.getCategoriaQuarto());

            quarto.setCategoriaQuartoFromId(savedCategoria);

        }
        else if (quarto.getCategoriaQuarto() != null) {
            quarto.setCategoriaQuartoId();
        }

        String insertSql = "INSERT INTO QUARTO (NUMERO, TIPO, CATEGORIA_QUARTO_ID) VALUES (?, ?, ?)";
        jdbcTemplate.update(insertSql,
            quarto.getNumero(),
            quarto.getTipo(),
            quarto.getCategoriaQuartoId());
        var savedQuarto = findLastInserted();
        loadCategoria(savedQuarto);
        return savedQuarto;
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public Quarto update(Quarto quarto) {
        // Handle categoria relationship
        if (quarto.getCategoriaQuarto() != null && quarto.getCategoriaQuarto().getId() == null) {
            CategoriaQuarto savedCategoria = categoriaQuartoRepository.save(quarto.getCategoriaQuarto());
            quarto.setCategoriaQuartoFromId(savedCategoria);
        } else if (quarto.getCategoriaQuarto() != null) {
            quarto.setCategoriaQuartoId();
        }
        
        String updateSql = "UPDATE QUARTO SET NUMERO = ?, TIPO = ?, CATEGORIA_QUARTO_ID = ? WHERE ID_QUARTO = ?";
        jdbcTemplate.update(updateSql,
            quarto.getNumero(),
            quarto.getTipo(),
            quarto.getCategoriaQuartoId(),
            quarto.getId()
        );
        loadCategoria(quarto);
        return quarto;
    }
}
