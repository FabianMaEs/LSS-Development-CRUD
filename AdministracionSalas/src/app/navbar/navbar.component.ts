// navbar.component.ts
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalasService } from '../salas.service';

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

  constructor(private usuarioService: UsuarioService, private salasService: SalasService) {
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
      //password: string;
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
        this.verificarUsuario(value.username).then((existeUsuario) => {
          if (existeUsuario) {
            // Mostrar mensaje de bienvenida
            Swal.fire({
              title: `¡Bienvenido, ${value.username}!`,
              icon: 'success'
            });
            this.usuarioService.set(value.username);
            this.usuario = this.usuarioService.get();
          } else {
            // No existe el usuario, mostrar mensaje de advertencia y crearlo
            Swal.fire({
              title: `Usuario no encontrado, se creará uno nuevo`,
              icon: 'warning'
            });
            this.usuarioService.set(value.username);
            this.usuario = this.usuarioService.get();
            // Agregar el nuevo usuario
            this.salasService.agregarUsuario(value.username).subscribe(
              (response) => {
                console.log('Usuario creado exitosamente:', response);
              },
              (error) => {
                console.error('Error al crear el usuario:', error);
              }
            );
          }
        });
      }
    }); 
    
  }

  async verificarUsuario(usuario: string): Promise<boolean> {
    const resultado = await this.salasService.verificarUsuario(usuario).toPromise();
    return resultado.length > 0;
  }

  async agregarUsuario(usuario: string): Promise<any> {
    return await this.salasService.agregarUsuario(usuario).toPromise();
  }
}
