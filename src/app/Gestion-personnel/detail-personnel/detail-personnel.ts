import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PersonnelService } from '../personnel-service';
@Component({
  selector: 'app-detail-personnel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-personnel.html',
  styleUrl: './detail-personnel.css',
})
export class DetailPersonnel implements OnInit {
  private route = inject(ActivatedRoute);
  private personnelService = inject(PersonnelService);

  user = signal<any>(null);
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchDetails(id);
    } 
  }

  fetchDetails(id: string) {
    this.personnelService.getAccountDetails(id).subscribe({
      next: (data) => {
        this.user.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  
}