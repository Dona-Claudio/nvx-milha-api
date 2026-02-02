package com.nxv.milha.controller

import com.nxv.milha.model.Usuario
import com.nxv.milha.repository.UsuarioRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/usuarios")
class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository

    @PostMapping("/salvar")
    ResponseEntity<?> criarUsuario(@RequestBody Usuario usuario) {
        try {
            if (!usuario.email || !usuario.nomeUsuario || !usuario.senha) {
                return ResponseEntity.badRequest().body([mensagem: "Todos os campos são obrigatórios"])
            }

            if (usuarioRepository.existsByEmail(usuario.email)) {
                return ResponseEntity.badRequest().body([mensagem: "Email já registrado"])
            }

            if (usuarioRepository.existsByNomeUsuario(usuario.nomeUsuario)) {
                return ResponseEntity.badRequest().body([mensagem: "Nome de usuário já existe"])
            }

            Usuario novoUsuario = usuarioRepository.save(usuario)
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body([id: novoUsuario.id, email: novoUsuario.email, nomeUsuario: novoUsuario.nomeUsuario])
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body([mensagem: "Erro ao criar usuário", erro: e.message])
        }
    }

    @PostMapping("/login")
    ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        try {
            String email = credenciais.get("email")
            String senha = credenciais.get("senha")

            if (!email || !senha) {
                return ResponseEntity.badRequest().body([mensagem: "Email e senha são obrigatórios"])
            }

            Usuario usuario = usuarioRepository.findByEmail(email)
            if (!usuario) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body([mensagem: "Email ou senha inválidos"])
            }

            if (usuario.senha != senha) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body([mensagem: "Email ou senha inválidos"])
            }

            return ResponseEntity.ok([
                    id: usuario.id,
                    email: usuario.email,
                    nomeUsuario: usuario.nomeUsuario,
                    mensagem: "Login realizado com sucesso"
            ])
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body([mensagem: "Erro ao fazer login", erro: e.message])
        }
    }

    @DeleteMapping("/deletar/{id}")
    ResponseEntity<?> deletarUsuario(@PathVariable("id") Long id) {
        try {
            return usuarioRepository.findById(id)
                    .map { usuario ->
                        usuarioRepository.deleteById(id)
                        ResponseEntity.ok([mensagem: "Usuário deletado com sucesso"])
                    }
                    .orElse(ResponseEntity.notFound().build())
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body([mensagem: "Erro ao deletar usuário", erro: e.message])
        }
    }
}
