# Funcionamiento
El sistema crea las salas como objetos de la clase **Sala**.

Esta clase contiene un constructor, atributos y métodos para la administración de cada sala.

Para el diseño se usa Bootstrap.

# Funcionalidades del gestor
- Muestra todas las salas y su estado en el momento actual
- El sistema indica los problemas al intentar reservar una sala
  - Muestra un error cuando selecciona más de dos horas
  - Muestra un error si las horas no son congruentes

> **Nota:** Actualmente no funciona con base de datos externa, todos los datos son creados durante la ejecución.

# Futuras mejoras
- Terminar el CRUD con las restricciones solicitadas
- Agregar base de datos