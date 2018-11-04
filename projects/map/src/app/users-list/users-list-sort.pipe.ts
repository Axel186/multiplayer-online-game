import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'usersListSort'
})
export class UsersListSortPipe implements PipeTransform {

  transform(users: any[]): any {
    return (users || []).sort((a, b) => b.score - a.score).splice(0, 10);
  }

}
