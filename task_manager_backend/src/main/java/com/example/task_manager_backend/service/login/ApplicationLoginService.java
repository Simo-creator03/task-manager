package com.example.task_manager_backend.service.login;

import com.example.task_manager_backend.domain.User;
import com.example.task_manager_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
@Slf4j
@RequiredArgsConstructor
public class ApplicationLoginService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login) {
        log.debug("loadUserByUsername {}", login);

        Optional<User> utilisateur = userRepository.findByLogin(login);
        if (utilisateur.isEmpty()) {
            throw new UsernameNotFoundException("Nom d'utilisateur ou mot de passe incorrect");
        }

        return createSpringSecurityUser(login, utilisateur.get());
    }

    private org.springframework.security.core.userdetails.User createSpringSecurityUser(String login, User user) {
        if (!user.isActiver()) {
            throw new UsernameNotFoundException("Le compte de l'utilisateur " + login + " n'est pas activé");
        }

        List<GrantedAuthority> grantedAuthorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_USER")
        );

        return new org.springframework.security.core.userdetails.User(user.getLogin(),
                user.getPassword(),
                grantedAuthorities);
    }
}
