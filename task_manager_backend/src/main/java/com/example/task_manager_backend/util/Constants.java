package com.example.task_manager_backend.util;

import java.util.regex.Pattern;

public interface Constants {
    String AUTH_API = "api/auth";
    String TASK_API = "api/tasks";

    Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"
    );

    Pattern CAMEROON_CONTACT_PATTERN = Pattern.compile(
            "(\\+?237)?" +
                    "6" +
                    "(" +
                    "(50|51|52|53|54)|" +
                    "(55|56|57|58|590|591|592|593|594|595)|" +
                    "(70|71|72|73|74|75|76|77|78|79)|" +
                    "(80|81|82|83)|" +
                    "(90|91|92|93|94|95|96|97|98|99)"
                    + ")" +
                    "\\d{6}"
    );
}
