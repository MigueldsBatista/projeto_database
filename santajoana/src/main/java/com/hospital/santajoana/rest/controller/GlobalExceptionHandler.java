package com.hospital.santajoana.rest.controller;


import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;


/*
 * Essa classe é responsáveis por tratar as exceções lançadas pela aplicação e traduzir nos codigos de status HTTP corretos
 */
@RestControllerAdvice//RestControllerAdvice é uma especialização de @ControllerAdvice que adiciona @ResponseBody para fazer com que o retorno seja serializado em JSON ou XML, dependendo do tipo de requisição.
public class GlobalExceptionHandler {

    // Classe interna para padronizar o formato de erro
    public record ErrorResponse(
        int status,
        String errorCode,
        String message,
        LocalDateTime timestamp
    ) {
        public ErrorResponse(int status, String errorCode, String message) {
            this(status, errorCode, message, LocalDateTime.now());
        }
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ErrorResponse> handleConflictExceptions(RuntimeException ex) {
        return this.buildResponse(
            HttpStatus.CONFLICT.value(),
            "RESOURCE_CONFLICT",
            ex.getMessage()
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityExceptions(RuntimeException ex) {
        return this.buildResponse(
            HttpStatus.CONFLICT.value(),
            "DATA_INTEGRITY_VIOLATION",
            ex.getMessage()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestExceptions(RuntimeException ex) {
        return this.buildResponse(
            HttpStatus.BAD_REQUEST.value(),
            "INVALID_REQUEST",
            ex.getMessage()
        );
    }

    // Tratamento para exceções de validação
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining("; "));

        return this.buildResponse(
            HttpStatus.BAD_REQUEST.value(),
            "VALIDATION_ERROR",
            errorMessage
        );
    }
    
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpNotReadableException(MethodArgumentNotValidException ex) {

        return this.buildResponse(
            HttpStatus.BAD_REQUEST.value(),
            "VALIDATION_ERROR",
           ex.getMessage()
        );
    }


    // Catch-all para exceções não mapeadas
    // @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        return this.buildResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "INTERNAL_ERROR",
            "Exceção não tradata: " +ex+" "+ex.getMessage()
        );
    }


    private ResponseEntity<ErrorResponse> buildResponse(int status, String errorCode, String message) {
        return ResponseEntity
        .status(status)
        .body(new ErrorResponse(status, errorCode, message));
    }
}
// Essa classe é responsável por tratar as exceções lançadas pela aplicação e traduzir nos codigos de status HTTP corretos