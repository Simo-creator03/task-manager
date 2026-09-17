package com.example.task_manager_backend.util;

import com.google.common.base.Strings;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.lang.reflect.Field;
import java.time.format.DateTimeFormatter;

public class MethodUtils {

    private MethodUtils() {

    }
    public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyMMdd_HHmmss");

    public static Pageable findAllByCriteria(boolean classement, String typeClassement, Integer nombreDeResultat, Object criteria, Integer page) {
        Sort sort;
        if (Strings.isNullOrEmpty(typeClassement)) {
            typeClassement = "id";
        }
        if (Boolean.FALSE.equals(classement)) {
            sort = Sort.by(typeClassement).descending();
        } else {
            sort = Sort.by(typeClassement).ascending();
        }

        try {
            Field field = criteria.getClass().getDeclaredField("typeClassement");
            field.setAccessible(true);
            field.set(criteria, typeClassement);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }

        return PageRequest.of(page != null ? page : 0, nombreDeResultat == null || nombreDeResultat < 0
                ? Integer.MAX_VALUE : nombreDeResultat, sort);
    }

    public static boolean isNullOrEmpty(final String str) {
        return str == null || str.isEmpty();
    }
}
