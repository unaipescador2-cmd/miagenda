import { Component, computed, signal } from '@angular/core';

interface Contacto {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  grupo: string;
  favorito: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  contactos = signal<Contacto[]>([]);
  busqueda = signal('');

  numFavoritos = computed(() => this.contactos().filter((c) => c.favorito).length);

  filtrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    return this.contactos().filter((c) => c.nombre.toLowerCase().includes(texto));
  });

  constructor() {
    this.cargar();
  }

  async cargar() {
    const respuesta = await fetch('/contactos.json');
    const datos: Contacto[] = await respuesta.json();
    this.contactos.set(datos);
  }

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .slice(0, 2)
      .map((palabra) => palabra[0])
      .join('')
      .toUpperCase();
  }

  cambiarFavorito(id: number) {
    this.contactos.update((lista) =>
      lista.map((c) => (c.id === id ? { ...c, favorito: !c.favorito } : c)),
    );
  }
}