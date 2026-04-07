import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService, User } from '../../services/user.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  loading = true;
  error: string | null = null;
  userForm: FormGroup;
  editingUserId: number | null = null;
  showForm = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['USER', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        const mappedUsers = users.map(u => ({ ...u, id: u._id }));
        this.dataSource.data = mappedUsers;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs.';
        this.loading = false;
        this.snackBar.open(this.error, 'Fermer', { duration: 3000 });
      }
    });
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.userForm.reset({ role: 'USER' });
    this.editingUserId = null;
    this.showForm = false;
  }

  edit(user: User): void {
    this.editingUserId = user._id!;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role || 'USER',
      password: ''
    });
    this.showForm = true;
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.editingUserId) {
      this.userService.updateUser(this.editingUserId, userData).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur mis à jour !', 'OK', { duration: 2000 });
          this.loadUsers();
          this.resetForm();
        },
        error: () => this.snackBar.open('Erreur de mise à jour', 'Fermer', { duration: 3000 })
      });
    } else {
      if (!userData.password || userData.password.length < 6) {
        this.snackBar.open('Le mot de passe est requis (min 6 caractères) pour un nouvel utilisateur', 'Fermer', { duration: 3000 });
        return;
      }
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur créé !', 'OK', { duration: 2000 });
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => {
          const msg = err.error?.message || 'Erreur de création';
          this.snackBar.open(Array.isArray(msg) ? msg[0] : msg, 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  remove(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer l\'utilisateur', message: 'Voulez-vous vraiment supprimer cet utilisateur ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.confirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.snackBar.open('Utilisateur supprimé', 'OK', { duration: 2000 });
            this.loadUsers();
          },
          error: () => this.snackBar.open('Erreur de suppression', 'Fermer', { duration: 3000 })
        });
      }
    });
  }
}
