package com.example.task_manager_backend.service.criteria;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskCriteria {
    private String status;
    private String typeClassement;
    private boolean order;
    private Integer limit;
    private Integer page;
}
