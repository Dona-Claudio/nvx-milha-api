package com.nxv.milha.repository

import com.nxv.milha.model.Milha
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface MilhaRepository extends JpaRepository<Milha, Long> {

    @Query("SELECT m FROM Milha m WHERE LOWER(m.nomeMilha) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(m.cliente) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(m.ip) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Milha> buscarPorNomeOuCliente(@Param("termo") String termo)

    List<Milha> findByClienteContainingIgnoreCase(String cliente)

    List<Milha> findByNomeMilhaContainingIgnoreCase(String nomeMilha)

    List<Milha> findByIpContainingIgnoreCase(String ip)
}
