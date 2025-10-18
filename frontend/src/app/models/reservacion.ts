import { TipoHabitacion } from './tipo-habitacion';

export interface Huesped {
  id: number;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  numero_identidad: string;
  correo_electronico: string;
  numero_contacto: string;
  sexo: string;
  fecha_nacimiento: string | null;
  nacionalidad: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Habitacion {
  id: number;
  numero_habitacion: string;
  tipo_habitacion: number | TipoHabitacion;
  tipo_habitacion_nombre?: string;
  descripcion: string;
  informacion_adicional: any;
  estado: string;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reservacion {
  id: number;
  numero_confirmacion: string;
  huesped: number | Huesped;
  huesped_nombre?: string;
  habitacion: number | Habitacion;
  habitacion_numero?: string;
  fecha_llegada: string;
  fecha_salida: string;
  precio: number;
  estado: string;
  metodo_pago: string;
  observaciones: string;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReservacionCreate {
  huesped: number;
  habitacion: number;
  fecha_llegada: string;
  fecha_salida: string;
  precio: number;
  metodo_pago: string;
  observaciones?: string;
}

export interface EstadoReservacion {
  PENDIENTE: string;
  CONFIRMADA: string;
  EN_CURSO: string;
  COMPLETADA: string;
  CANCELADA: string;
}

export interface ReservacionFilter {
  huesped_id?: number;
  habitacion_id?: number;  
  numero_habitacion?: string;
  activa?: boolean;
  estado?: string;
  fecha_llegada_desde?: string;
  fecha_llegada_hasta?: string;
}

export interface DashboardData {
  habitaciones: {
    total: number;
    disponibles: number;
    ocupadas: number;
    porcentaje_ocupacion: number;
  };
  huespedes: {
    total_activos: number;
  };
  reservaciones: {
    activas: number;
    check_ins_hoy: number;
    check_outs_hoy: number;
  };
  ingresos: {
    mes_actual: number;
  };
  ocupacion_por_tipo: Array<{
    nombre: string;
    total_habitaciones: number;
    ocupadas: number;
  }>;
  reservaciones_recientes: Array<{
    id: number;
    huesped_detalle?: {
      nombres: string;
      apellidos: string;
    };
    habitacion_detalle?: {
      numero_habitacion: string;
    };
    habitacion?: string;
    fecha_llegada: string;
    fecha_salida: string;
    estado: string;
    precio_total?: number;
    precio?: number;
  }>;
}
