package com.example.demo.services;

import com.example.demo.models.*;
import com.example.demo.models.Noticia;
import com.example.demo.repositories.NoticiaImagenRepo;
import com.example.demo.repositories.NoticiaRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Slf4j
@RequiredArgsConstructor
@Service
public class NoticiaService {

    private static final Logger logger = LoggerFactory.getLogger(CentroService.class.getName());

    @Autowired
    private final NoticiaRepo noticiaRepo;

    @Autowired
    private final NoticiaImagenRepo noticiaImagenRepo;

    public List<Noticia> getAllNovedads(){
        return noticiaRepo.findAll();
    }

    public Noticia getNovedadById(Long id){
        Optional<Noticia> optionalNovedad = noticiaRepo.findById(id);
        if(optionalNovedad.isPresent()){
            return optionalNovedad.get();
        }
        log.info("Novedad with id: {} doesn't exist", id);
        return null;
    }

    @Transactional
    public Noticia saveNoticia(
            String titulo,
            String subtitulo,
            String texto,
            String prioridad,
            MultipartFile[] imagenes,
            Usuario usuario) {

        Noticia newNoticia = new Noticia();

        newNoticia.setTitulo(titulo);
        newNoticia.setSubTitulo(subtitulo);
        newNoticia.setTexto(texto);
        newNoticia.setPrioridad(prioridad);
        newNoticia.setUsuario(usuario);
        newNoticia.setFechaCreacion(LocalDateTime.now());

        if (imagenes != null && imagenes.length > 0) {
            List<NoticiaImagen> newNoticiaImagenes = new ArrayList<>();
            for (MultipartFile imagen : imagenes) {
                NoticiaImagen newNoticiaImagen = new NoticiaImagen();
                newNoticiaImagen.setNoticia(newNoticia);
                try {
                    newNoticiaImagen.setDatos(imagen.getBytes());
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                newNoticiaImagenes.add(newNoticiaImagen);
            }
            newNoticia.setImagenes(newNoticiaImagenes);

            logger.info("Imágenes a guardar: " + newNoticiaImagenes.size());
        } else {
            logger.info("UWU malo");
        }

        return noticiaRepo.save(newNoticia);
    }

    @Transactional
    public Noticia updateNoticia(Long id,
                                 String titulo,
                                 String subtitulo,
                                 String texto,
                                 String prioridad,
                                 MultipartFile[] imagenes,
                                 Usuario usuario) {

        Noticia existingNoticia = noticiaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Centro not found"));

        // Actualizar los campos del centro
        existingNoticia.setTitulo(titulo);
        existingNoticia.setSubTitulo(subtitulo);
        existingNoticia.setTexto(texto);
        existingNoticia.setPrioridad(prioridad);

        existingNoticia.setFechaUltimaEdicion(LocalDateTime.now());
        existingNoticia.setUsuarioUltimaEdicion(usuario);

        // Si no se recibieron imágenes del frontend
        if (imagenes == null || imagenes.length == 0) {
            logger.info("Se recibieron 0 imágenes. Eliminando las existentes en la base de datos.");

            existingNoticia.getImagenes().forEach(img -> {
                noticiaImagenRepo.deleteById(img.getId());
            });

            existingNoticia.getImagenes().clear();  // Limpiar la lista original
        } else {

            // Eliminar imágenes existentes, pero sin reemplazar la lista original
            existingNoticia.getImagenes().forEach(img -> {
                noticiaImagenRepo.deleteById(img.getId());
            });

            existingNoticia.getImagenes().clear();  // Asegúrate de limpiar la lista original

            // Agregar nuevas imágenes a la lista existente
            for (MultipartFile imagen : imagenes) {
                try {
                    NoticiaImagen newNoticiaImagen = new NoticiaImagen();
                    newNoticiaImagen.setNoticia(existingNoticia);
                    newNoticiaImagen.setDatos(imagen.getBytes());
                    existingNoticia.getImagenes().add(newNoticiaImagen);  // Agregar a la lista existente
                } catch (IOException e) {
                    logger.error("Error al leer la imagen: ", e);
                    throw new RuntimeException(e);
                }
            }
        }

        // Guardar el centro actualizado
        return noticiaRepo.save(existingNoticia);
    }

    //hacer manejo de errores y de parametros y esas cosas agus del futuro vos pdoes

    public void deleteNovedadById (Long id) {
        noticiaRepo.deleteById(id);
    }

    public void deleteAllNovedads() {
        noticiaRepo.deleteAll();
    }

    @Transactional
    public List<Noticia> getAllUserNoticias(Usuario user){
        return noticiaRepo.findByUsuario(user);
    }
}
