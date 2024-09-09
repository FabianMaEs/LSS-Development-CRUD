import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalasService {
  // Conexion a la base de datos
  private apiUrl = 'http://localhost:3000/';
  static apiUrl: string;
  static http: any;

  constructor(private http: HttpClient) { }

  getSalas(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'salas');
  }

  getReservas(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'reservas');
  }

  agregarReserva(reserva: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'agregar_reserva', reserva);
  }
  verificarUsuario(usuario: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'verificar_usuario/' + usuario);
  }

  agregarUsuario(usuario: string): Observable<any> {
    console.log(this.apiUrl + 'registro_usuario POST:' + usuario);
    return this.http.post<any>(this.apiUrl + 'registro_usuario', { usuario });
  }

  eliminarReserva(fecha: string, horaInicio: string, id_sala: number) {
    console.log(this.apiUrl + 'eliminar_reserva/' + fecha + '/' + horaInicio + '/' + id_sala);
    return this.http.delete<any>(this.apiUrl + 'eliminar_reserva/' + fecha + '/' + horaInicio + '/' + id_sala);
  }

  agregarSala(nombre: any) {
    return this.http.post<any>(this.apiUrl + 'agregar_sala', { nombre });
  }

}