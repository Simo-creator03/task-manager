package com.example.task_manager_backend.controller.api;

import com.example.task_manager_backend.bean.AuthenticationRequestBean;
import com.example.task_manager_backend.bean.AuthenticationResponseBean;
import com.example.task_manager_backend.bean.UserSaveBean;
import com.example.task_manager_backend.util.Constants;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Api("auth-api")
public interface AuthApi {

    @ApiOperation(value = "Inscription d'un utilisateur",
            notes = "Cette méthode permet de créer un compte utilisateur", response = AuthenticationResponseBean.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "L'utilisateur a été créé avec succès"),
            @ApiResponse(code = 400, message = "L'objet n'est pas valide")
    })
    @PostMapping(value = Constants.AUTH_API + "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    AuthenticationResponseBean register(@RequestBody UserSaveBean bean);

    @ApiOperation(value = "Connexion à la plateforme",
            notes = "Cette méthode permet de s'authentifier à l'application", response = AuthenticationResponseBean.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "L'utilisateur a été authentifié avec succès"),
            @ApiResponse(code = 400, message = "L'objet n'est pas valide"),
            @ApiResponse(code = 404, message = "Aucun utilisateur n'existe dans le système avec ce login")
    })
    @PostMapping(value = Constants.AUTH_API + "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    AuthenticationResponseBean login(@RequestBody AuthenticationRequestBean request);
}
