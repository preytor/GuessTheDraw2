import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
/// <reference path="../../typings/globals/socket.io-client/index.d.ts" /> 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private AuthService: AuthService, private HttpClient: HttpClient) {}

  getauthService(){
    return this.AuthService;
  }

}
