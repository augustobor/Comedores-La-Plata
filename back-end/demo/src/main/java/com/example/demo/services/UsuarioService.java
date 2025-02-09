package com.example.demo.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.demo.controllers.CentroController;
import com.example.demo.controllers.UsuarioController;
import com.example.demo.models.*;
import com.example.demo.repositories.AuthorityRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.repositories.UsuarioRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class.getName());

    @Autowired
    private final UsuarioRepo usuarioRepo;

    @Autowired
    private final AuthorityRepo authorityRepo;

    public List<Usuario> getAllUsuarios(){
        return usuarioRepo.findAll();
    }

    public List<Usuario> getAllUsuariosExcept(String username) {
        List<Usuario> allUsuarios = usuarioRepo.findAll();
        return allUsuarios.stream()
                .filter(usuario -> !usuario.getUsername().equals(username))
                .collect(Collectors.toList());
    }


    public Usuario getUsuarioById(Long id){

        logger.info("username id: {}", id);

        Optional<Usuario> optionalUsuario = usuarioRepo.findById(id);
        if(optionalUsuario.isPresent()){
            return optionalUsuario.get();
        }
        log.info("Usuario with id: {} doesn't exist", id);
        return null;
    }

    public Usuario saveUsuario(Usuario usuario){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        usuario.setPassword(encoder.encode(usuario.getPassword()));
        Usuario savedUsuario = usuarioRepo.save(usuario);

        log.info("Usuario with id {} and identificador_unico {} saved successfully", savedUsuario.getId());
        return savedUsuario;
    }

    public Usuario updateUsuario(Usuario usuario) {
        Usuario updatedUsuario = usuarioRepo.save(usuario);

        log.info("updatedUsuario with id: {} updated successfully", updatedUsuario.getId());
        return updatedUsuario;
    }

    public void deleteUsuarioById (Long id) {
//        findAndPrintUsuarioDetails(id);
        Usuario usuario = usuarioRepo.findById(id).orElse(null);

        if (usuario != null) {
            if (usuario.getAuthorities().stream()
                    .noneMatch(auth -> auth.getAuthority().equals(TipoRoles.SUPER_ADMIN.name()))) {
                authorityRepo.deleteAll((Iterable<? extends Authority>) usuario.getAuthorities());
                usuarioRepo.deleteById(id);
            } else {
                throw new IllegalArgumentException("No se puede borrar a un usuario super admin.");
            }
        }
    }

    public void deleteAllUsuarios() {
        usuarioRepo.deleteAll();
    }

    public Optional<Usuario> getUsuarioByUsername(String username) { return usuarioRepo.findByUsername(username);}

    public Boolean existsUsuarioByEmail(String email) {
        Optional<Usuario> usuarioOptional = usuarioRepo.findByMail(email);
        return usuarioOptional.isPresent();
    }

    public Usuario saveUsuario(
            String nombre,
            String apellido,
            String mail,
            String username,
            String password) {

        Boolean mailOrUsernameExists = false;
        StringBuilder errorMessage = new StringBuilder();
        if (usuarioRepo.existsByMail(mail)) errorMessage.append("El correo ya está registrado. ");
        if (usuarioRepo.existsByUsername(username)) errorMessage.append("El nombre de usuario ya está registrado. ");
        if (errorMessage.length() > 0) throw new IllegalArgumentException(errorMessage.toString().trim());

        Usuario newUsuario = new Usuario();

        newUsuario.setNombre(nombre);
        newUsuario.setApellido(apellido);
        newUsuario.setMail(mail);
        newUsuario.setUsername(username);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        newUsuario.setPassword(encoder.encode(password));

        return usuarioRepo.save(newUsuario);
    }

    public Usuario updateUsuario(
            String nombre,
            String apellido,
            String mail,
            String username,
            String password,
            Long id) {

        Usuario existingUsuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Centro not found"));

        Boolean mailOrUsernameExists = false;
        StringBuilder errorMessage = new StringBuilder();
        if (usuarioRepo.existsByMailAndIdNot(mail, id)) errorMessage.append("El correo ya está registrado. ");
        if (usuarioRepo.existsByUsernameAndIdNot(username, id)) errorMessage.append("El nombre de usuario ya está registrado. ");
        logger.info("errorMessage: {}", errorMessage);
        if (errorMessage.length() > 0) throw new IllegalArgumentException(errorMessage.toString().trim());

        existingUsuario.setNombre(nombre);
        existingUsuario.setApellido(apellido);
        existingUsuario.setMail(mail);
        existingUsuario.setUsername(username);
        if(password != null && !password.isBlank() && !password.isEmpty()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            existingUsuario.setPassword(encoder.encode(password));
        }
        return usuarioRepo.save(existingUsuario);
    }
}
