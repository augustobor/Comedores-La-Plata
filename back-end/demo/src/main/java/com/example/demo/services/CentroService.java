package com.example.demo.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import com.example.demo.controllers.CentroController;
import com.example.demo.models.CentroImagen;
import com.example.demo.models.TipoComedor;
import com.example.demo.models.Usuario;
import com.example.demo.repositories.CentroImagenRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Centro;
import com.example.demo.repositories.CentroRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static com.example.demo.models.TipoComedor.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class CentroService {

    private static final Logger logger = LoggerFactory.getLogger(CentroService.class.getName());

    @Autowired
    private final CentroRepo centroRepo;

    @Autowired
    private final CentroImagenRepo centroImagenRepo;

    public List<Centro> getAllCentros(){
        return centroRepo.findAll();
    }

    @Transactional
    public List<Centro> getAllUserCentros(Usuario user){
        return centroRepo.findByUsuario(user);
    }

    public HashMap<Long, HashMap<String, String>> getAllCentrosIdsAndLatLng() {
        List<Object[]> resultados = centroRepo.findAllIdsAndLatLng();
        HashMap<Long, HashMap<String, String>> centrosMap = new HashMap<>();

        for (Object[] fila : resultados) {
            Long id = (Long) fila[0];
            String lat = (String) fila[1];
            String lng = (String) fila[2];

            HashMap<String, String> coordenadas = new HashMap<>();
            coordenadas.put("lat", lat);
            coordenadas.put("lng", lng);

            centrosMap.put(id, coordenadas);
        }
        return centrosMap;
    }

    public HashMap<Long, HashMap<String, String>> getAllCentrosIdsLatLngAndTipo() {
        List<Object[]> resultados = centroRepo.findAllIdsLatLngAndTipo();
        HashMap<Long, HashMap<String, String>> centrosMap = new HashMap<>();

        for (Object[] fila : resultados) {
            Long id = (Long) fila[0];
            String lat = (String) fila[1];
            String lng = (String) fila[2];
            String tipo = fila[3].toString(); // Convierte tipoComedor a String

            HashMap<String, String> datos = new HashMap<>();
            datos.put("lat", lat);
            datos.put("lng", lng);
            datos.put("tipo", tipo);

            centrosMap.put(id, datos);
        }
        return centrosMap;
    }


    public Centro getCentroById(Long id){
        Optional<Centro> optionalCentro = centroRepo.findById(id);
        if(optionalCentro.isPresent()){
            return optionalCentro.get();
        }
        log.info("Centro with id: {} doesn't exist", id);
        return null;
    }

    public Centro saveCentro(Centro centro){
        Centro savedCentro = centroRepo.save(centro);

        log.info("Centro with id {} and identificador_unico {} saved successfully", savedCentro.getId());
        return savedCentro;
    }

    public Centro updateCentro(Centro centro) {
        Centro updatedCentro = centroRepo.save(centro);

        log.info("updatedCentro with id: {} updated successfully", updatedCentro.getId());
        return updatedCentro;
    }

    @Transactional
    public Centro updateCentro(Long id,
                               String nombre,
                               String descripcion,
                               String tipoComedor,
                               String formattedAddress,
                               String latitud,
                               String longitud,
                               String nombreDueño,
                               String telefonoDueño,
                               String mailDueño,
                               MultipartFile[] imagenes,
                               Usuario usuario) {

        // Verificar si ya existe un centro con la misma dirección, latitud y longitud
        Optional<Centro> existingCentroWithAddressLatAndLong = centroRepo.findByFormattedAddressAndLatitudAndLongitud(formattedAddress, latitud, longitud);
        if (existingCentroWithAddressLatAndLong.isPresent()) {
            throw new RuntimeException("Ya existe un centro con la misma dirección y coordenadas.");
        }

        Centro existingCentro = centroRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Centro not found"));

        // Actualizar los campos del centro
        existingCentro.setNombre(nombre);
        existingCentro.setDescripcion(descripcion);
        existingCentro.setTipoComedor(obtenerEnumTipoComedor(tipoComedor));
        existingCentro.setFormattedAddress(formattedAddress);
        existingCentro.setLatitud(latitud);
        existingCentro.setLongitud(longitud);
        existingCentro.setNombreDueño(nombreDueño);

        if (!telefonoDueño.isBlank()) existingCentro.setTelefonoDueño(telefonoDueño);
        if (!mailDueño.isBlank()) existingCentro.setMailDueño(mailDueño);

        existingCentro.setFechaUltimaEdicion(LocalDateTime.now());
        existingCentro.setUsuarioUltimaEdicion(usuario);

        // Si no se recibieron imágenes del frontend
        if (imagenes == null || imagenes.length == 0) {
            logger.info("Se recibieron 0 imágenes. Eliminando las existentes en la base de datos.");

            existingCentro.getImagenes().forEach(img -> {
                centroImagenRepo.deleteById(img.getId());
            });

            existingCentro.getImagenes().clear();  // Limpiar la lista original
        } else {

            // Eliminar imágenes existentes, pero sin reemplazar la lista original
            existingCentro.getImagenes().forEach(img -> {
                centroImagenRepo.deleteById(img.getId());
            });

            existingCentro.getImagenes().clear();  // Asegúrate de limpiar la lista original

            // Agregar nuevas imágenes a la lista existente
            for (MultipartFile imagen : imagenes) {
                try {
                    CentroImagen newCentroImagen = new CentroImagen();
                    newCentroImagen.setCentro(existingCentro);
                    newCentroImagen.setDatos(imagen.getBytes());
                    existingCentro.getImagenes().add(newCentroImagen);  // Agregar a la lista existente
                } catch (IOException e) {
                    logger.error("Error al leer la imagen: ", e);
                    throw new RuntimeException(e);
                }
            }
        }

        // Guardar el centro actualizado
        return centroRepo.save(existingCentro);
    }


    //hacer manejo de errores y de parametros y esas cosas agus del futuro vos pdoes

    public void deleteCentroById (Long id) {
        centroRepo.deleteById(id);
    }

    public void deleteAllCentros() {
        centroRepo.deleteAll();
    }

    @Transactional
    public Centro saveCentro(
            String nombre,
            String descripcion,
            String tipoComedor,
            String formattedAddress,
            String latitud,
            String longitud,
            String nombreDueño,
            String telefonoDueño,
            String mailDueño,
            MultipartFile[] imagenes,
            Usuario usuario) {

        // Verificar si ya existe un centro con la misma dirección, latitud y longitud
        Optional<Centro> existingCentro = centroRepo.findByFormattedAddressAndLatitudAndLongitud(formattedAddress, latitud, longitud);
        if (existingCentro.isPresent()) {
            throw new RuntimeException("Ya existe un centro con la misma dirección y coordenadas.");
        }

        Centro newCentro = new Centro();

        newCentro.setNombre(nombre);
        newCentro.setDescripcion(descripcion);
        newCentro.setTipoComedor(obtenerEnumTipoComedor(tipoComedor));
        newCentro.setFormattedAddress(formattedAddress);
        newCentro.setLatitud(latitud); // Conversión a Double
        newCentro.setLongitud(longitud); // Conversión a Double
        newCentro.setNombreDueño(nombreDueño);

        if (telefonoDueño != null && !telefonoDueño.isBlank()) {
            newCentro.setTelefonoDueño(telefonoDueño);
        }

        if (mailDueño != null && !mailDueño.isBlank()) {
            newCentro.setMailDueño(mailDueño);
        }

        newCentro.setUsuario(usuario);
        newCentro.setFechaCreacion(LocalDateTime.now());

        if (imagenes != null && imagenes.length > 0) {
            List<CentroImagen> newCentroImagenes = new ArrayList<>();
            for (MultipartFile imagen : imagenes) {
                CentroImagen newCentroImagen = new CentroImagen();
                newCentroImagen.setCentro(newCentro);
                try {
                    newCentroImagen.setDatos(imagen.getBytes());
                } catch (IOException e) {
                    logger.error("Error al leer la imagen: ", e); // Usando SLF4J
                    throw new RuntimeException(e);
                }
                newCentroImagenes.add(newCentroImagen);
            }
            newCentro.setImagenes(newCentroImagenes);
        } else {
            logger.info("No se recibieron imágenes para guardar.");
        }

        return centroRepo.save(newCentro);
    }

    private TipoComedor obtenerEnumTipoComedor(String tipoComedor) {
        if (tipoComedor == null || tipoComedor.isBlank()) {
            throw new IllegalArgumentException("Tipo de comedor es obligatorio");
        }
        TipoComedor tipoComedorReturn;
        switch (tipoComedor) {
            case "COMEDOR_COMUNITARIO":
                tipoComedorReturn = TipoComedor.COMEDOR_COMUNITARIO;
                break;
            case "MERENDERO":
                tipoComedorReturn = TipoComedor.MERENDERO;
                break;
            case "COPA_DE_LECHE":
                tipoComedorReturn = TipoComedor.COPA_DE_LECHE;
                break;
            case "DISTRIBUIDORA_DE_ALIMENTOS":
                tipoComedorReturn = TipoComedor.DISTRIBUIDORA_DE_ALIMENTOS;
                break;
            case "CENTRO_DE_PRODUCCION_DE_VIANDAS":
                tipoComedorReturn = TipoComedor.CENTRO_DE_PRODUCCION_DE_VIANDAS;
                break;
            default:
                tipoComedorReturn = null;
        }
        return tipoComedorReturn;
    }
}
