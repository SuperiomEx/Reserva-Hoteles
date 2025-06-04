import { TipoHabitacion } from './tipo-habitacion';

export interface Habitacion {
  id: number;
  numero: string;
  tipo: TipoHabitacion;
  estado: 'disponible' | 'ocupada' | 'mantenimiento' | 'reservada';
  precio: number;
  descripcion: string;
  capacidad: number;
  comodidades: {
    wifi?: boolean;
    tv?: boolean;
    minibar?: boolean;
    aire_acondicionado?: boolean;
    balcon?: boolean;
    jacuzzi?: boolean;
    [key: string]: any;
  };
  activa: boolean;
  creado: string;
  modificado: string;
}

export interface HabitacionDisponible extends Habitacion {
  disponible: boolean;
}
