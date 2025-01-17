package com.example.demo.controllers;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.JwtResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AuthCredentialsRequest;
import com.example.demo.models.Usuario;
import com.example.demo.utils.JwtUtils;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class.getName());

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody AuthCredentialsRequest request) {

        try {

            Authentication authenticate = authenticationManager
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getUsername(), request.getPassword()
                            )
                    );
            Usuario userModel = (Usuario) authenticate.getPrincipal();
            userModel.setPassword(null);

            String token = jwtUtils.generateToken(userModel);



            return ResponseEntity.ok()
                    .body(new JwtResponse(token));

        } catch (BadCredentialsException ex) {
            logger.error("Error al guardar el centro: ", ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token, @AuthenticationPrincipal Usuario user) {
        try {
            Boolean isValidToken = jwtUtils.validateToken(token, user);
            if (isValidToken) {
                logger.info("All good");
                return ResponseEntity.ok(Map.of("valid", true));
            } else {
                logger.info("Unauthorized.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
            }
        } catch (ExpiredJwtException e) {
            logger.error("Error (Expired): ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "error", "Token expired"));
        } catch (JwtException e) {
            logger.error("Error (Esception): ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("valid", false, "error", "Invalid token"));
        }
    }



}
