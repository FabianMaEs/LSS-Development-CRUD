import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalasComponent } from "./salas/salas.component";
import { NavbarComponent } from './navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SalasComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AdministracionSalas';
  ngOnInit() {
    console.log('Componente app inicializado');
  }

}
