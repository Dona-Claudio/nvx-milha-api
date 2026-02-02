package com.nxv.milha.repository

import com.nxv.milha.model.Usuario
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByEmail(String email)

    Usuario findByNomeUsuario(String nomeUsuario)

    boolean existsByEmail(String email)

    boolean existsByNomeUsuario(String nomeUsuario)
}
