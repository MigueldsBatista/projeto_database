# DTO Implementation Guide for Multi-Layer Application

This guide explains how DTOs (Data Transfer Objects) should be used in a multi-layer application, using the Estadia entity as an example.

## 1. Understanding DTOs in Your Architecture

DTOs serve as a contract between the client and the server. They:

- Transfer only necessary data across layers
- Hide implementation details from clients
- Prevent direct exposure of domain entities
- Allow for different views of the same data

## 2. Flow of Data Through Layers

### JSON → Controller → Mediator → Repository → Database

```
Client (JSON) ↔ Controller (DTO) ↔ Mediator (Domain Entity) ↔ Repository (SQL)
```

## 3. EstadiaDTO Use Case

### 3.1 Client Request with JSON

The client sends a minimal JSON payload:

```json
{
  "pacienteId": 1,
  "quartoId": 1,
  "dataEntrada": "2023-06-01T10:00:00",
  "dataSaida": null
}
```

Notice that this matches your `EstadiaDTO` fields, not the full `Estadia` entity.

### 3.2 Controller Layer Implementation

```java
@RestController
@RequestMapping("/api/estadias")
public class EstadiaController extends BaseController<Estadia> {
    
    private final EstadiaMediator estadiaMediator;
    private final PacienteMediator pacienteMediator;
    private final QuartoMediator quartoMediator;
    
    // Constructor with injections...
    
    @PostMapping("/create")
    public ResponseEntity<EstadiaDTO> createEstadia(@RequestBody EstadiaDTO estadiaDTO) {
        // 1. Convert DTO to Entity
        Estadia estadia = dtoToEntity(estadiaDTO);
        
        // 2. Save Entity using mediator
        Estadia savedEstadia = estadiaMediator.save(estadia);
        
        // 3. Convert saved Entity back to DTO for response
        EstadiaDTO responseDTO = new EstadiaDTO().fromEntityToDTO(savedEstadia);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EstadiaDTO> getEstadiaById(@PathVariable Long id) {
        Optional<Estadia> estadiaOpt = estadiaMediator.findById(id);
        
        if (estadiaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Convert Entity to DTO
        EstadiaDTO estadiaDTO = new EstadiaDTO().fromEntityToDTO(estadiaOpt.get());
        return ResponseEntity.ok(estadiaDTO);
    }
    
    @GetMapping
    public ResponseEntity<List<EstadiaDTO>> getAllEstadias() {
        List<Estadia> estadias = estadiaMediator.findAll();
        
        // Convert list of entities to list of DTOs
        List<EstadiaDTO> estadiaDTOs = new EstadiaDTO().fromEntitiesToDtos(estadias);
        
        return ResponseEntity.ok(estadiaDTOs);
    }
    
    // Helper method to convert DTO to Entity
    private Estadia dtoToEntity(EstadiaDTO dto) {
        // Get referenced entities from their repositories
        Paciente paciente = pacienteMediator.findById(dto.getPacienteId())
            .orElseThrow(() -> new ResourceNotFoundException("Paciente not found"));
            
        Quarto quarto = quartoMediator.findById(dto.getQuartoId())
            .orElseThrow(() -> new ResourceNotFoundException("Quarto not found"));
        
        // Parse dates if not null
        LocalDateTime dataEntrada = dto.getDataEntrada() != null 
            ? LocalDateTime.parse(dto.getDataEntrada()) 
            : LocalDateTime.now();
            
        LocalDateTime dataSaida = dto.getDataSaida() != null 
            ? LocalDateTime.parse(dto.getDataSaida()) 
            : null;
        
        // Create and return new Estadia entity
        return new Estadia(dto.getId(), paciente, quarto, dataEntrada, dataSaida);
    }
}
```

### 3.3 DTO Implementation

The `EstadiaDTO` should implement conversions from entity to DTO and vice versa:

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstadiaDTO implements DTO<Estadia> {
    Long id;
    Long pacienteId;
    Long quartoId;
    String dataEntrada;
    String dataSaida;

    @Override
    public EstadiaDTO fromEntityToDTO(Estadia entity) {
        EstadiaDTO dto = new EstadiaDTO();
        dto.setId(entity.getId());
        dto.setPacienteId(entity.getPaciente().getId());
        dto.setQuartoId(entity.getQuarto().getId());
        
        if (entity.getDataEntrada() != null) {
            dto.setDataEntrada(entity.getDataEntrada().toString());
        }
        
        if (entity.getDataSaida() != null) {
            dto.setDataSaida(entity.getDataSaida().toString());
        }
        
        return dto;
    }

    @Override
    public List<EstadiaDTO> fromEntitiesToDtos(List<Estadia> entities) {
        List<EstadiaDTO> dtos = new ArrayList<>();
        for (Estadia entity : entities) {
            dtos.add(fromEntityToDTO(entity));
        }
        return dtos;
    }
}
```

### 3.4 Mediator Layer

```java
@Service
public class EstadiaMediator extends BaseMediator<Estadia> {
    private final PacienteMediator pacienteMediator;
    private final QuartoMediator quartoMediator;
    
    public EstadiaMediator(EstadiaRepository repository, 
                          PacienteMediator pacienteMediator,
                          QuartoMediator quartoMediator) {
        super(repository);
        this.pacienteMediator = pacienteMediator;
        this.quartoMediator = quartoMediator;
    }
    
    // Business logic and validation
    @Override
    public Estadia save(Estadia estadia) {
        // Business rules validation
        validateEstadia(estadia);
        
        // Save to repository
        return super.save(estadia);
    }
    
    private void validateEstadia(Estadia estadia) {
        // Example validation: check if quarto is available
        // Example validation: check if paciente exists
    }
}
```

### 3.5 Repository Layer

```java
@Repository
public class EstadiaRepository extends BaseRepository<Estadia> {
    // Implementation as in your current code
    // The repository works directly with domain entities
}
```

## 4. Benefits of This Approach

1. **Separation of Concerns**: 
   - Controllers only handle HTTP requests/responses and DTOs
   - Mediators handle business logic with domain entities
   - Repositories handle database operations

2. **Data Security**: 
   - Only necessary data is exposed to the client
   - Internal implementation details remain hidden

3. **Flexibility**: 
   - Can modify entity structure without changing API contract
   - Can present different views of the same data

4. **Performance**: 
   - Only necessary data is transferred over the network

## 5. Common Pitfalls

1. **Unnecessary Conversions**: Avoid converting between DTOs and entities multiple times
2. **Inconsistent Validation**: Ensure validation happens at the right layer (usually mediator)
3. **Circular Dependencies**: Be cautious with bidirectional relationships

## 6. Recommendations

1. Use DTOs consistently across all controllers
2. Keep DTOs simple and focused on client needs
3. Consider using mapping libraries for complex objects (ModelMapper, MapStruct)
4. Document DTOs with OpenAPI annotations for better API documentation
