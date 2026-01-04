import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Toast } from '../Notification/toast/toast';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar, Toast],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
