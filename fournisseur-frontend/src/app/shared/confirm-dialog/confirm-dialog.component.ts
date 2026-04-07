import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  title = this.data?.title ?? 'Confirmer';
  message = this.data?.message ?? 'Voulez-vous continuer ?';
  confirmText = this.data?.confirmText ?? 'Oui';
  cancelText = this.data?.cancelText ?? 'Annuler';
  confirmed = false;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirm() {
    this.confirmed = true;
    this.dialogRef.close(true);
  }
  cancel() {
    this.confirmed = false;
    this.dialogRef.close(false);
  }
}
