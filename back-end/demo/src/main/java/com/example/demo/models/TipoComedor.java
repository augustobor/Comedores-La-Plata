package com.example.demo.models;

public enum TipoComedor {
    COMEDOR_COMUNITARIO("Ofrecen almuerzo y en pocos casos una cena."),
    MERENDERO("Ofrecen meriendas puntualmente para niños y adolescentes."),
    COPA_DE_LECHE("Ofrecen un refuerzo nutricional basado en leche y productos panificados. Es como un merendero pero con muchos menos recursos."),
    DISTRIBUIDORA_DE_ALIMENTOS("Ofrecen bolsones de alimentos para que cocinen en sus hogares."),
    CENTRO_DE_PRODUCCION_DE_VIANDAS("Cocinan viandas para distribuir para personas puntuales, como personas en situación de calle.");

    private final String descripcion;

    TipoComedor(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
