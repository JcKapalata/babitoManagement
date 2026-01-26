import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderAdmin } from '../../Models/order';
import { Router } from '@angular/router';
import { OrderStatusPipe } from "../order-status-pipe";

@Component({
  selector: 'app-vente-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, OrderStatusPipe],
  templateUrl: './view-vente-table.html',
  styleUrl: './view-vente-table.css'
})
export class ViewVenteTable {
  @Input() ventes: OrderAdmin[] = []; 
  private router = inject(Router);
  
  // On émet l'objet complet pour que le composant détail puisse l'afficher
  @Output() viewDetail = new EventEmitter<OrderAdmin>(); 

  onOpenDetail(vente: OrderAdmin) {
    this.router.navigate(['/ventes/detail-vente', vente.id]);
  }
}