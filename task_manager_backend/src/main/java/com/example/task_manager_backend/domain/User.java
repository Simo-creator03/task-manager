package com.example.task_manager_backend.domain;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @LastModifiedDate
    @Column(name = "derniere_date_modification", nullable = false)
    private LocalDateTime derniereDateModification;

    @Column(name = "nom")
    private String nom;

    @Column(name = "login", nullable = false, unique = true)
    private String login;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "telephone", nullable = false, unique = true)
    private String telephone;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "activer", columnDefinition = "tinyint(1) default 1", nullable = false)
    private boolean activer;

    @PrePersist
    void persist() {
        dateCreation = LocalDateTime.now();
        derniereDateModification = LocalDateTime.now();
    }

    @PreUpdate
    void update() {
        derniereDateModification = LocalDateTime.now();
    }
}
