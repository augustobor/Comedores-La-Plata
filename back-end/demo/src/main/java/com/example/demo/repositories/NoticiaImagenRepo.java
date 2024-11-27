package com.example.demo.repositories;

import com.example.demo.models.NoticiaImagen;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository is an interface that provides access to data in a database
 */
public interface NoticiaImagenRepo extends JpaRepository<NoticiaImagen, Long> {
}
