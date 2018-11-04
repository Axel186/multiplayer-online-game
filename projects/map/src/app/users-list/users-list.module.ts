import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersListComponent} from './users-list.component';
import {UsersListSortPipe} from './users-list-sort.pipe';
import {HttpClientModule} from '@angular/common/http';
import {UserCardComponent} from './user-card/user-card.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    UsersListComponent,
    UsersListSortPipe,
    UserCardComponent
  ],
  exports: [
    UsersListComponent,
    UserCardComponent
  ]
})
export class UsersListModule {
}
