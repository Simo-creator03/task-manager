package com.example.task_manager_backend.exception;

import lombok.Getter;

public class EntityNotFoundException extends RuntimeException {

    @Getter
    private String language;

    public EntityNotFoundException(String message) {
        super(message);
    }

    public EntityNotFoundException(String message, String language) {
        super(message);
        this.language = language;
    }
}
