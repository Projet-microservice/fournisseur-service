package tn.esprit.fournisseurservice.service;

import tn.esprit.fournisseurservice.entity.Fournisseur;

import java.util.List;

public interface FournisseurService {
    Fournisseur create(Fournisseur fournisseur);
    Fournisseur update(Long id, Fournisseur fournisseur);
    void delete(Long id);
    Fournisseur get(Long id);
    List<Fournisseur> getAll();
}