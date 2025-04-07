package com.hospital.santajoana.domain.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public abstract class BaseRepository<T> implements CrudOperations<T> {

    private final String tableName;
    private final String idColumn;
    protected final JdbcTemplate jdbcTemplate;
    private final RowMapper<T> rowMapper;

    // Abstract methods from CrudOperations interface
    @Override
    public abstract T save(T entity);
    
    @Override
    public abstract T update(T entity);

    @Override
    public List<T> findAll() {
        String sql = "SELECT * FROM " + tableName;
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Optional<T> findById(Long id) {
        String sql = "SELECT * FROM " + tableName + " WHERE " + idColumn + " = ?";
        List<T> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM " + tableName + " WHERE " + idColumn + " = ?";
        jdbcTemplate.update(sql, id);
    }

    public List<T> findBySql(String sql, Object... args) {
        return jdbcTemplate.query(sql, rowMapper, args);
    }

    public T findLastInserted() {
        String sql = "SELECT * FROM " + tableName + " ORDER BY " + idColumn + " DESC LIMIT 1";
        List<T> results = jdbcTemplate.query(sql, rowMapper);
        return results.stream().findFirst().orElse(null);
    }
}
