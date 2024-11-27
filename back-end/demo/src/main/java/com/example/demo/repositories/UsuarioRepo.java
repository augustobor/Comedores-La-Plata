package com.example.demo.repositories;

import com.example.demo.models.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UsuarioRepo extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByMail(String email);

    boolean existsByMail(String mail);
    boolean existsByUsername(String username);

//    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.mail = :mail AND u.id <> :id")
    boolean existsByMailAndIdNot(String mail, Long id);

//    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.username = :username AND u.id <> :id")
    boolean existsByUsernameAndIdNot(String username, Long id);
}