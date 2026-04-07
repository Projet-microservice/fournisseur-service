package tn.esprit.fournisseurservice.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import tn.esprit.fournisseurservice.entity.Fournisseur;
import tn.esprit.fournisseurservice.service.FournisseurService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/fournisseurs")
public class FournisseurController {

    private final FournisseurService service;

    public FournisseurController(FournisseurService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Fournisseur>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fournisseur> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PostMapping
    public ResponseEntity<Fournisseur> create(@Valid @RequestBody Fournisseur fournisseur, UriComponentsBuilder uriBuilder) {
        Fournisseur created = service.create(fournisseur);
        URI location = uriBuilder.path("/fournisseurs/{id}").buildAndExpand(created.getId()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fournisseur> update(@PathVariable Long id, @Valid @RequestBody Fournisseur fournisseur) {
        return ResponseEntity.ok(service.update(id, fournisseur));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}