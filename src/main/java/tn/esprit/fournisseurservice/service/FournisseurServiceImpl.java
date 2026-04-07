package tn.esprit.fournisseurservice.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.fournisseurservice.entity.Fournisseur;
import tn.esprit.fournisseurservice.repository.FournisseurRepository;

import java.util.List;

@Service
@Transactional
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository repository;

    public FournisseurServiceImpl(FournisseurRepository repository) {
        this.repository = repository;
    }

    @Override
    public Fournisseur create(Fournisseur fournisseur) {
        return repository.save(fournisseur);
    }

    @Override
    public Fournisseur update(Long id, Fournisseur fournisseur) {
        Fournisseur existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fournisseur not found"));

        existing.setNom(fournisseur.getNom());
        existing.setEmail(fournisseur.getEmail());
        existing.setTelephone(fournisseur.getTelephone());
        existing.setAdresse(fournisseur.getAdresse());

        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Fournisseur not found");
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Fournisseur get(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fournisseur not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Fournisseur> getAll() {
        return repository.findAll();
    }
}






























