import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import * as Cookies from 'js-cookie';
import {config} from '../../../../../config';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {

  fullName: string;
  loading = false;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  onSubmit() {
    if (!this.fullName) {
      return alert('No name entered!');
    }

    if (this.loading) {
      return;
    }

    this.loading = true;

    this.http.post(config.cloudFunctionsUrl + '/onUserCreate', {name: this.fullName})
      .toPromise()
      .then((user) => {
        Cookies.set('user', user);
        this.router.navigate(['/']);
      })
      .catch(err => alert(err.message))
      .then(() => this.loading = false);
  }

}
