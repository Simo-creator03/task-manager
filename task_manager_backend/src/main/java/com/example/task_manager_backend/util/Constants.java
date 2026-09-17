package com.example.task_manager_backend.util;

import java.util.regex.Pattern;

public interface Constants {
    String AUTH_API = "api/auth";
    String TASK_API = "api/tasks";

    Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"
    );

    Pattern CAMEROON_CONTACT_PATTERN = Pattern.compile(
            "(\\+?237)?" +             // Optional +237 (country code)
                    "6" +                     // Must start with '6'
                    "(" +
                    "(50|51|52|53|54)|" +     // Matches 50 - 54
                    "(55|56|57|58|590|591|592|593|594|595)|" + // Matches 55 - 59 with explicit numeric sub-range
                    "(70|71|72|73|74|75|76|77|78|79)|" +      // Matches 70 - 79
                    "(80|81|82|83)|" +        // Matches 80 - 83
                    "(90|91|92|93|94|95|96|97|98|99)"         // Matches 90 - 99
                    + ")" +
                    "\\d{6}"                     // Matches remaining 6 digits
    );
}
