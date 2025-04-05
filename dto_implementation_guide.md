# DTO Implementation Guide for Domain Objects with Object References

This guide explains how to properly implement the DTO pattern in a multi-layered architecture where domain entities contain object references rather than just IDs.

## 1. Understanding the Relationship Between DTOs and Entities

In your system, entities like `Estadia` contain full object references:
```java
public class Estadia {
    private Long id;
    private Paciente paciente;  // Full object reference, not just an ID
    private Quarto quarto;      // Full object reference, not just an ID
    private LocalDateTime dataEntrada;
    private LocalDateTime dataSaida;
    // ...
}
```

While your API clients need to work with simpler structures using just IDs:
```json
{
  "pacienteId": 1,
  "quartoId": 1,
  "dataEntrada": "2023-06-01T10:00:00",
  "dataSaida": null
}
```

## 2. Recommended Approach for Handling Object References

### 2.1 DTO Definition

Your DTOs should contain IDs that represent object references:

```java
public class EstadiaDTO {
    Long id;
    Long pacienteId;  // Just the ID, not the full Paciente object
    Long quartoId;    // Just the ID, not the full Quarto object
    String dataEntrada;
    String dataSaida;
    // ...
}
```

### 2.2 Controller Layer

The controller is responsible for:
1. Receiving DTOs from client
2. Looking up reference objects by their IDs
3. Assembling complete entity objects
4. Passing entities to the service/mediator layer

```java
@PostMapping("/create")
public ResponseEntity<EstadiaDTO> create(@RequestBody EstadiaDTO estadiaDTO) {
    // 1. Resolve references using repository/mediator
    Optional<Paciente> pacienteOpt = pacienteMediator.findById(estadiaDTO.getPacienteId());
    Optional<Quarto> quartoOpt = quartoMediator.findById(estadiaDTO.getQuartoId());
    
    if (pacienteOpt.isEmpty() || quartoOpt.isEmpty()) {
        return ResponseEntity.badRequest().build();  // Missing references
    }
    
    // 2. Convert date strings to appropriate types
    LocalDateTime entrada = estadiaDTO.getDataEntrada() != null ? 
        LocalDateTime.parse(estadiaDTO.getDataEntrada()) : LocalDateTime.now();
    
    LocalDateTime saida = estadiaDTO.getDataSaida() != null ? 
        LocalDateTime.parse(estadiaDTO.getDataSaida()) : null;
    
    // 3. Assemble entity with full object references
    Estadia estadia = new Estadia(
        null,  // ID will be assigned by database
        pacienteOpt.get(),  // Full Paciente object
        quartoOpt.get(),    // Full Quarto object
        entrada, 
        saida
    );
    
    // 4. Save entity through service/mediator layer
    Estadia savedEstadia = estadiaMediator.save(estadia);
    
    // 5. Convert back to DTO for response
    EstadiaDTO savedDTO = new EstadiaDTO().fromEntityToDTO(savedEstadia);
    
    return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
}
```

### 2.3 DTO to Entity Conversion

Your `fromEntityToDTO` method should extract IDs from entity objects:

```java
public EstadiaDTO fromEntityToDTO(Estadia entity) {
    EstadiaDTO dto = new EstadiaDTO();
    
    dto.setId(entity.getId());
    
    // Safely extract IDs from object references
    if (entity.getPaciente() != null) {
        dto.setPacienteId(entity.getPaciente().getId());
    }
    
    if (entity.getQuarto() != null) {
        dto.setQuartoId(entity.getQuarto().getId());
    }
    
    // Format dates as strings
    if (entity.getDataEntrada() != null) {
        dto.setDataEntrada(entity.getDataEntrada().toString());
    }
    
    if (entity.getDataSaida() != null) {
        dto.setDataSaida(entity.getDataSaida().toString());
    }
    
    return dto;
}
```

### 2.4 Optional: Entity to DTO Conversion Helper

An alternative approach is to add a helper method in your DTO:

