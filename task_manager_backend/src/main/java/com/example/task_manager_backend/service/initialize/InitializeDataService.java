package com.example.task_manager_backend.service.initialize;

import com.example.task_manager_backend.domain.User;
import com.example.task_manager_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
public class InitializeDataService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        saveUtilisateur();
    }

    private void saveUtilisateur() {
        if (userRepository.findByLogin("nelson").isEmpty()) {
            User utilisateur = User.builder()
                    .login("nelson")
                    .nom("nelson")
                    .telephone("693366388")
                    .email("nelsonkuetche0@gmail.com")
                    .password(passwordEncoder.encode("12345"))
                    .activer(true)
                    .build();

            userRepository.save(utilisateur);
        }
    }
}
