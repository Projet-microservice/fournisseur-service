package tn.esprit.fournisseurservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.fournisseurservice.entity.Fournisseur;

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {}