package com.espe.msvc.cursos.clients;

import com.espe.msvc.cursos.models.Usuario;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "msvc-usuarios", url = "localhost:8001")

public interface UsuarioClientRest {

    @GetMapping({"/{id}"})
    Usuario detalle(@PathVariable Long id);

    @PostMapping
    Usuario crear(@RequestBody Usuario usuario);
}