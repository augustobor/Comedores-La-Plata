package com.example.demo.controllers;

import com.example.demo.models.CentroImagen;
import com.example.demo.services.CentroImagenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/centroImagen")
@RequiredArgsConstructor
@Validated
//@CrossOrigin(origins = "http://localhost:3000")  // Permite solicitudes desde React corriendo en localhost:3000
public class CentroImagenController {

    @Autowired
	private final CentroImagenService centroImagenService;

    @GetMapping("/")
	public ResponseEntity<List<CentroImagen>> getAllCentroImagens() {
		return ResponseEntity.ok().body(centroImagenService.getAllCentroImagens());
	}
	
	@GetMapping("/{id}")
    public ResponseEntity<CentroImagen> getCentroImagenById(@PathVariable Long id)
    {
        return ResponseEntity.ok().body(centroImagenService.getCentroImagenById(id));
    }
	
	@PostMapping("/")
    public ResponseEntity<CentroImagen> saveCentroImagen(@RequestBody CentroImagen imagen)
    {
        return ResponseEntity.ok().body(centroImagenService.saveCentroImagen(imagen));
    }
	
	@PutMapping("/") // Put es Update
    public ResponseEntity<CentroImagen> updateCentroImagen(@RequestBody CentroImagen imagen)
    {
        return ResponseEntity.ok().body(centroImagenService.updateCentroImagen(imagen));
    }
	
	@DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCentroImagenById(@PathVariable Long id)
    {
		centroImagenService.deleteCentroImagenById(id);
        return ResponseEntity.ok().body("Se borró el CentroImagen con id {} exitosamente");
    }
	
	@DeleteMapping("/all")
    public ResponseEntity<String> deleteCentroImagen()
    {
		centroImagenService.deleteAllCentroImagens();
        return ResponseEntity.ok().body("Se borraron todos los CentroImagens exitosamente");
    }
	
}
