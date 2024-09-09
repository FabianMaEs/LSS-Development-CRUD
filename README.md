> **Nota:** El proyecto principal se encuentra en la carpeta `AdministracionSalas`.

> **Nota:** El servidor de este proyecto y la base de datos se encuentran <a href="https://github.com/FabianMaEs/LSS-Development-CRUD-Server" target="_blank">aquí</a>

# Funcionamiento
El sistema crea las salas como objetos de la clase **Sala**.
Esta clase contiene atributos como nombre, el estado actual y una lista de reservas. La clase incluye métodos para reservar y eliminar reservas. Asegura que no haya conflictos con los horarios.

Las reservas se crear como objetos de la clase **Reserva**.
Esta clase contiene atributos como la sala, el usuario, la fecha y el horario reservado.

Para la interfaz se usa Bootstrap y SweetAlert2.

# Funcionalidades del gestor
- **Visualización de salas:** Muestra todas las salas disponibles y su estado actual (disponible u ocupada).
  - **Actualización automática:** La disponibilidad de las salas se actualiza cada minuto
- **Reserva de salas:** Permite a los usuarios seleccionar una sala, una fecha, y un rango de horas para realizar una reserva, siempre que cumpla con las siguientes restricciones:
  - La duración de la reserva no puede exceder las 2 horas.
  - Las horas de inicio y fin deben ser congruentes (la hora de inicio debe ser anterior a la de finalización).
  - Solo se permiten fechas iguales o posteriores a la fecha actual.
  - Verificación de disponibilidad en el rango seleccionado.
- **Manejo de errores:** Si el usuario intenta hacer una reserva que no cumple con las restricciones, el sistema mostrará mensajes de error específicos para guiar al usuario.

# Futuras mejoras (completadas)
- Terminar el CRUD con las restricciones solicitadas:
  - Implementar la funcionalidad para reservar una sala de juntas con un rango de horario inicial y final.
  - Impedir la reserva de salas de juntas que ya estén ocupadas.
  - Restringir la duración máxima de la reserva a 2 horas.
  - Implementar la liberación automática de la sala de juntas al vencer el horario de reserva.
  - Permitir la liberación manual de la sala de juntas antes de finalizar el tiempo de reserva.
- Agregar base de datos.
- Permitir registro de usuarios

# Características extras a las solicitadas
- Inicio de sesión
  - Permite a cada usuario gestionar sus reservas. Sin contraseñas para pruebas.
  - Todos los usuarios (con y sin sesión iniciada) pueden eliminar o modificar las reservas del usuario 'Todos'.
- Estado actual de las salas
  - Actualización constante del estado de las salas en tiempo real.
  - Se actualiza constantemente, por lo que cualquier reserva hecha en otra instancia de la aplicación se mostrará en menos de un minuto.
- Reservaciones
  - Cualquier usuario puede reservar cualquier sala si la fecha y hora no se superpone a otra reservación.
  - Muestra un mensaje de error si no se puede reservar en ese horario.
  - Opción para eliminar o modificar la reservación.
    - Si una sala está ocupada en el momento actual y la reserva se elimina, la sala se liberará. Por el contrario, si una sala está disponible y se reserva para el momento actual, la sala dejará de estar disponible.
- Manejo de errores
  - Comunicaciones claras sobre problemas de conexión, datos incorrectos, y disponibilidad.