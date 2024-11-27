package com.example.demo.dto;

import com.example.demo.models.TipoComedor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CentroDTO {
    private Long id;
    private String nombre;
    private TipoComedor tipoComedor;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaUltimaEdicion;;
    // otros campos omitidos

    public CentroDTO(
            Long id,
            String nombre,
            TipoComedor tipoComedor,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaUltimaEdicion
    ) {
        this.id = id;
        this.nombre = nombre;
        this.tipoComedor = tipoComedor;
        this.fechaCreacion = fechaCreacion;
        this.fechaUltimaEdicion = fechaUltimaEdicion;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) { this.id = id; }

    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public TipoComedor getTipoComedor() { return tipoComedor; }
    public void setTipoComedor(TipoComedor tipoComedor) { this.tipoComedor = tipoComedor; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getfechaUltimaEdicion() { return fechaUltimaEdicion; }
    public void setfechaUltimaEdicion(LocalDateTime fechaUltimaEdicion) { this.fechaUltimaEdicion = fechaUltimaEdicion; }

}
