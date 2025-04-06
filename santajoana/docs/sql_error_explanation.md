# SQL Error Analysis: Bad Grammar in Query

## Error Details

```
jakarta.servlet.ServletException: Request processing failed: org.springframework.jdbc.BadSqlGrammarException: 
StatementCallback; bad SQL grammar [SELECT * FROM CATEGORIA_QUARTO ORDER BY ID_CATEGORIA DESC LIMIT 1]
```

## Root Causes

There are several possible reasons for this "Bad SQL Grammar" error:

1. **Column name mismatch**: 
   - The error suggests that `ID_CATEGORIA` might not be the correct column name 
   - The actual column name is likely `ID_CATEGORIA_QUARTO` based on your entity class

2. **Database compatibility issue with LIMIT**:
   - Some databases (like Oracle) don't support the `LIMIT` keyword
   - If you're using Oracle, you would need to use `ROWNUM` instead

3. **Table name error**:
   - Verify that `CATEGORIA_QUARTO` is the exact table name in your database
   - Check for case sensitivity issues depending on your database configuration

## Suggested Fix

Replace your current query in the `CategoriaQuartoRepository` with one of these:

```java
// For most databases (MySQL, PostgreSQL):
String sql = "SELECT * FROM CATEGORIA_QUARTO ORDER BY ID_CATEGORIA_QUARTO DESC LIMIT 1";

// For Oracle:
String sql = "SELECT * FROM (SELECT * FROM CATEGORIA_QUARTO ORDER BY ID_CATEGORIA_QUARTO DESC) WHERE ROWNUM <= 1";
```

Make sure the column name matches exactly what's defined in your database schema.

## Prevention Tips

1. Always verify column and table names against your actual database schema
2. Consider using database-specific dialect features in Spring JPA when writing custom queries
3. For BaseRepository implementations, make sure the ID column name parameter matches the actual database column
