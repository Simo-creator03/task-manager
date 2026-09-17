package com.example.task_manager_backend.validator;

import com.example.task_manager_backend.bean.UserSaveBean;
import com.example.task_manager_backend.domain.User;
import com.example.task_manager_backend.dto.UserDto;
import com.example.task_manager_backend.exception.InvalidOperationException;
import com.example.task_manager_backend.repository.UserRepository;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.example.task_manager_backend.util.Constants.CAMEROON_CONTACT_PATTERN;
import static com.example.task_manager_backend.util.Constants.EMAIL_PATTERN;

@RequiredArgsConstructor
@Service
public class UserValidator {
    private final UserRepository userRepository;

    public List<String> validateField(UserSaveBean bean) {

        List<String> errors = new ArrayList<>();

        if (bean == null) {
            errors.add("Veuillez renseigner votre nom");
            errors.add("Veuillez renseigner votre login");
            errors.add("Veuillez renseigner votre mot de passe");
            errors.add("Veuillez renseigner votre email");
            errors.add("Veuillez renseigner votre numéro de téléphone");
            return errors;
        }

        if (Strings.isNullOrEmpty(bean.getNom())) {
            errors.add("Veuillez renseigner votre nom");
        }

        if (Strings.isNullOrEmpty(bean.getLogin())) {
            errors.add("Veuillez renseigner votre login");
        }

        if (Strings.isNullOrEmpty(bean.getPassword())) {
            errors.add("Veuillez renseigner votre mot de passe");
        }

        if (Strings.isNullOrEmpty(bean.getEmail())) {
            errors.add("Veuillez renseigner votre email");
        } else if (!EMAIL_PATTERN.matcher(bean.getEmail()).matches()) {
            errors.add("L'email entré n'est pas valide");
        }

        if (Strings.isNullOrEmpty(bean.getTelephone())) {
            errors.add("Veuillez renseigner votre numéro de téléphone");
        } else if (!CAMEROON_CONTACT_PATTERN.matcher(bean.getTelephone()).matches()) {
            errors.add("Le numéro entré n'est pas un numéro valide au Cameroun");
        }

        return errors;
    }

    public void validateEntity(UserDto dto) {

        Optional<User> user = userRepository.findByLogin(dto.getLogin());
        if (user.isPresent() && !user.get().getId().equals(dto.getId())) {
            throw new InvalidOperationException("Ce login est déjà utilisé");
        }

        user = userRepository.findByTelephone(dto.getTelephone());
        if (user.isPresent() && !user.get().getId().equals(dto.getId())) {
            throw new InvalidOperationException("Ce numéro de téléphone est déjà utilisé");
        }

        user = userRepository.findByEmail(dto.getEmail());
        if (user.isPresent() && !user.get().getId().equals(dto.getId())) {
            throw new InvalidOperationException("Cet email est déjà utilisé");
        }
    }
}
