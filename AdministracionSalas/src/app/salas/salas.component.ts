import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import Swal from 'sweetalert2';

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
  hoy: Date = new Date();
  usuario: string | null = null;
  horaActual: string | null = null;

  constructor(public usuarioService: UsuarioService) {
    // Configura la fecha de hoy para México
    this.hoy = new Date();
    this.hoy.setHours(this.hoy.getHours());
    console.log('Fecha de hoy', this.hoy);

    // Solo se puede seleccionar la fecha de hoy o posteriores
    this.fechaHoy = this.hoy.toISOString().split('T')[0];
    this.fechaSeleccionada = this.fechaHoy;
    this.usuario = usuarioService.get();
    this.horaActual = this.hoy.toTimeString().split(' ')[0].substring(0, 5);

    this.actualizarHora(); // Actualizar la hora al iniciar la aplicación
    this.configurarIntervalo(); // Configurar el intervalo dinámico
  }

  // Definir salas de prueba
  salas: Sala[] = [
    new Sala(1, 'Sala 1'),
    new Sala(2, 'Sala 2'),
    new Sala(3, 'Sala 3'),
    new Sala(4, 'Sala 4'),
    new Sala(5, 'Sala 5')
  ];

  // Actualiza la hora actual y verifica el estado de las salas
  actualizarHora() {
    this.hoy = new Date(); // Actualiza this.hoy con la hora exacta
    this.horaActual = this.hoy.toTimeString().split(' ')[0].substring(0, 5); // Actualiza la hora actual en formato HH:MM
    this.verificarEstadoSalas(this.salas); // Verificar si alguna sala cambió su estado de ocupación
  }

  // Configura el intervalo dinámico para actualizar la hora cada minuto
  configurarIntervalo() {
    const ahora = new Date();
    const segundosRestantes = 60 - ahora.getSeconds(); // Tiempo restante hasta el próximo minuto

    // Esperar el tiempo restante para el próximo minuto y actualizar la hora
    setTimeout(() => {
      this.actualizarHora();
      setInterval(() => this.actualizarHora(), 60000);
    }, segundosRestantes * 1000);
  }

  // Verifica el estado de las salas
  verificarEstadoSalas(sala?: Sala[]) {
    if(sala) {
      sala.forEach(sala => {
        sala.estado = this.estaSalaOcupada(sala);
        console.log('Sala', sala.id, 'Estado', sala.estado);
      });
    } else {
      console.log('Salas', this.salas);
    }
  }

  // Verifica que el horario de inicio y fin sean válidos dentro del rango de 07:00 a 22:00
  validarHoras() {
    const horaInicioValida = this.horaInicio !== null && this.horaInicio >= '07:00' && this.horaInicio <= '22:00';
    const horaFinValida = this.horaFin !== null && this.horaFin >= '07:00' && this.horaFin <= '22:00';

    if (!horaInicioValida || !horaFinValida) {
      this.errorReserva = 'Las horas deben estar entre las 07:00 y las 22:00';
      this.esReservaValida = false;
      return;
    }
    
    // Verifica que la sala no sea reservada por más de 2 horas y las horas sean congruentes
    if (this.horaInicio && this.horaFin) {
      const inicio = new Date(`1970-01-01T${this.horaInicio}:00`); // Crea una fecha con la hora de inicio
      const fin = new Date(`1970-01-01T${this.horaFin}:00`);
      const diferencia = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60); // Obtener la diferencia en horas
      
      // Habilita el botón de reservar si el horario es válido
      if (diferencia > 0 && diferencia <= 2) {
        this.esReservaValida = true;
      } else {
        this.esReservaValida = false;
        this.errorReserva = diferencia <= 0 ? 'La hora de fin debe ser mayor a la hora de inicio' : 'La reserva no puede ser mayor a 2 horas';
      }
    }
  }

  // Verifica si una sala está ocupada en este momento
  estaSalaOcupada(sala: Sala): boolean {
    const fechaHoy = this.hoy.toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    const horaActual = this.hoy.toTimeString().split(' ')[0].substring(0, 5); // Obtener la hora actual en formato HH:MM
    // Verificar si la sala tiene una reserva en la fecha y hora actual
    return sala.reservas.some(reserva => {
      return reserva.fecha === fechaHoy &&
            reserva.horaInicio <= horaActual &&
            reserva.horaFin >= horaActual;
    });
  }


  // Reserva la sala seleccionada si la fecha y horario son válidos y existen
  reservarSala() {
    if (this.salaSeleccionada && this.esReservaValida && this.fechaSeleccionada && this.horaInicio && this.horaFin) {
      // Guardar en la BD la reserva
      // Fecha, horas, sala y usuario
      this.reserva = new Reserva(this.fechaSeleccionada, this.horaInicio, this.horaFin, this.usuarioService.get() || 'Todos', this.salaSeleccionada.id);
      this.salaSeleccionada.reservarSala(this.reserva, this.salaSeleccionada.nombre);
      console.log('Reserva', this.reserva.get());
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
    this.verificarEstadoSalas(this.salas);
  }

  // Habilita la vista de todas las salas
  cambiarVistaMenu() {
    this.opcion = 'menu';
    this.verificarEstadoSalas(this.salas);
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
      { fecha: '2024-09-07', horaInicio: '08:00', horaFin: '08:59', usuario: 'fabmac865@gmail.com' },
      { fecha: '2024-09-07', horaInicio: '09:00', horaFin: '09:59', usuario: 'Fabian' },
      { fecha: '2024-09-07', horaInicio: '21:00', horaFin: '22:00', usuario: 'Todos' },
    ];

  }

  // Métodos de la clase
  reservarSala(reserva: Reserva, nombreSala: string) {
    // Verificar si la sala está disponible en el horario seleccionado y no se solapan las reservas
    const disponible = this.reservas.every(r => {
      return r.fecha !== reserva.fecha || 
             (reserva.horaFin <= r.horaInicio || reserva.horaInicio >= r.horaFin);
    });
  
    if (disponible) {
      this.reservas.push(reserva);
      Swal.fire({
        icon: 'success',
        title: 'Reserva exitosa',
        text: `${nombreSala}: ${reserva.fecha} (${reserva.horaInicio} - ${reserva.horaFin})`
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La sala no está disponible en el horario seleccionado'
      });
    }
  }

  // Elimina una reserva de la sala
  eliminarReserva(reserva: { horaInicio: string, usuario: string}) {
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la reserva a las ${reserva.horaInicio}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservas = this.reservas.filter(r => r.horaInicio !== reserva.horaInicio);
        Swal.fire({
          icon: 'success',
          title: 'Reserva eliminada',
          text: `La reserva a las ${reserva.horaInicio} ha sido eliminada`
        });
      }
    });
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
