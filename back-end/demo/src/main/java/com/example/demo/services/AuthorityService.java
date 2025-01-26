package com.example.demo.services;

import com.example.demo.models.Authority;
import com.example.demo.models.Usuario;
import com.example.demo.repositories.AuthorityRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthorityService {

    private final AuthorityRepo authorityRepo;

    public AuthorityService(AuthorityRepo authorityRepo) {
        this.authorityRepo = authorityRepo;
    }

    // Esta funcion se creo solo para darle admin a Seba
    @Transactional
    public Authority addAdminAuthorityToUser(Usuario usuario) {
        if (usuario.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("SUPER_ADMIN"))) {
            System.out.println("Rol SUPER_ADMIN ya agregado.");
            throw new IllegalArgumentException("El usuario ya tiene la autoridad ADMIN");
        }
        Authority adminAuthority = new Authority("SUPER_ADMIN");
        adminAuthority.setUsuario(usuario);
        return authorityRepo.save(adminAuthority);
    }

}
