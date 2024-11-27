package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

@SuppressWarnings("serial")
@Entity
@Data
public class Authority implements GrantedAuthority {

    public Authority() {}

    public Authority(String authority) {
        this.authority=authority;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String authority;
    @ManyToOne
    private Usuario usuario;

}
