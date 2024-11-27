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
@Table(name = "Centros", schema = "schema_1")
public class Centro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    @Column(name = "descripcion", length = 10000)
    private String descripcion;
    @Enumerated(EnumType.STRING)
    private TipoComedor tipoComedor;

    private String formattedAddress;
    private String latitud;
    private String longitud;

    private String nombreDueño;
    private String telefonoDueño;
    private String mailDueño;

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
    @OneToMany(mappedBy = "centro", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // Agregado aquí
    private List<CentroImagen> imagenes;

}
