package com.example.task_manager_backend.controller.api;

import com.example.task_manager_backend.bean.TaskSaveBean;
import com.example.task_manager_backend.dto.TaskDto;
import com.example.task_manager_backend.util.Constants;
import com.example.task_manager_backend.util.MessageNotification;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api("task-api")
public interface TaskApi {

    @ApiOperation(value = "Liste des tâches de l'utilisateur connecté",
            notes = "Cette méthode permet de retourner les tâches de l'utilisateur connecté", response = TaskDto.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Les tâches ont été retournées avec succès"),
            @ApiResponse(code = 400, message = "Le statut renseigné n'est pas valide")
    })
    @GetMapping(value = Constants.TASK_API, produces = MediaType.APPLICATION_JSON_VALUE)
    List<TaskDto> findTasksOfCurrentUser(@RequestParam(value = "status", required = false) String status);

    @ApiOperation(value = "Création d'une tâche",
            notes = "Cette méthode permet de créer une tâche pour l'utilisateur connecté", response = TaskDto.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "La tâche a été créée avec succès"),
            @ApiResponse(code = 400, message = "L'objet n'est pas valide")
    })
    @PostMapping(value = Constants.TASK_API, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    TaskDto saveTask(@RequestBody TaskSaveBean bean);

    @ApiOperation(value = "Modification d'une tâche",
            notes = "Cette méthode permet de modifier une tâche de l'utilisateur connecté", response = TaskDto.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "La tâche a été modifiée avec succès"),
            @ApiResponse(code = 400, message = "L'objet n'est pas valide"),
            @ApiResponse(code = 404, message = "La tâche n'a pas été trouvée")
    })
    @PutMapping(value = Constants.TASK_API + "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    TaskDto updateTask(@PathVariable("id") Long id, @RequestBody TaskSaveBean bean);

    @ApiOperation(value = "Suppression d'une tâche",
            notes = "Cette méthode permet de supprimer une tâche de l'utilisateur connecté", response = MessageNotification.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "La tâche a été supprimée avec succès"),
            @ApiResponse(code = 404, message = "La tâche n'a pas été trouvée")
    })
    @DeleteMapping(value = Constants.TASK_API + "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    MessageNotification deleteTask(@PathVariable("id") Long id);
}
