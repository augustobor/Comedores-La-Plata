package com.example.demo.dto;

import com.example.demo.models.TipoComedor;

import java.time.LocalDateTime;

public class NoticiaDTO {
    private Long id;
    private String titulo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaUltimaEdicion;;
    // otros campos omitidos

    public NoticiaDTO(
            Long id,
            String titulo,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaUltimaEdicion
    ) {
        this.id = id;
        this.titulo = titulo;
        this.fechaCreacion = fechaCreacion;
        this.fechaUltimaEdicion = fechaUltimaEdicion;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) { this.id = id; }

    public String gettitulo() { return titulo; }
    public void settitulo(String titulo) { this.titulo = titulo; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getfechaUltimaEdicion() { return fechaUltimaEdicion; }
    public void setfechaUltimaEdicion(LocalDateTime fechaUltimaEdicion) { this.fechaUltimaEdicion = fechaUltimaEdicion; }

}
