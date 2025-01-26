package com.example.demo.controllers;

import com.example.demo.models.Usuario;
import com.example.demo.services.AuthorityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/authorities")
public class AuthorityController {

    private final AuthorityService authorityService;

    public AuthorityController(AuthorityService authorityService) {
        this.authorityService = authorityService;
    }

    @PostMapping("/add-admin")
    public ResponseEntity<String> addAdmin(@RequestBody Usuario usuario) {
        authorityService.addAdminAuthorityToUser(usuario);
        return ResponseEntity.ok("Authority ADMIN agregada correctamente");
    }
}

