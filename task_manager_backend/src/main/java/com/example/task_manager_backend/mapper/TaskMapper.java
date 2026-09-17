package com.example.task_manager_backend.mapper;

import com.example.task_manager_backend.domain.Task;
import com.example.task_manager_backend.dto.TaskDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper extends EntityMapper<TaskDto, Task> {
}
