import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalasComponent } from "./salas/salas.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SalasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AdministracionSalas';
  ngOnInit() {
    console.log('Componente app inicializado');
  }

}
