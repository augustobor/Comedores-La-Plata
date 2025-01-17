package com.example.demo.controllers;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.demo.models.Usuario;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Centro;
import com.example.demo.services.CentroService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/centro")
@RequiredArgsConstructor
@Validated
public class CentroController {

    private static final Logger logger = LoggerFactory.getLogger(CentroController.class.getName());

    @Autowired
    private final CentroService centroService;

    @GetMapping("/all")
    public ResponseEntity<List<Centro>> getAllCentros(@AuthenticationPrincipal Usuario user)
    {
        return ResponseEntity.ok().body(centroService.getAllCentros());
    }

    @GetMapping("/user")
    public ResponseEntity<List<Centro>> getAllUserCentros(@AuthenticationPrincipal Usuario user)
    {
        return ResponseEntity.ok().body(centroService.getAllUserCentros(user));
    }

    @GetMapping("/idsAndlatlng")
    public ResponseEntity<HashMap<Long, HashMap<String, String>>> getAllCentrosIdsAndLatLng() {
        return ResponseEntity.ok().body(centroService.getAllCentrosIdsAndLatLng());
    }

    @GetMapping("/idsLatLngAndTipo")
    public ResponseEntity<HashMap<Long, HashMap<String, String>>> getAllCentrosIdsLatLngAndTipo() {
        return ResponseEntity.ok().body(centroService.getAllCentrosIdsLatLngAndTipo());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Centro> getCentroById(@PathVariable Long id) {
        Centro centro = centroService.getCentroById(id);
        if (centro == null) {
            // Si no se encuentra el centro, devolver un error 404
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(centro);
    }



    @PostMapping(value = "/", consumes = "multipart/form-data")
    public ResponseEntity<Centro> saveCentro(@RequestPart("nombre") Long id,
                                             @RequestPart("nombre") String nombre,
                                             @RequestPart("descripcion") String descripcion,
                                             @RequestPart("tipoComedor") String tipoComedor,
                                             @RequestPart("formattedAddress") String formattedAddress,
                                             @RequestPart("latitud") String latitud,
                                             @RequestPart("longitud") String longitud,
                                             @RequestPart("nombreDueño") String nombreDueño,
                                             @RequestPart(value = "telefonoDueño", required = false) String telefonoDueño,
                                             @RequestPart(value = "mailDueño", required = false) String mailDueño,
                                             @RequestPart(value = "imagenes", required = true) MultipartFile[] imagenes,
                                             @AuthenticationPrincipal Usuario usuario) {
        logger.info("Recibiendo datos para el nuevo centro.");

        try {
            // Lógica para guardar el centro
            Centro newCentro = centroService.saveCentro(
                    id,
                    nombre,
                    descripcion,
                    tipoComedor,
                    formattedAddress,
                    latitud,
                    longitud,
                    nombreDueño,
                    telefonoDueño,
                    mailDueño,
                    imagenes,
                    usuario
            );
            return ResponseEntity.ok(newCentro);
        } catch (ExpiredJwtException e) {
            // Manejo de excepción cuando el token ha expirado
            logger.error("Token expirado: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (JwtException e) {
            // Manejo de excepción general para problemas con JWT
            logger.error("Error de validación del token: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (RuntimeException e) {
            // Manejo de la excepción personalizada para la validación de la existencia del centro
            logger.error("Error al guardar el centro: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            // Manejo de cualquier otra excepción general
            logger.error("Error al guardar el centro: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCentroById(@AuthenticationPrincipal Usuario usuario, @PathVariable Long id)
    {
        centroService.deleteCentroById(id);
        return ResponseEntity.ok().body("Se borró el Novedad con id {} exitosamente");
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Centro> updateCentro(@PathVariable Long id,
                                               @RequestPart("nombre") String nombre,
                                               @RequestPart("descripcion") String descripcion,
                                               @RequestPart("tipoComedor") String tipoComedor,
                                               @RequestPart("formattedAddress") String formattedAddress,
                                               @RequestPart("latitud") String latitud,
                                               @RequestPart("longitud") String longitud,
                                               @RequestPart("nombreDueño") String nombreDueño,
                                               @RequestPart(value = "telefonoDueño", required = false) String telefonoDueño,
                                               @RequestPart(value = "mailDueño", required = false) String mailDueño,
                                               @RequestPart(value = "imagenes", required = true) MultipartFile[] imagenes,
                                               @AuthenticationPrincipal Usuario usuario) {

        try {
            Centro newCentro = centroService.updateCentro(
                    id,
                    nombre,
                    descripcion,
                    tipoComedor,
                    formattedAddress,
                    latitud,
                    longitud,
                    nombreDueño,
                    telefonoDueño,
                    mailDueño,
                    imagenes,
                    usuario
            );
            return ResponseEntity.ok(newCentro);
        } catch (ExpiredJwtException e) {
            // El token ha expirado
            return ResponseEntity.ok(null);
        } catch (JwtException e) {
            // Error de validación del token
            return ResponseEntity.ok(null);
        }
    }

}
