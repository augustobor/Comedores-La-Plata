package com.example.demo.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Slf4j
@Component
public class JwtUtils {

    @Value("${jwt.secret.key}")
    private String secretKey;

    @Value("${jwt.time.expiration}")
    private String timeExpiration;

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userDetails.getUsername());
    }

    private String doGenerateToken(Map<String, Object> claims, String subject) {
        long expirationTime = Long.parseLong(timeExpiration);
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTime);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(expirationDate)
                .signWith(getSignatureKey())
                .compact();
    }

	/*
	public String generateAccesToken(String username) {

		return Jwts.builder()
				.subject(username)
				.issuedAt(new Date(System.currentTimeMillis()))
				//.expiration(new Date(System.currentTimeMillis() + Long.parseLong(timeExpiration)))
				.signWith(getSignatureKey())
				.compact();

	}
	*/

    public String getUsernameFromToken(String token){
        return getClaim(token, Claims::getSubject);
    }

    public Date getIssuedAtDate(String token) {
        return getClaim(token, Claims::getIssuedAt);
    }

    public Date getExpirationDate(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsTFunction){
        Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSignatureKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Boolean isTokenExpired(String token) {
        Date expiration = getExpirationDate(token);
        return expiration.before(new Date());
    }

    @SuppressWarnings("unused")
    private Boolean ignoreTokenExpiration(String token) {
        return false;
    }

    @SuppressWarnings("unused")
    private Boolean canTokenBeRefreshed(String token) {
        return (!isTokenExpired(token) || ignoreTokenExpiration(token));
    }


    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().verifyWith(getSignatureKey()).build().parseSignedClaims(token);
            return true;
        } catch(JwtException e) {
            log.error("Token inválido, error: {}", e.getMessage(), e);
            return false;
        }

    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);

        return (
                userDetails != null &&
                        username.equals(userDetails.getUsername()) &&
                        !isTokenExpired(token) &&
                        isTokenValid(token)
        );
    }

    public SecretKey getSignatureKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public void setTimeExpiration(String timeExpiration) {
        this.timeExpiration = timeExpiration;
    }

}
