package com.nxv.milha.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp

import java.time.LocalDateTime

@Entity
@Table(name = "milha")
class Milha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id

    @Column(nullable = false, length = 150)
    String nomeMilha

    @Column(nullable = false, length = 150)
    String cliente

    @Column(nullable = false, length = 45)
    String ip

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    LocalDateTime dataCriacao

    @UpdateTimestamp
    @Column(nullable = false)
    LocalDateTime dataAtualizacao

    Milha() {}

    Milha(String nomeMilha, String cliente, String ip) {
        this.nomeMilha = nomeMilha
        this.cliente = cliente
        this.ip = ip
    }

    @Override
    String toString() {
        return "Milha{" +
                "id=" + id +
                ", nomeMilha='" + nomeMilha + '\'' +
                ", cliente='" + cliente + '\'' +
                ", ip='" + ip + '\'' +
                '}'
    }
}
