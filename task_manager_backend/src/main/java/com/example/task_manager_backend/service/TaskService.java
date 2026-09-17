package com.example.task_manager_backend.service;

import com.example.task_manager_backend.bean.TaskSaveBean;
import com.example.task_manager_backend.dto.TaskDto;
import com.example.task_manager_backend.service.criteria.TaskCriteria;
import com.example.task_manager_backend.util.MessageNotification;

import java.util.List;

public interface TaskService {

    List<TaskDto> findTasksOfCurrentUser(final TaskCriteria criteria);

    TaskDto save(final TaskSaveBean bean);

    TaskDto update(final Long id,final TaskSaveBean bean);

    MessageNotification delete(final Long id);
}
