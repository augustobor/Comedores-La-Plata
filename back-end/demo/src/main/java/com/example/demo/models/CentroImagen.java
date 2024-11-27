package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "CentroImagenes", schema = "schema_1")
public class CentroImagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private byte[] datos;

    // Relación Muchos a Uno con Centro
    @ManyToOne
    @JoinColumn(name = "centro_id", nullable = false)  // Nombre de la columna FK en la tabla Imagenes
    @JsonBackReference  // Agregado aquí
    private Centro centro;

}
