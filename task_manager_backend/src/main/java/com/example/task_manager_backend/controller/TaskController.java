package com.example.task_manager_backend.controller;

import com.example.task_manager_backend.bean.TaskSaveBean;
import com.example.task_manager_backend.controller.api.TaskApi;
import com.example.task_manager_backend.dto.TaskDto;
import com.example.task_manager_backend.service.TaskService;
import com.example.task_manager_backend.service.criteria.TaskCriteria;
import com.example.task_manager_backend.util.MessageNotification;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TaskController implements TaskApi {

    private final TaskService taskService;

    @Override
    public List<TaskDto> findTasksOfCurrentUser(final String status) {
        TaskCriteria criteria = TaskCriteria.builder()
                .status(status)
                .typeClassement("createdAt")
                .order(false)
                .build();

        return taskService.findTasksOfCurrentUser(criteria);
    }

    @Override
    public TaskDto saveTask(final TaskSaveBean bean) {
        return taskService.save(bean);
    }

    @Override
    public TaskDto updateTask(final Long id,final TaskSaveBean bean) {
        return taskService.update(id, bean);
    }

    @Override
    public MessageNotification deleteTask(final Long id) {
        return taskService.delete(id);
    }
}
