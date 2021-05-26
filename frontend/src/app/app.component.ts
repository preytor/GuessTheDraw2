import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Title } from '@angular/platform-browser';
/// <reference path="../../typings/globals/socket.io-client/index.d.ts" /> 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private AuthService: AuthService, private HttpClient: HttpClient, private titleService: Title) {
    this.titleService.setTitle("Guess The Draw");

  }

  getauthService(){
    return this.AuthService;
  }

}
