package com.example.task_manager_backend.repository.specification;

import com.example.task_manager_backend.domain.Task;
import com.example.task_manager_backend.domain.enumeration.TaskStatus;
import com.example.task_manager_backend.service.criteria.TaskCriteria;
import org.springframework.data.jpa.domain.Specification;

import static com.google.common.base.Strings.isNullOrEmpty;

public class TaskSpecification {

    private TaskSpecification() {
    }

    private static Specification<Task> withUser(final Long userId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("user").get("id"), userId);
    }

    private static Specification<Task> withStatus(final TaskStatus status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Task> getSpecification(final Long userId,final  TaskCriteria criteria) {

        Specification<Task> specification = withUser(userId);

        if (!isNullOrEmpty(criteria.getStatus())) {
            specification = specification.and(withStatus(TaskStatus.valueOf(criteria.getStatus())));
        }

        return specification;
    }
}
