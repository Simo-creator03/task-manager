package com.example.task_manager_backend.mapper;

import com.example.task_manager_backend.domain.User;
import com.example.task_manager_backend.dto.UserDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper extends EntityMapper<UserDto, User> {
}
