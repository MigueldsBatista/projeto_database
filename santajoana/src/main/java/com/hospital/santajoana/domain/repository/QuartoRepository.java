package com.hospital.santajoana.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.Quarto;

@Repository
public class QuartoRepository extends BaseRepository<Quarto, Long> {

    public QuartoRepository(JdbcTemplate jdbcTemplate) {
        super("QUARTO", "ID_QUARTO", jdbcTemplate,(rs, rowNum) -> new Quarto(
            rs.getLong("ID_QUARTO"),
            rs.getInt("NUMERO"),
            rs.getLong("ID_CATEGORIA_QUARTO")
        ));
    }

    public Quarto save(Quarto quarto) {
        String insertSql = "INSERT INTO QUARTO (NUMERO, ID_CATEGORIA_QUARTO) VALUES (?, ?)";
        jdbcTemplate.update(insertSql,
            quarto.getNumero(),
            quarto.getCategoriaId());
            var savedQuarto = findLastInserted();
        return savedQuarto;
    }

    public Optional<Quarto> findById(Long id) {
        return super.findById(id);
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public Quarto update(Quarto quarto) {
        String updateSql = "UPDATE QUARTO SET NUMERO = ?, ID_CATEGORIA_QUARTO = ? WHERE ID_QUARTO = ?";
        jdbcTemplate.update(updateSql,
            quarto.getNumero(),
            quarto.getCategoriaId(),
            quarto.getId()
        );
        return quarto;
    }


    public Optional<List<Quarto>> findFreeQuarto(){
        String sql="SELECT * \n" + //
                        "FROM QUARTO Q\n" + //
                        "WHERE NOT EXISTS (\n" + //
                        "    SELECT 1 \n" + //
                        "    FROM ESTADIA E\n" + //
                        "    WHERE E.ID_QUARTO = Q.ID_QUARTO\n" + //
                        "      AND E.DATA_SAIDA IS NULL\n" + //
                        ") ORDER BY NUMERO;";

        return Optional.ofNullable(super.findBySql(sql, new Object[]{}));
    }
    
}
