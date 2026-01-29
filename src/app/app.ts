import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileService } from './Profile/profile-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private profileService = inject(ProfileService);

  async ngOnInit() {
    // Initialiser ProfileService après que Firebase soit prêt
    console.log('🚀 App initialized, initializing ProfileService...');
    await this.profileService.initAuth();
    console.log('✅ ProfileService initialization complete');
  }
}
