import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'banned';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string; // Optionnel car absent chez le client
}

@Component({
  selector: 'app-tableau-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tableau-view.html',
  styleUrl: './tableau-view.css',
})
export class TableauView {
  @Input() data: BaseUser[] = [];
  @Input() type: 'agent' | 'client' = 'client';

  @Output() onToggleStatus = new EventEmitter<any>();
  @Output() onRowClick = new EventEmitter<string>(); // Envoie l'ID pour la navigation

  handleStatus(item: any) {
    this.onToggleStatus.emit(item);
  }

  goToDetail(id: string) {
    this.onRowClick.emit(id);
  }
}