package com.example.task_manager_backend.service.impl;

import com.example.task_manager_backend.bean.TaskSaveBean;
import com.example.task_manager_backend.domain.Task;
import com.example.task_manager_backend.domain.User;
import com.example.task_manager_backend.domain.enumeration.TaskStatus;
import com.example.task_manager_backend.dto.TaskDto;
import com.example.task_manager_backend.exception.BadCredendialException;
import com.example.task_manager_backend.exception.EntityNotFoundException;
import com.example.task_manager_backend.exception.InvalidEntityException;
import com.example.task_manager_backend.exception.InvalidOperationException;
import com.example.task_manager_backend.mapper.TaskMapper;
import com.example.task_manager_backend.repository.TaskRepository;
import com.example.task_manager_backend.repository.UserRepository;
import com.example.task_manager_backend.repository.specification.TaskSpecification;
import com.example.task_manager_backend.service.TaskService;
import com.example.task_manager_backend.service.criteria.TaskCriteria;
import com.example.task_manager_backend.util.MessageNotification;
import com.example.task_manager_backend.util.MethodUtils;
import com.example.task_manager_backend.util.SecurityUtils;
import com.example.task_manager_backend.validator.TaskValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;
    private final TaskValidator taskValidator;

    @Override
    public List<TaskDto> findTasksOfCurrentUser(TaskCriteria criteria) {

        User user = getCurrentUser();

        taskValidator.validateStatus(criteria.getStatus());

        if (!MethodUtils.isNullOrEmpty(criteria.getStatus())) {
            criteria.setStatus(criteria.getStatus().toUpperCase(Locale.ROOT));
        }

        if (MethodUtils.isNullOrEmpty(criteria.getTypeClassement())) {
            criteria.setTypeClassement("createdAt");
        }

        Pageable p = MethodUtils.findAllByCriteria(criteria.isOrder(), criteria.getTypeClassement(), criteria.getLimit(), criteria, criteria.getPage());

        List<Task> tasks = taskRepository.findAll(TaskSpecification.getSpecification(user.getId(), criteria), p).getContent();

        return taskMapper.fromEntities(tasks);
    }

    @Override
    public TaskDto save(final TaskSaveBean bean) {

        verifyElementOfTask(bean);

        Task task = Task.builder()
                .title(bean.getTitle())
                .description(bean.getDescription())
                .status(bean.getStatus() == null ? TaskStatus.TODO : bean.getStatus())
                .user(getCurrentUser())
                .build();

        return taskMapper.fromEntity(taskRepository.save(task));
    }

    @Override
    public TaskDto update(Long id, TaskSaveBean bean) {

        verifyElementOfTask(bean);

        Task task = findByIdAndCurrentUser(id);

        task.setTitle(bean.getTitle());
        task.setDescription(bean.getDescription());

        if (bean.getStatus() != null) {
            task.setStatus(bean.getStatus());
        }

        return taskMapper.fromEntity(taskRepository.save(task));
    }

    @Override
    public MessageNotification delete(Long id) {

        Task task = findByIdAndCurrentUser(id);

        taskRepository.delete(task);

        return new MessageNotification("La tâche a été supprimée avec succès");
    }

    private void verifyElementOfTask(TaskSaveBean bean) {
        List<String> errors = taskValidator.validateField(bean);
        if (!errors.isEmpty()) {
            log.error("TaskSaveBean not valid, {}", bean);
            throw new InvalidEntityException("La tâche n'est pas valide", errors);
        }
    }

    private Task findByIdAndCurrentUser(Long id) {

        if (id == null) {
            throw new InvalidEntityException("Veuillez renseigner l'identifiant de la tâche");
        }

        User user = getCurrentUser();

        Task task = taskRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("La tâche avec l'ID = " + id + " n'a pas été trouvée dans le système")
        );

        if (!task.getUser().getId().equals(user.getId())) {
            throw new InvalidOperationException("Cette tâche ne vous appartient pas");
        }

        return task;
    }

    private User getCurrentUser() {
        return userRepository.findByLogin(SecurityUtils.getCurrentUserLogin()).orElseThrow(() ->
                new BadCredendialException("L'utilisateur connecté n'a pas été trouvé dans le système")
        );
    }
}