```java
// Optional helper method to simplify entity creation from DTO
public Estadia toEntity(Paciente paciente, Quarto quarto) {
    LocalDateTime entrada = dataEntrada != null ? 
        LocalDateTime.parse(dataEntrada) : null;
    
    LocalDateTime saida = dataSaida != null ? 
        LocalDateTime.parse(dataSaida) : null;
    
    return new Estadia(id, paciente, quarto, entrada, saida);
}
```

Then your controller could use it:

```java
// In controller
Estadia estadia = estadiaDTO.toEntity(pacienteOpt.get(), quartoOpt.get());
```

## 3. Service/Mediator Layer

The mediator should work only with fully formed entities:

```java
public class EstadiaMediator {
    // Works with complete entities, not DTOs
    public Estadia save(Estadia estadia) {
        validateEstadia(estadia);
        return estadiaRepository.save(estadia);
    }
    
    // Business validations
    private void validateEstadia(Estadia estadia) {
        if (estadia.getPaciente() == null) {
            throw new IllegalArgumentException("Paciente is required");
        }
        
        if (estadia.getQuarto() == null) {
            throw new IllegalArgumentException("Quarto is required");
        }
        
        // More validations...
    }
}
```

## 4. Repository Layer

The repository should persist entities with their related IDs:

```java
public class EstadiaRepository {
    public Estadia save(Estadia estadia) {
        String sql = "INSERT INTO ESTADIA (ID_PACIENTE, ID_QUARTO, DATA_ENTRADA, DATA_SAIDA) VALUES (?, ?, ?, ?)";
        
        jdbcTemplate.update(sql,
            estadia.getPaciente().getId(),  // Extract ID from Paciente object
            estadia.getQuarto().getId(),    // Extract ID from Quarto object
            estadia.getDataEntrada() != null ? Timestamp.valueOf(estadia.getDataEntrada()) : null,
            estadia.getDataSaida() != null ? Timestamp.valueOf(estadia.getDataSaida()) : null
        );
        
        // Retrieve the saved entity with its new ID
        return findLastInserted();
    }
    
    public Estadia findById(Long id) {
        // Query database and reconstruct full entity with object references
        // This will usually join with related tables or make additional queries
        // to load referenced objects
    }
}
```

## 5. Testing Considerations

When testing controllers that use DTOs, you need to either:

1. Modify your test to use DTOs instead of entities in test requests:

```java
@Test
void testCreateEstadia() throws Exception {
    // Create test data
    EstadiaDTO estadiaDTO = new EstadiaDTO();
    estadiaDTO.setPacienteId(1L);  // ID of pre-created Paciente
    estadiaDTO.setQuartoId(1L);    // ID of pre-created Quarto
    estadiaDTO.setDataEntrada("2023-06-01T10:00:00");
    
    // Test creating an estadia using DTO
    String estadiaDtoJson = objectMapper.writeValueAsString(estadiaDTO);
    mockMvc.perform(post("/api/estadias/create")
            .contentType(MediaType.APPLICATION_JSON)
            .content(estadiaDtoJson))
            .andExpect(status().isCreated());
}
```

2. Or ensure your `Estadia` entity serializes to JSON that resembles the DTO format.

## 6. Benefits of This Approach

1. **Clear Separation of Concerns**:
   - DTOs handle API contracts and data transfer
   - Entities handle domain logic and relationships

2. **Simplified API Interface**:
   - Clients only need to know IDs, not complete object structures

3. **Reduced Data Transfer**:
   - Only necessary data is transferred over the network

4. **Explicit Reference Resolution**:
   - Object references are explicitly resolved at the controller level
   - Failures to resolve references create clear error responses

## 7. Common Pitfalls

1. **NullPointerExceptions**:
   - Always check for null before accessing properties of referenced objects

2. **Circular References**:
   - Be careful with bidirectional relationships that could cause infinite recursion during serialization

3. **Missing References**:
   - Always validate that referenced objects exist before creating an entity

4. **Performance**:
   - Loading full objects can be expensive - consider using projections or batch loading for performance-critical operations
