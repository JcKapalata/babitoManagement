import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Toast } from '../Notification/toast/toast';
import { RouterOutlet } from '@angular/router';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar, Toast, MatIcon],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  isSidebarCollapsed = true; // Fermé par défaut sur mobile

  onToggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Si l'agent touche le contenu, on ferme le menu
  closeSidebarOnMobile() {
    if (window.innerWidth <= 768 && !this.isSidebarCollapsed) {
      this.isSidebarCollapsed = true;
    }
  }
}
