// navbar.component.ts
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  usuario: any;

  constructor(private usuarioService: UsuarioService) {
    this.usuario = usuarioService.get();
  }

  cerrarSesion() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar la sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.limpiar();
        this.usuario = null;
      }
    });
  }
  
  mostrarFormularioLogin() {
    // Definición del tipo LoginFormResult
    type LoginFormResult = {
      username: string;
      password: string;
    };

    Swal.fire<LoginFormResult>({
      title: 'Iniciar sesión',
      /* html: `
        <input type="text" id="username" class="swal2-input" placeholder="Username">
        <input type="password" id="password" class="swal2-input" placeholder="Password">
      `, */
      html: `
        <input type="text" id="username" class="swal2-input" placeholder="Usuario">
      `,
      confirmButtonText: 'Iniciar sesión',
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup()!;
        const usernameInput = popup.querySelector('#username') as HTMLInputElement;
        //const passwordInput = popup.querySelector('#password') as HTMLInputElement;

        usernameInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm();
        //passwordInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm();
      },
      preConfirm: () => {
        const username = (document.querySelector('#username') as HTMLInputElement).value;
        //const password = (document.querySelector('#password') as HTMLInputElement).value;

        // if (!username || !password) {
        if (!username) {
          Swal.showValidationMessage('Por favor, ingresa tu usuario');
          return;
        }

        // return { username, password };
        return { username };
      }
    }).then(({ value }) => {
      if (value) {
       // Verificar en la base de datos si el usuario existe

        // Mostrar mensaje de bienvenida
        Swal.fire({
          title: `¡Bienvenido, ${value.username}!`,
          icon: 'success'
        });
        this.usuarioService.set(value.username);
        this.usuario = this.usuarioService.get();
      }
    });
  }
}
