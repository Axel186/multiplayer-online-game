import {Component} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  cellSize = 48;
  users$: any = this.db.list('users').valueChanges();
  cookie$ = this.db.object('cookie').valueChanges();

  constructor(private db: AngularFireDatabase) {
  }

  trackByFn(index, item) {
    return index; // or item.id
  }
}
