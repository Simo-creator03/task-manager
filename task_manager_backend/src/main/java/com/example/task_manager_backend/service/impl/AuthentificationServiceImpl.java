package com.example.task_manager_backend.service.impl;

import com.example.task_manager_backend.bean.AuthenticationRequestBean;
import com.example.task_manager_backend.bean.AuthenticationResponseBean;
import com.example.task_manager_backend.bean.UserSaveBean;
import com.example.task_manager_backend.domain.User;
import com.example.task_manager_backend.exception.InvalidOperationException;
import com.example.task_manager_backend.jwt.JwtUtil;
import com.example.task_manager_backend.service.AuthentificationService;
import com.example.task_manager_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class AuthentificationServiceImpl implements AuthentificationService {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthenticationResponseBean register(UserSaveBean bean) {
        userService.save(bean);

        User user = userService.findByLogin(bean.getLogin());

        String jwtToken = jwtUtil.generateToken(user);

        return AuthenticationResponseBean.builder()
                .accessToken(jwtToken)
                .message("Votre compte a été créé avec succès").build();
    }

    @Override
    public AuthenticationResponseBean authenticateByLoginAndPassword(AuthenticationRequestBean request) {
        User user = userService.findByLogin(request.getLogin());

        boolean response = comparePasswordUserForAuthenticate(request.getPassword(), user.getPassword());

        validFieldAuthenticate(response, user);

        String jwtToken = jwtUtil.generateToken(user);

        return AuthenticationResponseBean.builder()
                .accessToken(jwtToken)
                .message("Vous êtes maintenant connecté à la plateforme").build();
    }

    public boolean comparePasswordUserForAuthenticate(String rawPassword, String passwordEncrypt) {
        return passwordEncoder.matches(rawPassword, passwordEncrypt);
    }

    private void validFieldAuthenticate(boolean response, User user) {
        if (!response) {
            throw new InvalidOperationException("Nom d'utililisateur ou mot de passe incorrect");
        }

        if (!user.isActiver()) {
            throw new InvalidOperationException("Votre compte n'est pas actif");
        }
    }
}
