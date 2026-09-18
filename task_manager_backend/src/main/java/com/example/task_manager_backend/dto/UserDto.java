package com.example.task_manager_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String nom;
    private String login;
    private String email;
    private String telephone;
    private boolean activer;
    private LocalDateTime dateCreation;
}
