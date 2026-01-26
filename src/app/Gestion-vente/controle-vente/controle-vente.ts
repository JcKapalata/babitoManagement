import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VenteServices } from '../vente-services';
import { OrderLogistics } from '../../Models/order';
import { PersonnelService } from '../../Gestion-personnel/personnel-service';
import { Agent } from '../../Models/agent';

@Component({
  selector: 'app-controle-vente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './controle-vente.html',
  styleUrl: './controle-vente.css',
})
export class ControleVente implements OnInit {
  private fb = inject(FormBuilder);
  private venteService = inject(VenteServices);
  private personnelService = inject(PersonnelService);

  @Input({ required: true }) orderId!: string;

  // Formulaire réactif
  controlForm: FormGroup = this.fb.group({
    agentId: ['', Validators.required],
    internalNotes: ['', [Validators.maxLength(500)]]
  });

  agents: Agent[] = [];
  logisticsData: OrderLogistics | null = null;
  loading: boolean = false;
  submitSuccess: boolean = false;

  // 1. Définir les rôles qui ont le droit de gérer une vente
  private readonly ROLES_LOGISTIQUE: string[] = ['admin', 'vendeur', 'finance'];

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // 1. Charger les agents disponibles (staff uniquement)
    // Utilise la méthode getAllAgents() définie dans ton PersonnelService
    this.personnelService.getAllAgents().subscribe({
      next: (staff) => {
        this.agents = staff.filter(agent => this.ROLES_LOGISTIQUE.includes(agent.role));
      
        console.log(`${this.agents.length} agents qualifiés chargés.`);
      },
      error: (err) => console.error('Erreur agents:', err)
    });

    // 2. Écouter la logistique en temps réel
    this.venteService.getOrderLogisticsRealtime(this.orderId).subscribe(data => {
      this.logisticsData = data;
      if (data) {
        // Mise à jour du formulaire si des notes existent déjà
        this.controlForm.patchValue({
          internalNotes: data.internalNotes
        }, { emitEvent: false });
      }
    });
  }

  confirmAssignment() {
    if (this.controlForm.invalid || this.loading) return;

    this.loading = true;
    const { agentId, internalNotes } = this.controlForm.value;

    this.venteService.assignAgent(this.orderId, agentId, internalNotes)
      .subscribe({
        next: () => {
          this.loading = false;
          this.submitSuccess = true;
          setTimeout(() => this.submitSuccess = false, 3000);
        },
        error: (err) => {
          this.loading = false;
          alert("Erreur lors de l'enregistrement : " + err.message);
        }
      });
  }
}