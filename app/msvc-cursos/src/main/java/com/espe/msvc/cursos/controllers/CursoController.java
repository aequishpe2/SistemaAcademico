package com.espe.msvc.cursos.controllers;

import com.espe.msvc.cursos.models.Usuario;
import com.espe.msvc.cursos.models.entity.Curso;
import com.espe.msvc.cursos.services.CursoService;
import feign.FeignException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation .*;

import java.util.*;

@RestController
public class CursoController {
    @Autowired
    private CursoService service;

    @GetMapping("/api/cursos")
    public List<Curso> Listar() {
        return service.listar();
    }

    @GetMapping("api/cursos/detalle/{id}")
    public ResponseEntity<?> detalle(@PathVariable Long id) {
        Optional<Curso> cursoOptional = service.porId(id);
        if (cursoOptional.isPresent()) {
            return ResponseEntity.ok().body(cursoOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/api/cursos/crear")
    public ResponseEntity<?> crear(@Valid @RequestBody Curso curso, BindingResult result) {
        if (result.hasErrors()) {
            return validar(result);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(curso));
    }
    private static ResponseEntity<Map<String, String>> validar(BindingResult result) {
        Map<String, String> errores = new HashMap<>();
        result.getFieldErrors().forEach(err -> {
            errores.put(err.getField(), "El campo " + err.getField() + " " + err.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(errores);
    }

    @PutMapping("/api/cursos/editar/{id}")
    public ResponseEntity <?> editar(@Valid @RequestBody Curso curso, BindingResult result, @PathVariable Long id){
        if (result.hasErrors()){
            return validar(result);
        }
        Optional<Curso> cursoOptional = service.porId(id);
        if(cursoOptional.isPresent()) {
            Curso cursoDB = cursoOptional.get();
            cursoDB.setNombre(curso.getNombre());
            return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(cursoDB));
        }
            return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/api/cursos/eliminar/{id}")
    public ResponseEntity <? > eliminar(@PathVariable Long id) {
        Optional<Curso> cursoOptional = service.porId(id);
        if (cursoOptional.isPresent()) {
            service.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/asignar-usuario/{idCurso}")
    public ResponseEntity <?> asignarUsuario(@RequestBody Usuario usuario, @PathVariable Long idCurso) {
        Optional<Usuario> o;
        try{
            o = service.agregarUsuario(usuario, idCurso);
        } catch (FeignException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("mensaje", "Error al asignar usuario: " + e.getMessage()));
        }
        if (o.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(o.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/eliminar-usuario/{idCurso}")
    public ResponseEntity <?> eliminarUsuario(@RequestBody Usuario usuario, @PathVariable Long idCurso) {
        Optional<Usuario> o;
        try{
            o = service.eliminarUsuario(usuario, idCurso);
        } catch (FeignException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("mensaje", "Error al eliminar usuario: " + e.getMessage()));
        }
        if (o.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(o.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/crear-usuario/{idCurso}")
    public ResponseEntity <?> crearUsuario(@RequestBody Usuario usuario, @PathVariable Long idCurso) {
        Optional<Usuario> o;
        try{
            o = service.crearUsuario(usuario, idCurso);
        } catch (FeignException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("mensaje", "Error al crear usuario: " + e.getMessage()));
        }
        if (o.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(o.get());
        }
        return ResponseEntity.notFound().build();
    }

}
