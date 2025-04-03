# Test Troubleshooting Guide

## Problem

When running the controller tests, the following error occurs:

```
java.lang.IllegalStateException: Failed to load ApplicationContext for [WebMergedContextConfiguration@5e5ddfbc testClass = com.hospital.santajoana.controllers.CamareiraControllerTest, locations = [], classes = [com.hospital.santajoana.SantajoanaApplication], contextInitializerClasses = [], activeProfiles = [], propertySourceDescriptors = [], propertySourceProperties = ["org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTestContextBootstrapper=true"], contextCustomizers = [...], resourceBasePath = "src/main/webapp", contextLoader = org.springframework.boot.test.context.SpringBootContextLoader, parent = null]
```

## Possible Causes and Solutions

### 1. Missing SpringBootTest Annotation in Application Test Class

In your `SantajoanaApplicationTests.java`, the `@SpringBootTest` annotation is missing:

```java
class SantajoanaApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

**Solution**: Add the `@SpringBootTest` annotation:

```java
@SpringBootTest
class SantajoanaApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

### 2. Missing Database Configuration for Tests

The tests may be trying to connect to a database that isn't configured in your test context.

**Solution**: Create a test-specific application properties file:

1. Create a file at `src/test/resources/application.properties` with:
   ```properties
   spring.datasource.url=jdbc:h2:mem:testdb
   spring.datasource.driverClassName=org.h2.Driver
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.datasource.platform=h2
   spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
   database.recreate-tables=false
   ```

2. Add H2 dependency to your `pom.xml`:
   ```xml
   <dependency>
       <groupId>com.h2database</groupId>
       <artifactId>h2</artifactId>
       <scope>test</scope>
   </dependency>
   ```

### 3. Missing Mocked Dependencies

Your controller tests might be missing mocks for dependencies that are required by the controllers.

**Solution**: Ensure all dependencies are mocked in your test classes. Examine the stack trace for specific beans that might be missing.

### 4. Circular Dependencies

The application context might fail to load due to circular dependencies.

**Solution**: Review your beans and mediator classes to ensure there are no circular dependencies.

### 5. Configuration Issues

There might be issues with the configuration classes being loaded during tests.

**Solution**: 
- Try using `@SpringBootTest(webEnvironment = WebEnvironment.MOCK)` instead of `@SpringBootTest(webEnvironment = WebEnvironment.MOCK) `
- Or use `@SpringBootTest(webEnvironment = WebEnvironment.MOCK) ` with more specific configuration: `@SpringBootTest(webEnvironment = WebEnvironment.MOCK) (controllers = YourController.class, useDefaultFilters = false)`

### 6. Import Required Auto-Configurations

Sometimes you need to import specific auto-configurations that your controllers depend on.

**Solution**:
```java
@SpringBootTest(webEnvironment = WebEnvironment.MOCK) (YourController.class)
@Import({YourRequiredConfiguration.class})
public class YourControllerTest {
    // Test code
}
```

### 7. Check for Version Incompatibilities

Ensure all your Spring Boot dependencies are compatible with each other.

**Solution**: Review your `pom.xml` to make sure you're using compatible versions of Spring Boot dependencies.

## Next Steps

1. Check the detailed stack trace for more specific error messages
2. Review the specific beans that might be failing to initialize
3. Try running tests with more debug info: 
   - Add `logging.level.org.springframework=DEBUG` to your test properties
   - Run with `-Dspring.profiles.active=test` VM argument

If specific beans are mentioned in the stack trace error, focus on resolving those particular dependency issues first.
