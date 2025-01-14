package com.example.demo.configuration;

import static org.springframework.security.config.Customizer.withDefaults;

import java.util.Arrays;

import com.example.demo.utils.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	@Autowired
	private UserDetailsService userDetailsService;
	@Autowired
	private JwtFilter jwtFilter;
	
	@Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {

		http
			.csrf( (csrf) -> csrf.disable() )
			//.csrf(AbstractHttpConfigurer::disable)
            .cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource()))
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(requests -> requests
            		.requestMatchers(
							"/ejemplo/**",
							"/usuario/**",
							"/centro/**",
							"/centroImagen/**",
							"/novedad/**",
							"/noticia/**",
							"/imagen/**",
							"/api/auth/**"
					).permitAll()
					.requestMatchers(
//							"/ejemplo/**",
//							"/usuario/**",
//							"/centro/**",
//							"/novedad/**",
//							"/imagen/**",
							"/api/auth/validate"
					).authenticated()
            );
		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		http.formLogin(withDefaults());
		http.userDetailsService(userDetailsService);
		http.authenticationManager(authenticationManager);
        return http.build();
    }
	
	
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration corsConfiguration = new CorsConfiguration();
	    //Make the below setting as * to allow connection from any hos
	    //corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:8002"));
		String frontendUrl = System.getenv("FRONTEND_URL");
	
	    corsConfiguration.setAllowedOrigins(Arrays.asList(frontendUrl, "http://localhost:3000"));
	    corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
	    corsConfiguration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
	    corsConfiguration.setAllowCredentials(true);
	    //corsConfiguration.setMaxAge(3600L);
	    
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", corsConfiguration);
	    return source;
	}

	@Bean
	AuthenticationManager authenticationManager(HttpSecurity httpSecurity, PasswordEncoder passwordEncoder) throws Exception {
		AuthenticationManagerBuilder authenticationManagerBuilder = httpSecurity.getSharedObject(AuthenticationManagerBuilder.class);
		authenticationManagerBuilder
				.userDetailsService(userDetailsService)
				.passwordEncoder(passwordEncoder);
		return authenticationManagerBuilder.build();
	}

	@Bean
	PasswordEncoder passwordEncoder(){
		return new BCryptPasswordEncoder();
	}

}
