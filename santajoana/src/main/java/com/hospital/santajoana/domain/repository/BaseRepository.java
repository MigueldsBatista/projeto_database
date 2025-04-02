package com.hospital.santajoana.domain.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public abstract class BaseRepository<T> {
    
    private final String tableName;
    private final String idColumn;
    protected final JdbcTemplate jdbcTemplate;
    private final RowMapper<T> rowMapper;

    // Método abstrato para ser implementado no repositório específico
    public abstract T save(T entity);

    public List<T> findAll() {
        String sql = "SELECT * FROM " + tableName;
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<T> findById(Long id) {
        String sql = "SELECT * FROM " + tableName + " WHERE " +idColumn + " = ?";
        List<T> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    
    public void deleteById(Long id) {
        String sql = "DELETE FROM " + tableName + " WHERE "+idColumn + " = ?";
        jdbcTemplate.update(sql, id);
    }

    public abstract T update(T entity);

}
