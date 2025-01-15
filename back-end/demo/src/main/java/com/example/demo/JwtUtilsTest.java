package com.example.demo;

import com.example.demo.utils.JwtUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

public class JwtUtilsTest {

    public static void main(String[] args) {
        // Crear instancia de JwtUtils
        JwtUtils jwtUtils = new JwtUtils();

        // Configurar manualmente los valores
        jwtUtils.setSecretKey("76397924423F4528482B4D6251655468576D5A7134743777217A25432A46294A"); // Reemplaza con tu clave secreta en Base64
        jwtUtils.setTimeExpiration("3600000"); // 1 hora en milisegundos

        // Crear un usuario de prueba
        UserDetails userDetails = User.builder()
                .username("testuser")
                .password("testpassword")
                .roles("USER")
                .build();

        // Generar el token
        String token = jwtUtils.generateToken(userDetails);

        // Mostrar el token en la consola
        System.out.println("Token generado: " + token);
    }
}
