package com.example.demo.services;

import com.example.demo.models.Noticia;
import com.example.demo.models.NoticiaImagen;
import com.example.demo.repositories.NoticiaImagenRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class NoticiaImagenService {

    @Autowired
	private final NoticiaImagenRepo noticiaImagenRepo;
	
	public List<NoticiaImagen> getAllNoticiaImagens(){
        return noticiaImagenRepo.findAll();
    }

    public NoticiaImagen getNovedadImagenById(Long id){
        Optional<NoticiaImagen> optionalNoticiaImagen = noticiaImagenRepo.findById(id);
        if(optionalNoticiaImagen.isPresent()){
            return optionalNoticiaImagen.get();
        }
        log.info("NoticiaImagen with id: {} doesn't exist", id);
        return null;
    }

    public NoticiaImagen saveNovedadImagen(NoticiaImagen noticiaImagen){
        NoticiaImagen savedNoticiaImagen = noticiaImagenRepo.save(noticiaImagen);

        log.info("NoticiaImagen with id {} and identificador_unico {} saved successfully", savedNoticiaImagen.getId());
        return savedNoticiaImagen;
    }

    public NoticiaImagen updateNovedadImagen(NoticiaImagen noticiaImagen) {
        NoticiaImagen updatedNovedadImagen = noticiaImagenRepo.save(noticiaImagen);

        log.info("updatedNovedadImagen with id: {} updated successfully", updatedNovedadImagen.getId());
        return updatedNovedadImagen;
    }
    
    //hacer manejo de errores y de parametros y esas cosas agus del futuro vos pdoes

    public void deleteNovedadImagenById (Long id) {
        noticiaImagenRepo.deleteById(id);
    }

	public void deleteAllNovedadImagens() {
		noticiaImagenRepo.deleteAll();
	}

}
