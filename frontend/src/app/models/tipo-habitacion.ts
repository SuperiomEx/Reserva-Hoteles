export interface TipoHabitacion {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad_personas: number;
  precio_base: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTipoHabitacionRequest {
  nombre: string;
  descripcion: string;
  capacidad_personas: number;
  precio_base: number;
}
