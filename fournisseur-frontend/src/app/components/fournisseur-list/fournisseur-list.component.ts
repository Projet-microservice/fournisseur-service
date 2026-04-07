import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FournisseurService } from '../../services/fournisseur.service';
import { Fournisseur } from '../../models/fournisseur.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-fournisseur-list',
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.scss']
})
export class FournisseurListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Fournisseur>([]);
  loading = false;
  error = '';
  displayedColumns = ['id', 'nom', 'email', 'telephone', 'adresse', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fournisseurService: FournisseurService,
    private router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetch(): void {
    this.loading = true;
    this.error = '';
    this.fournisseurService.getAll().subscribe({
      next: (data: Fournisseur[]) => {
        this.dataSource.data = data || [];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  add(): void {
    this.router.navigate(['/add']);
  }

  edit(id: number | undefined): void {
    if (id == null) return;
    this.router.navigate(['/edit', id]);
  }

  remove(id: number | undefined): void {
    if (id == null) return;
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer', message: 'Supprimer ce fournisseur ?', confirmText: 'Supprimer', cancelText: 'Annuler' }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.fournisseurService.delete(id).subscribe({
        next: () => {
          this.snack.open('Fournisseur supprimé', 'OK', { duration: 2000 });
          this.fetch();
        },
        error: (err: any) => {
          this.error = err.message;
          this.snack.open('Erreur suppression', 'Fermer', { duration: 3000 });
        }
      });
    });
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
