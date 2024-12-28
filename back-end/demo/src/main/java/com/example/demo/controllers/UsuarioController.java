package com.example.demo.controllers;

import java.util.List;
import java.util.Optional;

import com.example.demo.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import com.example.demo.models.Centro;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Usuario;
import com.example.demo.services.UsuarioService;

import lombok.RequiredArgsConstructor;

@Slf4j
@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
@Validated
public class UsuarioController {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class.getName());

    @Value("${super.admin}")
    private String superAdmin;

    @Autowired
    private final UsuarioService usuariosService;

    @GetMapping("/self")
    public ResponseEntity<Optional<Usuario>> getSelfUsuarioByUsername(@AuthenticationPrincipal Usuario user)
    {
        return ResponseEntity.ok().body(usuariosService.getUsuarioByUsername(user.getUsername()));
    }

    @GetMapping("/{username}")
    public ResponseEntity<Optional<Usuario>> getUsuarioByUsername(@PathVariable String username, @AuthenticationPrincipal Usuario user)
    {
        return ResponseEntity.ok().body(usuariosService.getUsuarioByUsername(username));
    }

    @GetMapping("/edit/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id, @AuthenticationPrincipal Usuario user)
    {
        return ResponseEntity.ok().body(usuariosService.getUsuarioById(id));
    }

    @GetMapping("/allExceptUsername/{username}")
    public ResponseEntity<List<Usuario>> getAllUsuariosExcept(@PathVariable String username, @AuthenticationPrincipal Usuario user) {
        List<Usuario> usuarios = usuariosService.getAllUsuariosExcept(username);
        return ResponseEntity.ok().body(usuarios);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Usuario>> getAllUsuarios(@AuthenticationPrincipal Usuario user) {
        return ResponseEntity.ok().body(usuariosService.getAllUsuarios());
    }

    // Nueva función para verificar la existencia de un correo electrónico
    @GetMapping("/emailYaRegistrado/{email}")
    public ResponseEntity<Boolean> existsUsuarioByEmail(@PathVariable String email, @AuthenticationPrincipal Usuario user) {
        return ResponseEntity.ok().body(usuariosService.existsUsuarioByEmail(email));
    }

    @PostMapping(value = "/", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Usuario>> saveUsuario(@AuthenticationPrincipal Usuario user,
                                               @RequestPart("username") String username,
                                               @RequestPart("password") String password,
                                               @RequestPart("nombre") String nombre,
                                               @RequestPart("apellido") String apellido,
                                               @RequestPart("mail") String mail)
    {
        if (!user.getUsername().equals(superAdmin)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("No autorizado", null));
        }

        try {
            Usuario newUsuario = usuariosService.saveUsuario(nombre, apellido, mail, username, password);
            return ResponseEntity.ok(new ApiResponse<>("Usuario creado con éxito", newUsuario));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Token expirado", null));
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Error de validación del token", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Error interno del servidor", null));
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Usuario>> updateUsuario(
                                                            @PathVariable Long id,
                                                            @AuthenticationPrincipal Usuario user,
                                                            @RequestPart("username") String username,
                                                            @RequestPart(value = "password", required = false) String password,
                                                            @RequestPart("nombre") String nombre,
                                                            @RequestPart("apellido") String apellido,
                                                            @RequestPart("mail") String mail)
    {
        if (!user.getUsername().equals(superAdmin)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("No autorizado", null));
        }

        try {
            Usuario newUsuario = usuariosService.updateUsuario(nombre, apellido, mail, username, password, id);
            return ResponseEntity.ok(new ApiResponse<>("Usuario creado con éxito", newUsuario));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Token expirado", null));
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Error de validación del token", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Error interno del servidor", null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUsuarioById(@PathVariable Long id, @AuthenticationPrincipal Usuario user)
    {
        if (!user.getUsername().equals(superAdmin)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No sos Seba");
        usuariosService.deleteUsuarioById(id);
        return ResponseEntity.ok().body("Se borró el Usuario con id {} exitosamente");
    }

}
