package com.example.task_manager_backend.validator;

import com.example.task_manager_backend.bean.TaskSaveBean;
import com.example.task_manager_backend.domain.enumeration.TaskStatus;
import com.example.task_manager_backend.exception.InvalidOperationException;
import com.google.common.base.Strings;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class TaskValidator {

    public List<String> validateField(TaskSaveBean bean) {

        List<String> errors = new ArrayList<>();

        if (bean == null) {
            errors.add("Veuillez renseigner le titre de la tâche");
            return errors;
        }

        if (Strings.isNullOrEmpty(bean.getTitle())) {
            errors.add("Veuillez renseigner le titre de la tâche");
        }

        if (bean.getTitle() != null && bean.getTitle().length() > 255) {
            errors.add("Le titre de la tâche ne doit pas dépasser 255 caractères");
        }

        return errors;
    }

    public void validateStatus(String status) {

        if (Strings.isNullOrEmpty(status)) {
            return;
        }

        try {
            TaskStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Le statut = " + status + " n'est pas valide. Valeurs possibles : " + Arrays.toString(TaskStatus.values()));
        }
    }
}
