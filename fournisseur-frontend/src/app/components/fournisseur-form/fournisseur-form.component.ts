import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from '../../services/fournisseur.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fournisseur-form',
  templateUrl: './fournisseur-form.component.html',
  styleUrls: ['./fournisseur-form.component.scss']
})
export class FournisseurFormComponent implements OnInit {
  fournisseurForm: FormGroup;
  isEdit = false;
  fournisseurId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.fournisseurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      adresse: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.fournisseurId = +id;
      this.loadFournisseur(this.fournisseurId);
    }
  }

  loadFournisseur(id: number): void {
    this.loading = true;
    this.fournisseurService.get(id).subscribe({
      next: (f) => {
        this.fournisseurForm.patchValue({
          nom: f.nom,
          email: f.email,
          telephone: f.telephone,
          adresse: f.adresse
        });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Fournisseur introuvable', 'Fermer', { duration: 3000 });
        this.router.navigate(['/fournisseurs']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.fournisseurForm.invalid) return;

    this.loading = true;
    const data = this.fournisseurForm.value;

    if (this.isEdit && this.fournisseurId) {
      this.fournisseurService.update(this.fournisseurId, data).subscribe({
        next: () => {
          this.snackBar.open('Fournisseur modifié avec succès !', 'OK', { duration: 3000 });
          this.router.navigate(['/fournisseurs']);
          this.loading = false;
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Erreur lors de la modification', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.fournisseurService.create(data).subscribe({
        next: (response) => {
          this.snackBar.open(`Fournisseur créé avec succès ! ID: ${response.id}`, 'OK', { duration: 3000 });
          this.router.navigate(['/fournisseurs']);
          this.loading = false;
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Erreur lors de la création', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/fournisseurs']);
  }
}
