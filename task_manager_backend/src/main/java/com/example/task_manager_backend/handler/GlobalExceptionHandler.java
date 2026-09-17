package com.example.task_manager_backend.handler;

import com.example.task_manager_backend.exception.BadCredendialException;
import com.example.task_manager_backend.exception.EntityNotFoundException;
import com.example.task_manager_backend.exception.InvalidEntityException;
import com.example.task_manager_backend.exception.InvalidOperationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorCodes> handlerException(EntityNotFoundException exception) {
        final HttpStatus notFound = HttpStatus.NOT_FOUND;
        final ErrorCodes errorCodes = ErrorCodes.builder()
                .httpCode(notFound.toString())
                .message(exception.getMessage())
                .build();

        return new ResponseEntity<>(errorCodes, notFound);
    }

    @ExceptionHandler(BadCredendialException.class)
    public ResponseEntity<ErrorCodes> handlerException(BadCredendialException exception) {
        final HttpStatus notFound = HttpStatus.BAD_REQUEST;
        final ErrorCodes errorCodes = ErrorCodes.builder()
                .httpCode(notFound.toString())
                .message(exception.getMessage())
                .build();

        return new ResponseEntity<>(errorCodes, notFound);
    }

    @ExceptionHandler(InvalidEntityException.class)
    public ResponseEntity<ErrorCodes> handlerException(InvalidEntityException exception) {
        final HttpStatus notFound = HttpStatus.BAD_REQUEST;
        final ErrorCodes errorCodes = ErrorCodes.builder()
                .httpCode(notFound.toString())
                .message(exception.getMessage())
                .errors(exception.getErrors())
                .build();

        return new ResponseEntity<>(errorCodes, notFound);
    }

    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ErrorCodes> handlerException(InvalidOperationException exception) {
        final HttpStatus notFound = HttpStatus.BAD_REQUEST;
        final ErrorCodes errorCodes = ErrorCodes.builder()
                .httpCode(notFound.toString())
                .message(exception.getMessage())
                .build();

        return new ResponseEntity<>(errorCodes, notFound);
    }
}
