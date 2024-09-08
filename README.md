> **Nota:** El proyecto principal se encuentra en la carpeta `AdministracionSalas`.

# Funcionamiento
El sistema crea las salas como objetos de la clase **Sala**.
Esta clase contiene atributos como nombre, el estado actual y una lista de reservas. La clase incluye métodos para reservar y eliminar reservas. Asegura que no haya conflictos con los horarios.

Las reservas se crear como objetos de la clase **Reserva**.
Esta clase contiene atributos como la sala, el usuario, la fecha y el horario reservado.

Para la interfaz se usa Bootstrap y SweetAlert2.

# Funcionalidades del gestor
- **Visualización de salas:** Muestra todas las salas disponibles y su estado actual (disponible u ocupada).
  - **Actualización automática:** La disponibilidad de las salas se actualiza automáticamente cada minuto
- **Reserva de salas:** Permite a los usuarios seleccionar una sala, una fecha, y un rango de horas para realizar una reserva, siempre que cumpla con las siguientes restricciones:
  - La duración de la reserva no puede exceder las 2 horas.
  - Las horas de inicio y fin deben ser congruentes (la hora de inicio debe ser anterior a la de finalización).
  - Solo se permiten fechas iguales o posteriores a la fecha actual.
  - El sistema no permite reservar una sala si ya está ocupada en el rango de horas seleccionado.
- **Manejo de errores:** Si el usuario intenta hacer una reserva que no cumple con las restricciones, el sistema mostrará mensajes de error específicos para guiar al usuario.

> **Nota:** Actualmente no funciona con base de datos externa, todos los datos son creados durante la ejecución.

# Futuras mejoras
- Terminar el CRUD con las restricciones solicitadas:
  - **Completado:** Implementar la funcionalidad para reservar una sala de juntas con un rango de horario inicial y final.
  - **Completado:** Impedir la reserva de salas de juntas que ya estén ocupadas.
  - **Completado:** Restringir la duración máxima de la reserva a 2 horas.
  - **Completado:** Implementar la liberación automática de la sala de juntas al vencer el horario de reserva.
  - **Completado:** Permitir la liberación manual de la sala de juntas antes de finalizar el tiempo de reserva.
    > **Nota:** El usuario tiene total control de sus reservas. Solo él puede eliminar las reservas hechas por él mmismo.

- Agregar base de datos.
- Permitir registro de usuarios
  - **Completado:** El usuario solo puede eliminar o modificar sus reservas, no las de los demás usuarios.