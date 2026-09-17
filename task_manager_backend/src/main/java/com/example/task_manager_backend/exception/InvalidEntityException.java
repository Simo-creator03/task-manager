package com.example.task_manager_backend.exception;

import lombok.Getter;

import java.util.List;

public class InvalidEntityException extends RuntimeException {

    @Getter
    List<String> errors;

    @Getter
    String language;

    public InvalidEntityException(String message) {
        super(message);
    }

    public InvalidEntityException(String message, String language) {
        super(message);
        this.language = language;
    }

    public InvalidEntityException(String message, List<String> errors) {
        super(message);
        this.errors = errors;
    }

    public InvalidEntityException(String message, String language, List<String> errors) {
        super(message);
        this.errors = errors;
        this.language = language;
    }
}
