import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrivateSitesGuard implements CanActivate {

  constructor(private AuthService: AuthService, private router: Router){ }

  canActivate(): boolean {
    if(this.AuthService.isLogged()){
      return true;
    } 
    this.router.navigateByUrl('/login');
    return false;
  }
  
}
