package com.example.demo.repositories;

import com.example.demo.models.Centro;
import com.example.demo.models.Noticia;
import com.example.demo.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NoticiaRepo extends JpaRepository<Noticia, Long> {

    @Modifying
    @Query("DELETE FROM Noticia n WHERE n.fechaCreacion < :fechaLimite")
    void deleteByFechaCreacionBefore(@Param("fechaLimite") LocalDateTime fechaLimite);

    List<Long> findIdsByFechaCreacionBefore(LocalDateTime fechaLimite);

    @Query(nativeQuery = true, value = "SELECT id FROM schema_1.noticias WHERE fecha_creacion < :fechaLimite")
    List<Long> findIdsByFechaCreacionBeforeNative(@Param("fechaLimite") LocalDateTime fechaLimite);

    List<Noticia> findByUsuario(Usuario user);
}