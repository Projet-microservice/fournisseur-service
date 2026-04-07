import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService, User } from '../../services/user.service';
import { FournisseurService } from '../../services/fournisseur.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  dataSource = new MatTableDataSource<User>([]);
  columnsToDisplay = ['id', 'name', 'email', 'role', 'actions'];
  loading = true;
  stats = {
    totalUsers: 0,
    totalFournisseurs: 0
  };

  fournisseurForm: FormGroup;
  showAddFournisseur = false;
  allFournisseurs: any[] = [];
  loadingAllFournisseurs = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private fournisseurService: FournisseurService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.fournisseurForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      adresse: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadStats();
    this.loadAllFournisseurs();
  }

  loadAllFournisseurs(): void {
    this.loadingAllFournisseurs = true;
    this.fournisseurService.getAll().subscribe({
      next: (fournisseurs) => {
        this.allFournisseurs = fournisseurs;
        this.loadingAllFournisseurs = false;
      },
      error: () => {
        this.loadingAllFournisseurs = false;
      }
    });
  }

  loadStats(): void {
    this.fournisseurService.getAll().subscribe(fournisseurs => {
      this.stats.totalFournisseurs = fournisseurs.length;
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users.map(u => ({ ...u, id: u._id }));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.stats.totalUsers = users.length;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onAddFournisseur(): void {
    if (this.fournisseurForm.invalid) return;

    this.fournisseurService.create(this.fournisseurForm.value).subscribe({
      next: () => {
        this.snackBar.open('Fournisseur ajouté avec succès !', 'Fermer', { duration: 3000 });
        this.fournisseurForm.reset();
        this.showAddFournisseur = false;
        this.loadStats();
        this.loadAllFournisseurs();
      },
      error: () => this.snackBar.open('Erreur lors de l\'ajout', 'Fermer', { duration: 3000 })
    });
  }

  editFournisseur(fournisseur: any): void {
    const newNom = prompt('Nouveau nom :', fournisseur.nom);
    const newEmail = prompt('Nouvel email :', fournisseur.email);
    const newTelephone = prompt('Nouveau téléphone :', fournisseur.telephone || '');
    const newAdresse = prompt('Nouvelle adresse :', fournisseur.adresse || '');

    if (newNom && newEmail) {
      const updated = {
        nom: newNom,
        email: newEmail,
        telephone: newTelephone || '',
        adresse: newAdresse || ''
      };

      this.fournisseurService.update(fournisseur.id, updated).subscribe({
        next: () => {
          this.snackBar.open('Fournisseur modifié avec succès !', 'Fermer', { duration: 3000 });
          this.loadAllFournisseurs();
        },
        error: () => this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 })
      });
    }
  }

  deleteFournisseur(id: number): void {
    if (confirm('Supprimer ce fournisseur ?')) {
      this.fournisseurService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Fournisseur supprimé', 'Fermer', { duration: 3000 });
          this.loadAllFournisseurs();
          this.loadStats();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé', 'Fermer', { duration: 3000 });
          this.loadUsers();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
