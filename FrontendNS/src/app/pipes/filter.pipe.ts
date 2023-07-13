import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], filterString: string, filterBy: string): any {
    if (!value || value.length === 0 || filterString === '' || !filterBy) {
      return value;
    }

    filterString = filterString.toLowerCase();

    return value.filter((item: any) =>
      item[filterBy].toLowerCase().includes(filterString)
    );
  }

}
