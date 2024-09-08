import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  providers: [UsuarioService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  usuario: any;
  constructor(private usuarioService: UsuarioService) {
    this.usuario = usuarioService.get();
  }
}
