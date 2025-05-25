package com.hospital.santajoana.domain.repository;

import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hospital.santajoana.domain.entity.Camareira;

@Repository
public class CamareiraRepository extends BaseRepository<Camareira, Long> {

    @SuppressWarnings("unused")
    public CamareiraRepository(JdbcTemplate jdbcTemplate) {
        super("CAMAREIRA", "ID_CAMAREIRA", jdbcTemplate, (rs, rowNum) -> {
            Camareira camareira = new Camareira(
                rs.getString("CPF"),
                rs.getString("NOME"),
                rs.getDate("DATA_NASCIMENTO").toLocalDate(),
                rs.getString("TELEFONE"),
                rs.getString("ENDERECO"),
                rs.getString("SENHA"),
                rs.getString("EMAIL"),
                rs.getString("FOTO_PERFIL_BASE64"),
                rs.getString("CRE"),
                rs.getString("CARGO"),
                rs.getString("SETOR")
            );
            camareira.setId(rs.getLong("ID_CAMAREIRA"));
            return camareira;
        });
    }

    @Override
    public Camareira save(Camareira camareira) {
        String insertSql = "INSERT INTO CAMAREIRA (CPF, NOME, DATA_NASCIMENTO, TELEFONE, ENDERECO, CRE, CARGO, SETOR, EMAIL, SENHA, FOTO_PERFIL_BASE64) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
            camareira.getCpf(),
            camareira.getNome(),
            camareira.getDataNascimento(),
            camareira.getTelefone(),
            camareira.getEndereco(),
            camareira.getCre(),
            camareira.getCargo(),
            camareira.getSetor(),
            camareira.getEmail(),
            camareira.getSenha(),
            camareira.getFotoPerfilBase64()
        );
        var savedCamareira = findLastInserted();
        return savedCamareira;
    }

    @Override
    public Camareira update(Camareira camareira) {
        // Check if ID exists before attempting update
        if (camareira.getId() == null) {
            throw new IllegalArgumentException("Cannot update a Camareira without an ID");
        }
        
        String updateSql = "UPDATE CAMAREIRA SET CPF = ?, NOME = ?, DATA_NASCIMENTO = ?, TELEFONE = ?, ENDERECO = ?, CRE = ?, CARGO = ?, SETOR = ?, EMAIL = ?, SENHA = ?, FOTO_PERFIL_BASE64 = ? WHERE ID_CAMAREIRA = ?";
        int rowsAffected = jdbcTemplate.update(updateSql,
            camareira.getCpf(),
            camareira.getNome(),
            camareira.getDataNascimento(),
            camareira.getTelefone(),
            camareira.getEndereco(),
            camareira.getCre(),
            camareira.getCargo(),
            camareira.getSetor(),
            camareira.getEmail(),
            camareira.getSenha(),
            camareira.getFotoPerfilBase64(), // This can be null
            camareira.getId()
        );
        
        // Check if any rows were affected by the update
        if (rowsAffected == 0) {
            throw new RuntimeException("No camareira found with ID: " + camareira.getId());
        }

        return camareira;
    }

    public Camareira updateProfilePicture(Long id, String fotoPerfilBase64) {
        // Check if ID exists before attempting update
        if (id == null) {
            throw new IllegalArgumentException("Cannot update a Camareira without an ID");
        }
        
        String updateSql = "UPDATE CAMAREIRA SET FOTO_PERFIL_BASE64 = ? WHERE ID_CAMAREIRA = ?";
        int rowsAffected = jdbcTemplate.update(updateSql, fotoPerfilBase64, id);
        
        // Check if any rows were affected by the update
        if (rowsAffected == 0) {
            throw new RuntimeException("No camareira found with ID: " + id);
        }
        
        return findById(id).get();
    }

    public boolean authenticate(String email, String senha) {
        String sql = "SELECT * FROM CAMAREIRA WHERE EMAIL = ? AND SENHA = ?";
        var user = super.findBySql(sql, email, senha);
        if (user.isEmpty()) {
            return false;
        }
        return true;
    }
    
    public Optional<Camareira> findByEmail(String email) {
        String sql = "SELECT * FROM CAMAREIRA WHERE EMAIL = ?";
        var user = super.findBySql(sql, email);
        if (user.isEmpty()) {
            return null;
        }
        return user.stream()
            .findFirst();
    }

    public Optional<Camareira> findByCpf(String cpf) {
        String sql = "SELECT * FROM CAMAREIRA WHERE CPF = ?";
        return this.findBySql(sql, cpf)
        .stream()
        .findFirst();
    }

}
