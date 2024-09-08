import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  usuario: string | null = null;

  get(): string | null {
    return this.usuario;
  }

  set(usuario: string): void {
    this.usuario = usuario;
  }

  estaLogueado() {
    return this.usuario !== null;
  }

  limpiar() {
    this.usuario = null;
  }

}
