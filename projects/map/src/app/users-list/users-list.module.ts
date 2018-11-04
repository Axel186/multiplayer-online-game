import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersListComponent} from './users-list.component';
import {UsersListSortPipe} from './users-list-sort.pipe';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    UsersListComponent,
    UsersListSortPipe
  ],
  exports: [UsersListComponent]
})
export class UsersListModule {
}
