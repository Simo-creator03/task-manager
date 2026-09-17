package com.example.task_manager_backend.util;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class MessageNotification {
    public static final String SUCCES = "1";
    public static final String ERROR = "0";
    private int save = 0;
    private int update = 0;
    private int delete = 0;
    private String statut;
    private String message;
    private List<String> texts;
    private Long id;

    public MessageNotification(String message) {
        this.message = message;
        this.statut = SUCCES;
    }

    public MessageNotification(String statut, String message, List<String> texts) {
        this.statut = statut;
        this.message = message;
        this.texts = texts;
    }

    public MessageNotification(String statut, String message) {
        this.statut = statut;
        this.message = message;
    }

    public MessageNotification(String statut, String message, Long id) {
        this.statut = statut;
        this.message = message;
        this.id = id;
    }

    public MessageNotification(int save, int update, int delete, String statut, String message) {
        this.save = save;
        this.update = update;
        this.delete = delete;
        this.statut = statut;
        this.message = message;
    }

    public MessageNotification(int save, int update, int delete, String statut, String message, Long id) {
        this.save = save;
        this.update = update;
        this.delete = delete;
        this.statut = statut;
        this.message = message;
        this.id = id;
    }


}
