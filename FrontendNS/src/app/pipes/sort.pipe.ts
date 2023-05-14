import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(values: any[], parameter: string, sortBy: string): any[] {
    if (!values || values.length === 0 || !parameter ) {
      return values;
    }

    const sortOrder = parameter === 'descending' ? -1: 1;

    return values.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1 * sortOrder;
      } else if (a[sortBy] > b[sortBy]) {
        return 1 * sortOrder;
      } else {
        return 0;
      }
    });
  }
}
