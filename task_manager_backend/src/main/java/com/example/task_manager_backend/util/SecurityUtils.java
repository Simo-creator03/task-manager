package com.example.task_manager_backend.util;

import com.example.task_manager_backend.exception.InvalidOperationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.stream.Stream;

public class SecurityUtils {


    public static String getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Optional<String> currentUserLogin = Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
        if (currentUserLogin.isEmpty()) {
            throw new InvalidOperationException("Aucun utilisateur connecté");
        }
        return currentUserLogin.get();
    }

    public static String getCurrentUserLoginOrNull() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Optional<String> currentUserLogin = Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
        return currentUserLogin.orElse(null);
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails) {
            UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof String) {
            return (String) authentication.getPrincipal();
        }
        return null;
    }


    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication.getPrincipal() instanceof String
                && "anonymousUser".equals(authentication.getPrincipal()));
    }


    public static boolean hasCurrentUserThisAuthority(String authority) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && getAuthorities(authentication).anyMatch(authority::equals);
    }

    private static Stream<String> getAuthorities(Authentication authentication) {
        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority);
    }
}
