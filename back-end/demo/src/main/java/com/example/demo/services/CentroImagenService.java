package com.example.demo.services;

import com.example.demo.models.CentroImagen;
import com.example.demo.repositories.CentroImagenRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class CentroImagenService {

    @Autowired
	private final CentroImagenRepo centroImagenRepo;
	
	public List<CentroImagen> getAllCentroImagens(){
        return centroImagenRepo.findAll();
    }

    public CentroImagen getCentroImagenById(Long id){
        Optional<CentroImagen> optionalCentroImagen = centroImagenRepo.findById(id);
        if(optionalCentroImagen.isPresent()){
            return optionalCentroImagen.get();
        }
        log.info("CentroImagen with id: {} doesn't exist", id);
        return null;
    }

    public CentroImagen saveCentroImagen(CentroImagen centroImagen){
        CentroImagen savedCentroImagen = centroImagenRepo.save(centroImagen);

        log.info("CentroImagen with id {} and identificador_unico {} saved successfully", savedCentroImagen.getId());
        return savedCentroImagen;
    }

    public CentroImagen updateCentroImagen(CentroImagen centroImagen) {
        CentroImagen updatedCentroImagen = centroImagenRepo.save(centroImagen);

        log.info("updatedCentroImagen with id: {} updated successfully", updatedCentroImagen.getId());
        return updatedCentroImagen;
    }
    
    //hacer manejo de errores y de parametros y esas cosas agus del futuro vos pdoes

    public void deleteCentroImagenById (Long id) {
        centroImagenRepo.deleteById(id);
    }

	public void deleteAllCentroImagens() {
		centroImagenRepo.deleteAll();
	}

}
