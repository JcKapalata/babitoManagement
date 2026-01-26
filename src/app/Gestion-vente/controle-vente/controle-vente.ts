import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

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
    this.loading = true;

    // Charger les agents
    this.personnelService.getAllAgents().subscribe({
      next: (staff) => {
        this.agents = staff.filter(agent => this.ROLES_LOGISTIQUE.includes(agent.role));
        this.loading = false;
        
        // 3. Force Angular à voir que la liste d'agents a changé
        this.cdr.markForCheck(); 
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });

    // Écouter la logistique
    this.venteService.getOrderLogisticsRealtime(this.orderId).subscribe(data => {
      this.logisticsData = data;
      if (data) {
        this.controlForm.patchValue({
          internalNotes: data.internalNotes
        }, { emitEvent: false });
      }
      // 4. Force le rafraîchissement de l'UI avec les nouvelles données logistiques
      this.cdr.markForCheck();
    });
  }
  

  confirmAssignment() {
    if (this.controlForm.invalid || this.loading) return;

    this.loading = true;
    this.cdr.markForCheck(); // Affiche le spinner immédiatement

    const { agentId, internalNotes } = this.controlForm.value;

    this.venteService.assignAgent(this.orderId, agentId, internalNotes)
      .subscribe({
        next: () => {
          this.loading = false;
          this.submitSuccess = true;
          this.cdr.markForCheck(); // Met à jour l'UI (success message)
          
          setTimeout(() => {
            this.submitSuccess = false;
            this.cdr.markForCheck(); // Cache le message après 3s
          }, 3000);
        },
        error: (err) => {
          this.loading = false;
          this.cdr.markForCheck();
          alert("Erreur lors de l'enregistrement : " + err.message);
        }
      });
  }
}