package com.nxv.milha.controller

import com.nxv.milha.model.Milha
import com.nxv.milha.repository.MilhaRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

import java.util.Optional

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/milhas")
class MilhaController {

    @Autowired
    private MilhaRepository milhaRepository

    @PostMapping("/salvar")
    ResponseEntity<?> criarMilha(@RequestBody Milha milha) {
        try {
            if (!milha.nomeMilha || !milha.cliente || !milha.ip) {
                return ResponseEntity.badRequest().body([mensagem: "Todos os campos são obrigatórios"])
            }
            Milha novaMilha = milhaRepository.save(milha)
            return ResponseEntity.status(HttpStatus.CREATED).body(novaMilha)
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body([mensagem: "Erro ao cadastrar milha", erro: e.message])
        }
    }

    @GetMapping
    ResponseEntity<?> listarTodas() {
        try {
            List<Milha> milhas = milhaRepository.findAll()
            return ResponseEntity.ok(milhas)
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body([mensagem: "Erro ao listar milhas", erro: e.message])
        }
    }

    @GetMapping("/buscar/{termo}")
    ResponseEntity<?> buscarPorNomeOuCliente(@PathVariable("termo") String termo) {
        try {
            List<Milha> milhas = milhaRepository.buscarPorNomeOuCliente(termo)
            return ResponseEntity.ok(milhas)
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body([mensagem: "Erro ao buscar milhas", erro: e.message])
        }
    }

    @GetMapping("/{id}")
    ResponseEntity<?> buscarPorId(@PathVariable("id") Long id) {
        try {
            return milhaRepository.findById(id)
                    .map { milha -> ResponseEntity.ok(milha) }
                    .orElse(ResponseEntity.notFound().build())
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body([mensagem: "Erro ao buscar milha", erro: e.message])
        }
    }

    @PutMapping("/atualizar/{id}")
    ResponseEntity<?> editarMilha(@PathVariable("id") Long id, @RequestBody Milha milhaAtualizada) {
        try {
            return milhaRepository.findById(id)
                    .map { milhaExistente ->
                        if (milhaAtualizada.nomeMilha) {
                            milhaExistente.nomeMilha = milhaAtualizada.nomeMilha
                        }
                        if (milhaAtualizada.cliente) {
                            milhaExistente.cliente = milhaAtualizada.cliente
                        }
                        if (milhaAtualizada.ip) {
                            milhaExistente.ip = milhaAtualizada.ip
                        }
                        Milha milhaSalva = milhaRepository.save(milhaExistente)
                        ResponseEntity.ok(milhaSalva)
                    }
                    .orElse(ResponseEntity.notFound().build())
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body([mensagem: "Erro ao editar milha", erro: e.message])
        }
    }

    @DeleteMapping("/deletar/{id}")
    ResponseEntity<?> deletarMilha(@PathVariable("id") Long id) {
        try {
            Optional<Milha> milha = milhaRepository.findById(id)
            if (!milha.isPresent()) {
                return ResponseEntity.notFound().build()
            }
            milhaRepository.deleteById(id)
            return ResponseEntity.ok([mensagem: "Milha deletada com sucesso"])
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body([mensagem: "Erro ao deletar milha", erro: e.message])
        }
    }
}
