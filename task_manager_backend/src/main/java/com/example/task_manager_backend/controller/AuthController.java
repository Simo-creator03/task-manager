package com.example.task_manager_backend.controller;


import com.example.task_manager_backend.bean.AuthenticationRequestBean;
import com.example.task_manager_backend.bean.AuthenticationResponseBean;
import com.example.task_manager_backend.bean.UserSaveBean;
import com.example.task_manager_backend.controller.api.AuthApi;
import com.example.task_manager_backend.service.AuthentificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthApi {

    private final AuthentificationService authentificationService;

    @Override
    public AuthenticationResponseBean register(final UserSaveBean bean) {
        return authentificationService.register(bean);
    }

    @Override
    public AuthenticationResponseBean login(final AuthenticationRequestBean request) {
        return authentificationService.authenticateByLoginAndPassword(request);
    }
}
