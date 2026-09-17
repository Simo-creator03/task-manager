package com.example.task_manager_backend.bean;


import com.example.task_manager_backend.domain.enumeration.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TaskSaveBean {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
}
