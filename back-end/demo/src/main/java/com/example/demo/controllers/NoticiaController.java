package com.example.demo.controllers;

import com.example.demo.models.Centro;
import com.example.demo.models.Noticia;
import com.example.demo.models.Usuario;
import com.example.demo.services.NoticiaService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/noticia")
@RequiredArgsConstructor
@Validated
//@CrossOrigin(origins = "http://localhost:3000")  // Permite solicitudes desde React corriendo en localhost:3000
public class NoticiaController {

    private static final Logger logger = LoggerFactory.getLogger(NoticiaController.class.getName());

    @Autowired
    private final NoticiaService noticiaService;

    @GetMapping("/user")
    public ResponseEntity<List<Noticia>> getAllUserNoticias(@AuthenticationPrincipal Usuario user)
    {
        return ResponseEntity.ok().body(noticiaService.getAllUserNoticias(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Noticia> getNovedadById(@PathVariable Long id)
    {
        return ResponseEntity.ok().body(noticiaService.getNovedadById(id));
    }

    @GetMapping("/")
    public ResponseEntity<List<Noticia>> getAllNovedad() {
        return ResponseEntity.ok().body(noticiaService.getAllNovedads());
    }



    @PostMapping(value = "/", consumes = "multipart/form-data")
    public ResponseEntity<Noticia> saveNovedad(@RequestPart("titulo") String titulo,
                                               @RequestPart("subtitulo") String subtitulo,
                                               @RequestPart("texto") String texto,
                                               @RequestPart("prioridad") String prioridad,
                                               @RequestPart(value = "imagenes", required = false) MultipartFile[] imagenes,
                                               @AuthenticationPrincipal Usuario usuario)
    {
        logger.info("UwU");
//        logger.info("Titulo: " + titulo);
//        logger.info("Subtitulo: " + subtitulo);
//        logger.info("Texto: " + texto);
//        logger.info("Prioridad: " + prioridad);
        logger.info("Imágenes a guardar: " + imagenes.length);

        try {
            Noticia newNoticia = noticiaService.saveNoticia(
                    titulo,
                    subtitulo,
                    texto,
                    prioridad,
                    imagenes,
                    usuario
            );
            return ResponseEntity.ok(newNoticia);
        } catch (ExpiredJwtException e) {
            // El token ha expirado
            return ResponseEntity.ok(null);
        } catch (JwtException e) {
            // Error de validación del token
            return ResponseEntity.ok(null);
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Noticia> updateNoticia(@PathVariable Long id,
                                                @RequestPart("titulo") String titulo,
                                                @RequestPart("subtitulo") String subtitulo,
                                                @RequestPart("texto") String texto,
                                                @RequestPart("prioridad") String prioridad,
                                                @RequestPart(value = "imagenes", required = true) MultipartFile[] imagenes,
                                                @AuthenticationPrincipal Usuario usuario) {

        logger.info("UWU");
        logger.info("Recibiendo datos para el nuevo centro.");

        try {
            Noticia newNoticia = noticiaService.updateNoticia(
                    id,
                    titulo,
                    subtitulo,
                    texto,
                    prioridad,
                    imagenes,
                    usuario
            );
            return ResponseEntity.ok(newNoticia);
        } catch (ExpiredJwtException e) {
            // El token ha expirado
            return ResponseEntity.ok(null);
        } catch (JwtException e) {
            // Error de validación del token
            return ResponseEntity.ok(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNovedadById(@PathVariable Long id, @AuthenticationPrincipal Usuario user)
    {
        noticiaService.deleteNovedadById(id);
        return ResponseEntity.ok().body("Se borró el Novedad con id {} exitosamente");
    }

}
