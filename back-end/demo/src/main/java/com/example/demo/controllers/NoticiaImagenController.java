package com.example.demo.controllers;

import com.example.demo.models.NoticiaImagen;
import com.example.demo.services.NoticiaImagenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/noticiaImagen")
@RequiredArgsConstructor
@Validated
//@CrossOrigin(origins = "http://localhost:3000")  // Permite solicitudes desde React corriendo en localhost:3000
public class NoticiaImagenController {

    @Autowired
	private final NoticiaImagenService noticiaImagenService;

    @GetMapping("/")
	public ResponseEntity<List<NoticiaImagen>> getAllNoticiaImagens() {
		return ResponseEntity.ok().body(noticiaImagenService.getAllNoticiaImagens());
	}
	
	@GetMapping("/{id}")
    public ResponseEntity<NoticiaImagen> getNovedadImagenById(@PathVariable Long id)
    {
        return ResponseEntity.ok().body(noticiaImagenService.getNovedadImagenById(id));
    }
	
	@PostMapping("/")
    public ResponseEntity<NoticiaImagen> saveNovedadImagen(@RequestBody NoticiaImagen imagen)
    {
        return ResponseEntity.ok().body(noticiaImagenService.saveNovedadImagen(imagen));
    }
	
	@PutMapping("/") // Put es Update
    public ResponseEntity<NoticiaImagen> updateNovedadImagen(@RequestBody NoticiaImagen imagen)
    {
        return ResponseEntity.ok().body(noticiaImagenService.updateNovedadImagen(imagen));
    }
	
	@DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNovedadImagenById(@PathVariable Long id)
    {
		noticiaImagenService.deleteNovedadImagenById(id);
        return ResponseEntity.ok().body("Se borró el NoticiaImagen con id {} exitosamente");
    }
	
	@DeleteMapping("/all")
    public ResponseEntity<String> deleteNovedadImagen()
    {
		noticiaImagenService.deleteAllNovedadImagens();
        return ResponseEntity.ok().body("Se borraron todos los NovedadImagens exitosamente");
    }
	
}
