package com.hospital.santajoana.domain.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.Optional;

import com.hospital.santajoana.domain.entity.Paciente;
import com.hospital.santajoana.domain.entity.Paciente.StatusPaciente;

@Repository
public class PacienteRepository extends BaseRepository<Paciente, Long> {

    @SuppressWarnings("unused")
    public PacienteRepository(JdbcTemplate jdbcTemplate) {
        super("PACIENTE", "ID_PACIENTE", jdbcTemplate, (rs, rowNum) -> {
            try {
                // Create Paciente with just the status
                Paciente paciente = new Paciente(
                    StatusPaciente.fromString(rs.getString("STATUS"))
                );
                
                // Set ID and basic personal information
                paciente.setId(rs.getLong("ID_PACIENTE"));
                paciente.setNome(rs.getString("NOME"));
                paciente.setCpf(rs.getString("CPF"));
                
                // Handle date conversion safely
                Date dataNascDB = rs.getDate("DATA_NASCIMENTO");
                if (dataNascDB != null) {
                    paciente.setDataNascimento(dataNascDB.toLocalDate());
                }
                
                // Set contact information
                paciente.setTelefone(rs.getString("TELEFONE"));
                paciente.setEndereco(rs.getString("ENDERECO"));
                
                // Set additional Pessoa fields
                paciente.setEmail(rs.getString("EMAIL"));
                paciente.setSenha(rs.getString("SENHA"));
                paciente.setFotoPerfilBase64(rs.getString("FOTO_PERFIL_BASE64"));

                return paciente;
            } catch (Exception e) {
                throw new RuntimeException("Error mapping Paciente result set: " + e.getMessage(), e);
            }
        });
    }

    @Override
    public Paciente save(Paciente paciente) {
        String insertSql =
        "INSERT INTO PACIENTE (NOME, CPF, DATA_NASCIMENTO, TELEFONE, ENDERECO, EMAIL, SENHA, FOTO_PERFIL_BASE64) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSql,
            paciente.getNome(),
            paciente.getCpf(),
            Date.valueOf(paciente.getDataNascimento()),
            paciente.getTelefone(),
            paciente.getEndereco(),
            paciente.getEmail(),
            paciente.getSenha(),
            paciente.getFotoPerfilBase64() // This can be null
            );
        Paciente salvo = findLastInserted();
        return salvo;
    }

    @Override
    public Paciente update(Paciente paciente) {
        // Check if ID exists before attempting update
        if (paciente.getId() == null) {
            throw new IllegalArgumentException("Cannot update a Paciente without an ID");
        }
        // Build dynamic update SQL based on non-null fields
        StringBuilder updateSql = new StringBuilder("UPDATE PACIENTE SET ");
        java.util.List<Object> params = new java.util.ArrayList<>();
        
        if (paciente.getNome() != null) {
            updateSql.append("NOME = ?, ");
            params.add(paciente.getNome());
        }
        
        if (paciente.getCpf() != null) {
            updateSql.append("CPF = ?, ");
            params.add(paciente.getCpf());
        }
        
        if (paciente.getDataNascimento() != null) {
            updateSql.append("DATA_NASCIMENTO = ?, ");
            params.add(Date.valueOf(paciente.getDataNascimento()));
        }
        
        if (paciente.getTelefone() != null) {
            updateSql.append("TELEFONE = ?, ");
            params.add(paciente.getTelefone());
        }
        
        if (paciente.getEndereco() != null) {
            updateSql.append("ENDERECO = ?, ");
            params.add(paciente.getEndereco());
        }
        
        if (paciente.getStatus() != null) {
            updateSql.append("STATUS = ?, ");
            params.add(paciente.getStatus().getDescricao());
        }
        
        if (paciente.getEmail() != null) {
            updateSql.append("EMAIL = ?, ");
            params.add(paciente.getEmail());
        }
        
        if (paciente.getSenha() != null) {
            updateSql.append("SENHA = ?, ");
            params.add(paciente.getSenha());
        }
        
        // FOTO_PERFIL_BASE64 can be null, so we'll handle it differently
        updateSql.append("FOTO_PERFIL_BASE64 = ? ");
        params.add(paciente.getFotoPerfilBase64());
        
        updateSql.append("WHERE ID_PACIENTE = ?");
        params.add(paciente.getId());
        
        jdbcTemplate.update(updateSql.toString(), params.toArray());
        
        return findById(paciente.getId()).orElseThrow(() -> 
            new RuntimeException("No paciente found with ID: " + paciente.getId()));
        }

    public Paciente updateStatus(Paciente paciente) {
        // Check if ID exists before attempting update
        if (paciente.getId() == null) {
            throw new IllegalArgumentException("Cannot update a Paciente without an ID");
        }
        
        String updateSql = "UPDATE PACIENTE SET STATUS = ? WHERE ID_PACIENTE = ?";
        jdbcTemplate.update(updateSql,
            paciente.getStatus().getDescricao(),
            paciente.getId()
        );
        
        return paciente;
    }

    public Paciente updateProfilePicture(Long id, String fotoPerfilBase64) {
        // Check if ID exists before attempting update
        if (id == null) {
            throw new IllegalArgumentException("Cannot update a Paciente without an ID");
        }
        
        String updateSql = "UPDATE PACIENTE SET FOTO_PERFIL_BASE64 = ? WHERE ID_PACIENTE = ?";
        jdbcTemplate.update(updateSql, fotoPerfilBase64, id);
        
        return findById(id).orElseThrow(() -> 
            new RuntimeException("No paciente found with ID: " + id));
    }

    public boolean authenticate(String email, String senha) {
        String sql = "SELECT * FROM PACIENTE WHERE EMAIL = ? AND SENHA = ?";
        var user = super.findBySql(sql, email, senha);
        if (user.isEmpty()) {
            return false;
        }
        return true;
    }

    public Optional<Paciente> findByEmail(String email) {
        String sql = "SELECT * FROM PACIENTE WHERE EMAIL = ?";

        var user = super.findBySql(sql, email);

        return user.stream().findFirst();
    }
}
