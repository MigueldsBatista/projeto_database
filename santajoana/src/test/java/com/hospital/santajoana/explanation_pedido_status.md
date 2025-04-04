# Status Pedido vs Status Paciente Serialization Issue

## Problem Identification

The `StatusPedido` enum in `Pedido.java` has a different JSON serialization/deserialization setup compared to `StatusPaciente` in `Paciente.java`. This causes issues when comparing the values in tests.

## Key Differences

1. **JsonValue Annotation**: 
   - `StatusPaciente` uses `@JsonValue` on the `getDescricao()` method, which tells Jackson to use that method's return value for serialization
   - `StatusPedido` does not have this annotation, so Jackson is using the default enum name serialization (like "EM_PREPARO" instead of "Em Preparo")

2. **JsonCreator Implementation**:
   - Both have `@JsonCreator` for deserialization, but are used in different contexts

3. **Test Expectations**:
   - The test expects `$.status` to match `pedido.getStatus().toString()`, but these aren't aligned

## Solution

1. Add `@JsonValue` annotation to the `getDescricao()` method in `StatusPedido` enum
2. Update the test to either:
   - Compare against the raw enum name (`EM_PREPARO`), or
   - Compare against the description string (`Em Preparo`)

The first approach is a more complete fix since it makes the two enums behave consistently.
