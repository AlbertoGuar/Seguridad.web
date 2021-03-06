import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Login } from '../model';
import { Usuario } from '../model';
import { LoginService } from '../service';
import { UsuarioService } from '../service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
    loading = false;
    usuari: Usuario;
    usuario: Usuario;
  currentUser: Login;
  currentUserSubscription: Subscription;
  users: Login[] = [];

  constructor(
      private router: Router,
      private authenticationService: LoginService,
      private loginService: LoginService,
      private usuarioService: UsuarioService
  ) {
    
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
          this.currentUser = user;
      });
      
  }

  ngOnInit() {
    this.loading = true;
    this.usuari = JSON.parse(localStorage.getItem('currentUser'));
    let username = this.usuari["username"];

    this.usuarioService.usuarioid(username).pipe(first()).subscribe(user => {
        this.usuario = user;
        this.loading = false;
    });
  }

  ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.currentUserSubscription.unsubscribe();
  }
  
  /*
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    
}
*/


}
