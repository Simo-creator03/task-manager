package com.example.task_manager_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TaskManagerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagerBackendApplication.class, args);
    }

}
