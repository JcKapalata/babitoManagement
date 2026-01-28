import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VenteServices } from '../vente-services';
import { OrderLogistics } from '../../Models/order';
import { PersonnelService } from '../../Gestion-personnel/personnel-service';
import { Agent } from '../../Models/agent';

@Component({
  selector: 'app-controle-vente',
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

  controlForm: FormGroup = this.fb.group({
    selectedAgentIds: [[] as string[], [Validators.required, Validators.minLength(1)]],
    internalNotes: ['', [Validators.maxLength(500)]]
  });

  agents: Agent[] = [];
  logisticsData: OrderLogistics | null = null;
  loading: boolean = false;
  submitSuccess: boolean = false;

  private readonly ROLES_LOGISTIQUE = ['admin', 'vendeur', 'finance'];

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.loading = true;
    this.personnelService.getAllAgents().subscribe({
      next: (staff) => {
        this.agents = staff.filter(a => this.ROLES_LOGISTIQUE.includes(a.role));
        this.loading = false;
        this.cdr.markForCheck();
      }
    });

    this.venteService.getOrderLogisticsRealtime(this.orderId).subscribe(data => {
      this.logisticsData = data;
      if (data && data.agentIds) {
        this.controlForm.patchValue({ 
          selectedAgentIds: data.agentIds,
          internalNotes: data.internalNotes 
        });
      }
      this.cdr.markForCheck();
    });
  }

  // Gestion des Checkboxes
  onAgentToggle(agentId: string) {
    const currentIds: string[] = [...this.controlForm.value.selectedAgentIds];
    const index = currentIds.indexOf(agentId);

    if (index > -1) {
      currentIds.splice(index, 1); // Retirer si déjà présent
    } else {
      currentIds.push(agentId); // Ajouter si absent
    }

    this.controlForm.patchValue({ selectedAgentIds: currentIds });
    this.controlForm.get('selectedAgentIds')?.markAsTouched();
  }

  isAgentSelected(agentId: string): boolean {
    return this.controlForm.value.selectedAgentIds.includes(agentId);
  }

  getSelectedAgentsCount(): number {
    return this.controlForm.value.selectedAgentIds.length;
  }

  confirmAssignment() {
    if (this.controlForm.invalid || this.loading) return;
    this.loading = true;

    const { selectedAgentIds, internalNotes } = this.controlForm.value;

    // On envoie le tableau d'IDs au service
    this.venteService.assignMultipleAgents(this.orderId, selectedAgentIds, internalNotes)
      .subscribe({
        next: () => {
          this.loading = false;
          this.submitSuccess = true;
          this.cdr.markForCheck();
          setTimeout(() => { this.submitSuccess = false; this.cdr.markForCheck(); }, 2000);
        },
        error: () => { this.loading = false; this.cdr.markForCheck(); }
      });
  }
}