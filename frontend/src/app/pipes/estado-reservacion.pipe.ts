import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoReservacion',
  standalone: true
})
export class EstadoReservacionPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const estados: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'en_curso': 'En Curso',
      'completada': 'Completada',
      'cancelada': 'Cancelada',
      'checkin': 'Check-in',
      'checkout': 'Check-out'
    };

    return estados[value.toLowerCase()] || value;
  }
}
