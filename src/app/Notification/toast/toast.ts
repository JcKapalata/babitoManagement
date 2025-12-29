import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../notification-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast implements OnInit{
  private notify = inject(NotificationService);
  message: string | null = null;
  type: 'success' | 'error' = 'success';

  ngOnInit() {
    this.notify.toast$.subscribe(data => {
      this.message = data.message;
      this.type = data.type;

      // Faire disparaître le toast après 3 secondes
      setTimeout(() => this.message = null, 2000);
    });
  }
}
