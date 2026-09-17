package com.example.task_manager_backend.service.impl;

import com.example.task_manager_backend.bean.UserSaveBean;
import com.example.task_manager_backend.domain.User;
import com.example.task_manager_backend.dto.UserDto;
import com.example.task_manager_backend.exception.BadCredendialException;
import com.example.task_manager_backend.exception.InvalidEntityException;
import com.example.task_manager_backend.mapper.UserMapper;
import com.example.task_manager_backend.repository.UserRepository;
import com.example.task_manager_backend.service.UserService;
import com.example.task_manager_backend.validator.UserValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserValidator userValidator;

    @Override
    public User findByLogin(final String login) {
        return userRepository.findByLogin(login).orElseThrow(() ->
                new BadCredendialException("L'utilisateur avec le login = " + login + " n'a pas été trouvé dans le système")
        );
    }

    @Override
    public UserDto save(final UserSaveBean bean) {

        UserDto dto = setUserDto(bean);

        verifyElementOfUser(bean, dto);

        User entity = userMapper.toEntity(dto);
        entity.setPassword(passwordEncoder.encode(bean.getPassword()));
        entity.setActiver(true);

        User saved = userRepository.save(entity);

        return userMapper.fromEntity(saved);
    }

    private void verifyElementOfUser(final UserSaveBean bean,final UserDto dto) {
        List<String> errors = userValidator.validateField(bean);
        if (!errors.isEmpty()) {
            log.error("UserSaveBean not valid, {}", dto);
            throw new InvalidEntityException("L'utilisateur n'est pas valide", errors);
        }

        userValidator.validateEntity(dto);
    }

    private UserDto setUserDto(final UserSaveBean bean) {
        return UserDto.builder()
                .id(bean.getId())
                .nom(bean.getNom())
                .login(bean.getLogin())
                .email(bean.getEmail())
                .telephone(bean.getTelephone())
                .build();
    }
}
