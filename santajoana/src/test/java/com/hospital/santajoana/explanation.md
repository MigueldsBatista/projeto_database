# Estadia Tests Fix Explanation

## Issue
The tests in `EstadiaControllerTest` were failing when run together but passing in isolation due to a common issue in integration tests - the assumption about entity IDs.

## Root Causes

1. **Hardcoded ID References**: The tests were using hardcoded IDs (like `1L`) assuming they would be consistent across all test executions.

2. **Database Reset Between Tests**: The `@AfterEach` cleanup method truncates all tables, but when tests run sequentially, they can't rely on consistent IDs.

3. **Transaction Isolation**: Even with `@Transactional`, when multiple tests run in sequence, database IDs can be incremented even if transactions are rolled back.

## Solution Implemented

1. **Retrieve Actual IDs**: Modified the `createDefaultEstadia()` method to return the actual created Estadia with its generated ID from the API response.

2. **Dynamic ID References**: Updated all test methods to use the actual IDs from created entities instead of hardcoded values.

3. **Consistent Entity References**: Fixed tests to verify against actual returned values (e.g., `estadia.getPacienteId()`) rather than assumed values.

## Key Changes

1. In `testCreateEstadia()`, we now retrieve the created Paciente and Quarto IDs dynamically.

2. In `testGetEstadiaById()`, we now verify against the actual Paciente and Quarto IDs in the created Estadia.

3. In `testUpdateEstadia()` and `testDeleteEstadia()`, we now use the actual ID of the created Estadia.

This approach makes tests more robust and independent, allowing them to run in any order without interference.
