package com.nxv.milha.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp

import java.time.LocalDateTime

@Entity
@Table(name = "usuarioNxv")
class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id

    @Column(nullable = false, length = 100, unique = true)
    String email

    @Column(nullable = false, length = 100, unique = true)
    String nomeUsuario

    @Column(nullable = false, length = 255)
    String senha

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    LocalDateTime dataCriacao

    Usuario() {}

    Usuario(String email, String nomeUsuario, String senha) {
        this.email = email
        this.nomeUsuario = nomeUsuario
        this.senha = senha
    }

    @Override
    String toString() {
        return "Usuario{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", nomeUsuario='" + nomeUsuario + '\'' +
                '}'
    }
}
