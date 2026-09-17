package com.example.task_manager_backend.mapper;

import java.util.List;

public interface EntityMapper<D, E> {

    D fromEntity(E entity);
    E toEntity(D dto);
    List<D> fromEntities(List<E> entities);
    List<E> toEntities(List<D> entities);
}
