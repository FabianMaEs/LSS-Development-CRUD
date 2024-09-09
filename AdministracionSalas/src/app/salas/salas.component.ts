import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import Swal from 'sweetalert2';
import { SalasService } from '../salas.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './salas.component.html',
  styleUrl: './salas.component.css'
})
export class SalasComponent {

  // Inicialización de variables
  opcion = 'menu';
  reservas: any[] = [];
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
  bdVacia: boolean = false;
  errorServidor: boolean = false;


  /* 
  * El constructor recibe los servicios de UsuarioService y SalasService
  * Obtiene las salas y reservas de la base de datos y las almacena en las variables salas y reservas
  * Obtiene el usuario actual
  * Configura la fecha de hoy para México y la hora actual
  */
  constructor(public usuarioService: UsuarioService, private salasService: SalasService) {
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

    // Obtener salas y reservas de la base de datos al mismo tiempo
    forkJoin({
      salas: this.salasService.getSalas(),
      reservas: this.salasService.getReservas()
    }).subscribe(resultados => {
      this.salas = resultados.salas;
      this.reservas = resultados.reservas;

      // Formatear las reservas
      this.reservas.forEach((reserva: any) => {
        reserva.fecha = this.formateaFecha(reserva.fecha);
        reserva.horaInicio = this.formatTime(reserva.horaInicio);
        reserva.horaFin = this.formatTime(reserva.horaFin);
      });

      if (this.salas.length === 0 && this.reservas.length === 0) {
        this.bdVacia = true;
      }

      console.log('bdVacia', this.bdVacia);
      console.log('resultados', resultados);
      // Asegurarse de que reservas no está vacío y salas contiene datos
      if (this.salas && this.reservas) {
        this.salas.forEach(sala => {
          sala.reservas = this.reservas.filter((r: any) => r.id_sala === sala.id);
          console.log('Reservas de', sala.nombre, sala.reservas);
        });
      } else {
        console.log('No se encontraron salas o reservas.');
      }
      this.verificarEstadoSalas(this.salas);
    }, error => {
      console.error('Error al obtener las salas y reservas:', error);
      this.errorServidor = true;
    });
  }

