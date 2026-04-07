package tn.esprit.fournisseurservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fournisseurs")
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est requis")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]+$", message = "Le nom doit contenir uniquement des lettres")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "L'email est requis")
    @Email(message = "Le format de l'email est invalide")
    @Column(nullable = false)
    private String email;

    @NotBlank(message = "Le téléphone est requis")
    @Pattern(regexp = "^\\d{8}$", message = "Le téléphone doit contenir exactement 8 chiffres")
    @Size(min = 8, max = 8, message = "Le téléphone doit contenir exactement 8 chiffres")
    @Column(nullable = false)
    private String telephone;

    @NotBlank(message = "L'adresse est requise")
    @Column(nullable = false)
    private String adresse;
}