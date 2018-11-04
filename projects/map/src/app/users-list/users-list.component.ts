import {Component} from '@angular/core';
import {Subject} from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';
import {HttpClient} from '@angular/common/http';
import {config} from '../../../../../config';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html'
})
export class UsersListComponent {

  users$ = this.db.list('users').valueChanges();
  cookie$ = this.db.object('cookie').valueChanges();

  showStartButton$ = new Subject();
  isWinner$ = new Subject();
  worksUntil = 3;

  constructor(private db: AngularFireDatabase,
              private http: HttpClient) {
    this.users$
      .subscribe(users => {
        const winner = users.find((user: any) => user.score === this.worksUntil);
        this.isWinner$.next(winner);
      });

    this.cookie$
      .subscribe(cookie => this.showStartButton$.next(!cookie));
  }

  start() {
    this.http.get(config.cloudFunctionsUrl + '/onStart').toPromise();
  }
}