  // Agregar una nueva sala a la base de datos solo si no hay error de servidor
  nuevaSala() {
    if (this.errorServidor) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede agregar una sala en este momento. Verifica la conexión al servidor.'
      });
      return;
    }
    else {
      Swal.fire({
        title: 'Agregar nueva sala',
        input: 'text',
        inputLabel: 'Nombre de la sala',
        inputPlaceholder: 'Nombre',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: (nombre) => {
          return this.salasService.agregarSala(nombre).subscribe(response => {
            if (response) {
              this.salas.push(new Sala(response.id, nombre));
              Swal.fire({
                icon: 'success',
                title: 'Sala agregada',
                text: `La sala ${nombre} ha sido agregada`
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar la sala'
              });
            }
          });
        }
      });
    }
  }

  // Formatea la fecha en formato YYYY
  formateaFecha(fechaString: string): string {
    const fecha = new Date(fechaString);
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2); // Mes con dos dígitos
    const day = ('0' + fecha.getDate()).slice(-2); // Día con dos dígitos
    return `${year}-${month}-${day}`;
  }

  // Formatea la hora en formato HH:MM
  formatTime(horaString: string): string {
    const hora = new Date('1970-01-01T' + horaString + 'Z'); // La fecha no importa, solo la hora
    const horas = ('0' + hora.getUTCHours()).slice(-2); // Hora con dos dígitos
    const minutos = ('0' + hora.getUTCMinutes()).slice(-2); // Minutos con dos dígitos
    return `${horas}:${minutos}`;
  }

  // Definir salas de prueba, si el servidor no responde mostrará una sala de error
  salas: Sala[] = [
    new Sala(1, 'Problemas con el servidor'),
    new Sala(2, 'No se pueden recuperar'),
    new Sala(3, 'las salas '),
  ];

  // Verifica el estado de las salas y actualiza el atributo estado
  verificarEstadoSalas(salas?: Sala[]) {
    if (salas) {
      salas.forEach(sala => {
        sala.estado = this.estaSalaOcupada(sala);
      });
    } else {
      console.log('Salas', this.salas);
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

  // Actualiza la hora actual y verifica el estado de las salas
  actualizarHora() {

    // Creo que forkJoin no es necesario aquí, ya que solo se necesita obtener las reservas
    forkJoin({
      reservas: this.salasService.getReservas()
    }).subscribe(resultados => {
      this.reservas = resultados.reservas;

      // Formatear las reservas con la fecha y hora en formato correcto
      this.reservas.forEach((reserva: any) => {
        reserva.fecha = this.formateaFecha(reserva.fecha);
        reserva.horaInicio = this.formatTime(reserva.horaInicio);
        reserva.horaFin = this.formatTime(reserva.horaFin);
      });

      // Asignar las reservas formateadas a las salas correspondientes
      if (this.salas && this.reservas) {
        this.salas.forEach(sala => {
          sala.reservas = this.reservas.filter((r: any) => r.id_sala === sala.id);
        });
      } else {
        console.log('No se encontraron salas o reservas.');
      }

      this.hoy = new Date(); // Actualiza this.hoy con la hora exacta
      this.horaActual = this.hoy.toTimeString().split(' ')[0].substring(0, 5); // Actualiza la hora actual en formato HH:MM
      this.verificarEstadoSalas(this.salas); // Verificar si alguna sala cambió su estado de ocupación
    });
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

  // Verifica que el horario de inicio y fin sean válidos dentro del rango de 07:00 a 23:00, muestra un mensaje de error si no lo es
  validarHoras() {
    const horaInicioValida = this.horaInicio !== null && this.horaInicio >= '07:00' && this.horaInicio <= '23:00';
    const horaFinValida = this.horaFin !== null && this.horaFin >= '07:00' && this.horaFin <= '23:00';

    if (!horaInicioValida || !horaFinValida) {
      this.errorReserva = 'Las horas deben estar entre las 07:00 y las 23:00';
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
      } else { // Muestra un mensaje de error si el horario no es válido
        this.esReservaValida = false;
        this.errorReserva = diferencia <= 0 ? 'La hora de fin debe ser mayor a la hora de inicio' : 'La reserva no puede ser mayor a 2 horas';
      }
    }
  }

  // Reserva la sala seleccionada si la fecha y horario son válidos y existen
  reservarSala() {

    // con this.actualizarHora(); se puede evitar que dos reservas se hagan al mismo tiempo, pero no se actualiza la vista
    // Puede ser útil actualizar la vista o verificar si la sala está ocupada antes de reservar, depende el caso de uso
    
    // Verifica que la sala seleccionada, la fecha y el horario sean válidos
    if (this.salaSeleccionada && this.esReservaValida && this.fechaSeleccionada && this.horaInicio && this.horaFin) {
      this.reserva = new Reserva(
        this.fechaSeleccionada,
        this.horaInicio,
        this.horaFin,
        this.usuarioService.get() || 'Todos',
        this.salaSeleccionada.id
      );

      // Verificar si salaSeleccionada y reservas están definidos antes de acceder a ellos
      const disponible = this.salaSeleccionada?.reservas?.every(r => {
        return r.fecha !== this.reserva?.fecha ||
          (this.reserva.horaFin <= r.horaInicio || this.reserva.horaInicio >= r.horaFin);
      }) ?? true; // Si reservas es null o undefined, asumir que la sala está disponible

      // Si la sala está disponible, agregar la reserva. Si no, mostrar un mensaje de error
      if (disponible) {
        this.salasService.agregarReserva(this.reserva.get()).subscribe(response => {
          Swal.fire({
            icon: 'success',
            title: 'Reserva exitosa',
            text: `${this.salaSeleccionada?.nombre}: ${this.reserva?.fecha} (${this.reserva?.horaInicio} - ${this.reserva?.horaFin})`
          });
        });
        this.salaSeleccionada?.reservas.push(this.reserva.get());
        this.salaSeleccionada.estado = this.estaSalaOcupada(this.salaSeleccionada);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La sala no está disponible en el horario seleccionado'
        });
      }
    }
  }

  // Eliminar la reserva de la sala seleccionada
  // El valor de confirmar es falso por defecto, si es verdadero, se mostrará un mensaje de confirmación
  eliminarReserva(reserva: { fecha: string, horaInicio: string, horaFin: string }, id_sala: number, confirmar: boolean = false) {
    
    // Mostrar confirmación
    const mensaje = confirmar ? 'modificar' : 'eliminar';
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: `¿Deseas ${mensaje} la reserva a las ${reserva.horaInicio}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        // Eliminar la reserva de la base de datos
        this.salasService.eliminarReserva(reserva.fecha, reserva.horaInicio, id_sala).subscribe(response => {
          // Actualizar la lista de reservas en la vista
          if (this.salaSeleccionada) {
            this.salaSeleccionada.reservas = this.salaSeleccionada.reservas.filter(r =>
              !(r.horaInicio === reserva.horaInicio && r.fecha === reserva.fecha)
            );

            this.salaSeleccionada.estado = this.estaSalaOcupada(this.salaSeleccionada);
          }
          // Si se trata de una modificación, no muestra el mensaje de confirmación
          if (!confirmar)
            Swal.fire({
              icon: 'success',
              title: 'Reserva eliminada',
              text: `La reserva a las ${reserva.horaInicio} ha sido eliminada`
            });
          else
            this.fechaSeleccionada = reserva.fecha;
          this.horaInicio = reserva.horaInicio;
          this.horaFin = reserva.horaFin;
          this.validarHoras();
        });
      }
    });
  }

  // Cambia la opción de vista a reservar y guarda la sala seleccionada
  cambiarVistaReservar(sala: Sala) {
    this.opcion = 'reservar';
    this.salaSeleccionada = sala;
    this.actualizarHora();
    this.verificarEstadoSalas(this.salas);
  }

  // Habilita la vista de todas las salas
  cambiarVistaMenu() {
    this.opcion = 'menu';
    this.actualizarHora();
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

  // Muestra las reservas de prueba si no se obtienen de la base de datos
  constructor(id: number, nombre: string, estado: boolean = false) {
    this.id = id;
    this.nombre = nombre;
    this.estado = estado;

    // Tomar estos valores si no se obtienen de la base de datos
    this.reservas = [
      { fecha: '2024-09-07', horaInicio: '08:00', horaFin: '08:59', usuario: 'reservas' },
      { fecha: '2024-09-07', horaInicio: '09:00', horaFin: '09:59', usuario: 'de' },
      { fecha: '2024-09-07', horaInicio: '21:00', horaFin: '22:00', usuario: 'prueba' },
      { fecha: '2024-09-08', horaInicio: '21:00', horaFin: '22:00', usuario: 'Todos' }
    ];
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
