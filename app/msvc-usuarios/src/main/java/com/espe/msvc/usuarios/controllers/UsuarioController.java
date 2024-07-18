package com.espe.msvc.usuarios.controllers;
import com.espe.msvc.usuarios.models.entity.Usuario;
import com.espe.msvc.usuarios.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation .*;

import javax.naming.Binding;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;


//@CrossOrigin (origins = "http://localhost:4200", maxAge = 3600)
@RestController
//@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService service;

    @GetMapping("/api/usuarios")
    public List<Usuario> listar() {
        return service.listar();
    }

    @GetMapping("/api/usuarios/detalle/{id}")
    //public Usuario detalle(@PathVariable(name="id" Long pk){
    public ResponseEntity <?> detalle(@PathVariable Long id) {
        Optional<Usuario> usuarioOptional = service.porId(id);
        if (usuarioOptional.isPresent()) {
            return ResponseEntity.ok().body(usuarioOptional.get());
        }
            return ResponseEntity.notFound().build();
    }

    @PostMapping("/api/usuarios/guardar")
    public ResponseEntity <?> crear(@Valid @RequestBody Usuario usuario, BindingResult result) {
        if (result.hasErrors()){
            return validar(result);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(usuario));
    }

    private static ResponseEntity<Map<String, String>> validar(BindingResult result) {
        Map<String, String> errores = new HashMap<>();
        result.getFieldErrors().forEach(err -> {
            errores.put(err.getField(), "El campo " + err.getField() + " " + err.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(errores);
    }

    @PutMapping("/api/usuarios/editar/{id}")
    public ResponseEntity <?> editar(@Valid @RequestBody Usuario usuario, BindingResult result, @PathVariable Long id){
        if (result.hasErrors()){
            return validar(result);
        }
        Optional<Usuario> usuarioOptional = service.porId(id);
        if(usuarioOptional.isPresent()) {
            Usuario usuarioDB = usuarioOptional.get();
            usuarioDB.setNombre(usuario.getNombre());
            usuarioDB.setEmail(usuario.getEmail());
            usuarioDB.setPassword(usuario.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(usuarioDB));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/api/usuarios/eliminar/{id}")
    public ResponseEntity <?> eliminar(@PathVariable Long id) {
        Optional<Usuario> optionalUsuario = service.porId(id);
        if (optionalUsuario.isPresent()) {
            service.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
