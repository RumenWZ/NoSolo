import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], filterString: string): any {
    if(value.length === 0 || filterString === ''){
      return value;
    }

    filterString = filterString.toLowerCase();

    return value.filter((item: any) =>
    item.name.toLowerCase().includes(filterString)
  );
  }

}
