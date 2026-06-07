import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, searchValue: any): any {
    if (!searchValue) return value;
    return value.filter((v: { EMP_ID: string; EMP_NAME: string; }) =>
      v.EMP_ID.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
      v.EMP_NAME.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
  }
}
