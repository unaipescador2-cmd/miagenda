import { Component, computed, signal } from '@angular/core';

interface Contacto {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  grupo: string;
  favorito: boolean;
}

const CLAVE_FAVORITOS = 'miagenda-favoritos';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  contactos = signal<Contacto[]>([]);
  busqueda = signal('');
  grupoActivo = signal('Todos');

  grupos = ['Todos', 'Clase', 'Familia', 'Trabajo'];

  numFavoritos = computed(() => this.contactos().filter((c) => c.favorito).length);

  // Combina el buscador y el filtro por grupo
  filtrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const grupo = this.grupoActivo();
    return this.contactos().filter(
      (c) =>
        c.nombre.toLowerCase().includes(texto) &&
        (grupo === 'Todos' || c.grupo === grupo),
    );
  });

  constructor() {
    this.cargar();
  }

  async cargar() {
    const respuesta = await fetch('/contactos.json');
    const datos: Contacto[] = await respuesta.json();

    // Si hay favoritos guardados, mandan sobre los del JSON
    const guardados = this.leerFavoritos();
    this.contactos.set(
      guardados
        ? datos.map((c) => ({ ...c, favorito: guardados.includes(c.id) }))
        : datos,
    );
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
    this.guardarFavoritos();
  }

  private guardarFavoritos() {
    const ids = this.contactos()
      .filter((c) => c.favorito)
      .map((c) => c.id);
    try {
      localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(ids));
    } catch {
      // Si localStorage no está disponible, la app sigue funcionando sin guardar
    }
  }

  private leerFavoritos(): number[] | null {
    try {
      const texto = localStorage.getItem(CLAVE_FAVORITOS);
      return texto ? JSON.parse(texto) : null;
    } catch {
      return null;
    }
  }
}