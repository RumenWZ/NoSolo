import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css'],
})

export class ConfirmDeleteComponent {
  @Input() itemName: string;
  @Output() deleteConfirmed: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteCancelled: EventEmitter<void> = new EventEmitter<void>();

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.itemName = data.itemName;
  }

  onDelete(): void {
    this.deleteConfirmed.emit();
  }

  onCancel(): void {
    this.deleteCancelled.emit();
  }
}
