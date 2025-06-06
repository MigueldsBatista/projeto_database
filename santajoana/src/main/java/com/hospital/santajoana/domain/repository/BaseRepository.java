package com.hospital.santajoana.domain.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public abstract class BaseRepository<T, PK>{

    private final String tableName;
    private final String idColumn;
    protected final JdbcTemplate jdbcTemplate;
    private final RowMapper<T> rowMapper;

    // Abstract methods from CrudOperations interface
    public abstract T save(T entity);

    public abstract T update(T entity);

    public List<T> findAll() {
        String sql = "SELECT * FROM " + tableName;
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<T> findById(PK id) {
        String sql = "SELECT * FROM " + tableName + " WHERE " + idColumn + " = ?";
        List<T> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public void deleteById(PK id) {
        String sql = "DELETE FROM " + tableName + " WHERE " + idColumn + " = ?";
        jdbcTemplate.update(sql, id);
    }

    public List<T> findBySql(String sql, Object... args) {
        return jdbcTemplate.query(sql, rowMapper, args);
    }
    
    public List<T> findBySql(String sql) {
        return jdbcTemplate.query(sql, rowMapper);
    }
    
    public List<T> findBySql(String sql, RowMapper<T> rowMapper) {
        return jdbcTemplate.query(sql, rowMapper);
    }

    public T findLastInserted() {
        String sql = "SELECT * FROM " + tableName + " ORDER BY " + idColumn + " DESC LIMIT 1";
        List<T> results = jdbcTemplate.query(sql, rowMapper);
        return results.stream().findFirst().orElse(null);
    }
}
