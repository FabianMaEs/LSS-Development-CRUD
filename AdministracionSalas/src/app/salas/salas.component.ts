import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
    ],
    providers: [
      UsuarioService
    ],
  templateUrl: './salas.component.html',
  styleUrl: './salas.component.css'
})
export class SalasComponent {

    constructor(private usuarioService: UsuarioService) {
      // Configura la fecha de hoy para México
      const hoy = new Date();
      hoy.setHours(hoy.getHours() - 6); // Resta 6 horas (UTC-6)

      // Solo se puede seleccionar la fecha de hoy o posteriores
      this.fechaHoy = hoy.toISOString().split('T')[0];
      this.fechaSeleccionada = this.fechaHoy;

      this.usuario = usuarioService.get();

  }

  // Definir salas de prueba
  salas: Sala[] = [
    new Sala(1, 'Sala 1', true),
    new Sala(2, 'Sala 2', true),
    new Sala(3, 'Sala 3'),
    new Sala(4, 'Sala 4', true),
    new Sala(5, 'Sala 5')
  ];

  // Inicialización de variables
  opcion = 'menu';
  reservas = [];
  reserva: Reserva | null = null;
  salaSeleccionada: Sala | null = null;
  fechaSeleccionada: string | null = null;
  horaInicio: string | null = null;
  horaFin: string | null = null;
  esReservaValida: boolean = false;
  errorReserva: string | null = null;
  fechaHoy: string;
  usuario: string | null = null;

  // Verifica que la sala no sea reservada por más de 2 horas
  validarHoras() {
    if (this.horaInicio && this.horaFin) {
      const inicio = new Date(`1970-01-01T${this.horaInicio}:00`); // Crea una fecha con la hora de inicio
      const fin = new Date(`1970-01-01T${this.horaFin}:00`);
      const diferencia = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60); // Obtener la diferencia en horas
      
      // Habilita el botón de reservar si el horario es válido
      if (diferencia > 0 && diferencia <= 2) {
        this.esReservaValida = true;
      } else {
        this.esReservaValida = false;
        if (diferencia <= 0) {
          this.errorReserva = 'La hora de fin debe ser mayor a la hora de inicio';
        } else {
          this.errorReserva = 'La reserva no puede ser mayor a 2 horas';
        }
      }
    }
  }

  // Reserva la sala seleccionada si la fecha y horario son válidos y existen
  reservarSala() {
    if (this.salaSeleccionada && this.esReservaValida && this.fechaSeleccionada && this.horaInicio && this.horaFin) {
      // Guardar en la BD la reserva
      // Fecha, horas, sala y usuario
      this.reserva = new Reserva(this.fechaSeleccionada, this.horaInicio, this.horaFin, 'NombreUsuario', this.salaSeleccionada.id);
      this.salaSeleccionada.reservarSala(this.reserva);
    }
  }

  // Eliminar la reserva de la sala seleccionada
  eliminarReserva(reserva: { horaInicio: string, horaFin: string, usuario: string }) {
    this.salaSeleccionada?.eliminarReserva(reserva);
  }

  // Cambia la opción de vista a reservar y guarda la sala seleccionada
  cambiarVistaReservar(sala: Sala) {
    this.opcion = 'reservar';
    this.salaSeleccionada = sala;
  }

  // Habilita la vista de todas las salas
  cambiarVistaMenu() {
    this.opcion = 'menu';
  }
  
}

// Definición de la clase Sala
class Sala {

  // Atributos de la clase
  id: number;
  nombre: string;
  estado: boolean;
  reservas = [{ fecha: '', horaInicio: '', horaFin: '', usuario: 'Null' }];
  
  constructor(id: number, nombre: string, estado: boolean = false) {
    this.id = id;
    this.nombre = nombre;
    this.estado = estado;
    this.reservas = [
      { fecha: '2024-09-07', horaInicio: '08:00', horaFin: '08:59', usuario: 'NombreUsuario' },
      { fecha: '2024-09-07', horaInicio: '09:00', horaFin: '09:59', usuario: 'Fabian' },
      { fecha: '2024-09-07', horaInicio: '10:00', horaFin: '10:59', usuario: 'NombreUsuario' },
    ];
  }

  // Métodos de la clase

  // Reserva la sala, recibe un objeto de tipo Reserva
    reservarSala(reserva: Reserva) {
    // Verificar si la sala está disponible en el horario seleccionado y no se solapan las reservas
    const disponible = this.reservas.every(r => {
      return r.fecha !== reserva.fecha || 
             (reserva.horaFin <= r.horaInicio || reserva.horaInicio >= r.horaFin);
    });
  
    if (disponible) {
      this.reservas.push(reserva);
    } else {
      alert('La sala no está disponible en el horario seleccionado');
    }
  }

  // Elimina una reserva de la sala
  eliminarReserva(reserva: { horaInicio: string, usuario: string}) {
    console.log('Eliminando reserva', reserva);
    // Verificar si es el usuario que hizo la reserva
    this.reservas = this.reservas.filter(r => r.horaInicio !== reserva.horaInicio);
  }
}

class Reserva {
  // Atributos de la clase
  fecha: string;
  horaInicio: string;
  horaFin: string;
  usuario: string;
  idSala: number;

  constructor(fecha: string, horaInicio: string, horaFin: string, usuario: string, idSala: number) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.usuario = usuario;
    this.idSala = idSala;
  }

  // Métodos de la clase
  get() {
    return {
      fecha: this.fecha,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      usuario: this.usuario,
      idSala: this.idSala
    };
  }
}