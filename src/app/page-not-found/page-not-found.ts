import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [MatIconModule],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css',
})
export class PageNotFound {
  private router = inject(Router);

  goToLogin(){
    this.router.navigate(['login'])
  }
}
