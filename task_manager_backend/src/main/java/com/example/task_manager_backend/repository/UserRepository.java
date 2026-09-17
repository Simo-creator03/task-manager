package com.example.task_manager_backend.repository;

import com.example.task_manager_backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByLogin(String login);
    Optional<User> findByEmail(String email);
    Optional<User> findByTelephone(String telephone);
}
