package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
import com.example.demo.utils.CORSFilter;


@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.configure()
				.directory("src/main/resources")
				.load();
        
        // Configurar las variables de entorno en el sistema
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
		System.setProperty("DB_USER", dotenv.get("DB_USER"));
        System.setProperty("JWT_SECRET_KEY", dotenv.get("JWT_SECRET_KEY"));
		System.setProperty("SUPER_ADMIN", dotenv.get("SUPER_ADMIN"));

		SpringApplication.run(DemoApplication.class, args);
	}

}
