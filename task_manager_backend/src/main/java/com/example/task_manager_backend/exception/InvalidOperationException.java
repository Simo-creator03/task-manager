package com.example.task_manager_backend.exception;

import lombok.Getter;

import java.util.List;

public class InvalidOperationException extends RuntimeException {

    @Getter
    List<String> errors;

    @Getter
    String language;

    public InvalidOperationException(String message) {
        super(message);
    }

    public InvalidOperationException(String message, List<String> errors) {
        super(message);
        this.errors = errors;
    }

    public InvalidOperationException(String message, String language, List<String> errors) {
        super(message);
        this.errors = errors;
        this.language = language;
    }
}
