package com.example.task_manager_backend.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserSaveBean {

    private Long id;
    private String nom;
    private String login;
    private String password;
    private String email;
    private String telephone;
}
