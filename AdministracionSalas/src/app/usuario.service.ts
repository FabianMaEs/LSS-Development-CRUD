import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  usuario: string | null = null;

  get() {
    return this.usuario;
  }

  set(usuario: string) {
    this.usuario = usuario;
  }

  limpiar() {
    this.usuario = null;
  }

}
