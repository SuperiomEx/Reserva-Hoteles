import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoPrecio',
  standalone: true
})
export class FormatoPrecioPipe implements PipeTransform {

  transform(value: number | string | null | undefined, currency: string = 'EUR'): string {
    if (value === null || value === undefined || value === '') {
      return '0,00 €';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return '0,00 €';
    }

    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(numValue);
  }
}
