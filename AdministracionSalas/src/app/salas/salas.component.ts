import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './salas.component.html',
  styleUrl: './salas.component.css'
})
export class SalasComponent {

  // Definir salas de prueba
  salas: Sala[] = [
    new Sala(1, 'Sala 1'),
    new Sala(2, 'Sala 2', true),
    new Sala(3, 'Sala 3'),
    new Sala(4, 'Sala 4', true),
    new Sala(5, 'Sala 5')
  ];

  // Inicialización de variables
  opcion = 'menu';
  reservas = [];
  salaSeleccionada: Sala | null = null;
  fechaSeleccionada: string | null = null;
  horaInicio: string | null = null;
  horaFin: string | null = null;
  esReservaValida: boolean = false;
  errorReserva: string | null = null;

  // Verifica que la sala no sea reservada por más de 2 horas
  validarHoras() {
    if (this.horaInicio && this.horaFin) {
      const inicio = new Date(`1970-01-01T${this.horaInicio}:00`); // Crea una fecha con la hora de inicio
      const fin = new Date(`1970-01-01T${this.horaFin}:00`);
      const diferencia = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60); // Obtienes la diferencia en horas
      
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
      this.salaSeleccionada.reservarSala(new Date(this.fechaSeleccionada), this.horaInicio, this.horaFin);
    }
  }

  // Cambia la opción de vista a reservar y guarda la sala seleccionada
  cambiarVistaReservar(sala: Sala) {
    this.opcion = 'reservar';
    this.salaSeleccionada = sala;
  }

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
  reservas = [{ hora: '', estado: false }];
  
  constructor(id: number, nombre: string, estado: boolean = false) {
    this.id = id;
    this.nombre = nombre;
    this.estado = estado;
    this.reservas = [
      { hora: '08:00', estado: true },
      { hora: '09:00', estado: true },
      { hora: '10:00', estado: true },
    ];
  }

  // Métodos de la clase
  // Reserva la sala en un horario específico
  reservarSala(fecha: Date, horaInicio: string, horaFin: string) {
    // Verificar si se puede reservar desde este método
  }

  // Elimina una reserva de la sala
  eliminarReserva(_t32: {}) {
    throw new Error('Method not implemented.');
    // Verificar si es el usuario que hizo la reserva
  }
}
