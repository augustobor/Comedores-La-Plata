package com.example.demo.repositories;

import com.example.demo.models.Centro;

import com.example.demo.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CentroRepo extends JpaRepository<Centro, Long> {

    // Query personalizada para obtener solo ID, latitud y longitud
    @Query("SELECT c.id, c.latitud, c.longitud FROM Centro c")
    List<Object[]> findAllIdsAndLatLng();

    @Query("SELECT c.id, c.latitud, c.longitud, c.tipoComedor FROM Centro c")
    List<Object[]> findAllIdsLatLngAndTipo();


    List<Centro> findByUsuarioId(Long id);

    List<Centro> findByUsuario(Usuario user);

    Optional<Centro> findByFormattedAddressAndLatitudAndLongitud(String formattedAddress, String latitud, String longitud);
}