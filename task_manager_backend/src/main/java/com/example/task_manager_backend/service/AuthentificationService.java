package com.example.task_manager_backend.service;

import com.example.task_manager_backend.bean.AuthenticationRequestBean;
import com.example.task_manager_backend.bean.AuthenticationResponseBean;
import com.example.task_manager_backend.bean.UserSaveBean;

public interface AuthentificationService {

    AuthenticationResponseBean register(final UserSaveBean bean);

    AuthenticationResponseBean authenticateByLoginAndPassword(final AuthenticationRequestBean request);
}
