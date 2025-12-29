import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef); // On injecte le détecteur de changements
  
  message: string | null = null;
  type: 'success' | 'error' = 'success';

  ngOnInit() {
    this.notify.toast$.subscribe(data => {
      this.message = data.message;
      this.type = data.type;
      
      // On force l'affichage du message dès qu'il arrive
      this.cdr.detectChanges(); 

      // Faire disparaître le toast après 2 secondes
      setTimeout(() => {
        this.message = null;
        // On force Angular à voir que le message est maintenant null
        this.cdr.detectChanges(); 
      }, 3000);
    });
  }
}
