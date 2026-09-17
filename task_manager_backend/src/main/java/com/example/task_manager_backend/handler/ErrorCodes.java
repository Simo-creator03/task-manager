package com.example.task_manager_backend.handler;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorCodes {

    private String httpCode;

    private String message;

    private List<String> errors;
}
