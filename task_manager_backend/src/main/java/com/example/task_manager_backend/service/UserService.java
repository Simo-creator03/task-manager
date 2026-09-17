package com.example.task_manager_backend.service;

import com.example.task_manager_backend.bean.UserSaveBean;
import com.example.task_manager_backend.domain.User;
import com.example.task_manager_backend.dto.UserDto;

public interface UserService {

    User findByLogin(final String login);

    UserDto save(final UserSaveBean bean);
}
