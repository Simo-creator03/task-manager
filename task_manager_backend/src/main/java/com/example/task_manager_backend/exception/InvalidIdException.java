package com.example.task_manager_backend.exception;

import lombok.Getter;

public class InvalidIdException extends RuntimeException {

    @Getter
    private final String language;

    public InvalidIdException(String message) {
        super(message);
        language = null;
    }

    public InvalidIdException(String message, String language) {
        super(message);
        this.language = language;
    }
}
