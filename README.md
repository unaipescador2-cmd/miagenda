# MiAgenda

App Angular de un solo componente que muestra una agenda de contactos.

## Funcionalidades
- Tarjetas generadas desde `public/contactos.json` con `@for`
- Favoritos con contador en el menú (guardados en localStorage)
- Buscador por nombre en tiempo real
- Filtro por grupo (Todos, Clase, Familia, Trabajo), combinado con el buscador

## Cómo ejecutarlo
    npm install
    npx ng serve
Abrir http://localhost:4200

## Tecnologías
Angular, TypeScript, signals, Bootstrap 5