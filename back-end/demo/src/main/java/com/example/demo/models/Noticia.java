package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Noticias", schema = "schema_1")
public class Noticia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String subTitulo;
    @Column(name = "texto", length = 10000)
    private String texto;   
    private String prioridad;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Campo para la fecha de creación
    private LocalDateTime fechaCreacion;

    // Usuario que editó por última vez
    @ManyToOne
    @JoinColumn(name = "usuario_ultima_edicion_id")
    private Usuario usuarioUltimaEdicion;

    // Fecha de la última edición
    private LocalDateTime fechaUltimaEdicion;

    // Relación Uno a Muchos con Centro (opcional)
    @OneToMany(mappedBy = "noticia", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // Agregado aquí
    private List<NoticiaImagen> imagenes;

}
