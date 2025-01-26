package com.example.demo;

import com.example.demo.models.Usuario;
import com.example.demo.services.AuthorityService;
import com.example.demo.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AddAdminToSeba implements CommandLineRunner {

    @Autowired
    private AuthorityService authorityService;

    @Autowired
    private UsuarioService usuarioService;

    @Override
    public void run(String... args) throws Exception {

        Optional<Usuario> user = usuarioService.getUsuarioByUsername("Seba");
        if(user.isPresent()) {
            try {
                // Intentamos agregar la autoridad de ADMIN al usuario
                authorityService.addAdminAuthorityToUser(user.get());
                System.out.println("La autoridad de SUPER_ADMIN se ha agregado correctamente al usuario.");
            } catch (Exception e) {
                // Si ocurre una excepción, la capturamos y mostramos el error
                System.err.println("Ocurrió un error al agregar la autoridad ADMIN al usuario: " + e.getMessage());
                e.printStackTrace(); // Imprime el stack trace para mayor información sobre el error
            }
        } else {
            System.out.println("No se encontro al usuario: " + user.get().getUsername());
        }
    }
}
