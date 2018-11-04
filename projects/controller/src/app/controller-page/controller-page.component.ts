import {Component} from '@angular/core';
import * as Cookies from 'js-cookie';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {config} from '../../../../../config';

@Component({
  selector: 'app-controller-page',
  templateUrl: './controller-page.component.html'
})
export class ControllerPageComponent {
  user;
  loading = false;

  constructor(private router: Router,
              private http: HttpClient) {
    this.initUser();
  }

  onButtonPress(direction: string) {
    this.loading = true;
    (window).navigator.vibrate(100);

    this.sendMoveAction(direction);

    setTimeout(() => {
      this.loading = false;
    }, 850);
  }

  initUser() {
    this.user = Cookies.getJSON('user');
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  sendMoveAction(direction: string) {
    this.http.post(config.cloudFunctionsUrl + '/onMoveAction', {userId: this.user.id, direction: direction})
      .toPromise()
      .catch((err) => {
        if (err.error && err.error.code === 'user_not_found') {
          this.router.navigate(['/login']);
        }
      });
  }
}
