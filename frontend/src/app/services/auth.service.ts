import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { loginUser } from '../models/loginUser';
import { registerUser } from '../models/registerUser';
import { JwtResponse } from '../models/jwt-response';

import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable()
export class AuthService {
  AUTH_SERVER: string = 'http://localhost:3000';  //the backend server
  authSubject = new BehaviorSubject(false);
  private token: string | null | undefined;
  constructor(private httpClient: HttpClient) { }

  signIn(loginUser: loginUser){
    return this.httpClient.post(`${this.AUTH_SERVER}/login`, loginUser);
  }

  signUp(registerUser: registerUser){
    return this.httpClient.post(`${this.AUTH_SERVER}/register`, registerUser);
  }

  isLogged(): boolean{  //ask the server for the token of the user and return the token, then compare it with the one at local storage
    return localStorage.getItem('token') ? true : false;
  }

  //old stuff
  register(user: User):Observable<JwtResponse> {
    return this.httpClient.post<JwtResponse>(
      `${this.AUTH_SERVER}/register`, user
    ).pipe(
      tap(
        (res: JwtResponse) => {
          if(res){
            this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn);
          }
        }
      )
    );
  }

  login(user: User):Observable<JwtResponse> {
    return this.httpClient.post<JwtResponse>(
      `${this.AUTH_SERVER}/login`, user
    ).pipe(
      tap(
        (res: JwtResponse) => {
          if(res){
            this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn);
          }
        }
      )
    );
  }

  logout(): void{
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
    localStorage.setItem("EXPIRES_IN", expiresIn);
    this.token = token;
  }

  private getToken(): string {
    if(!this.token){
      this.token = localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token!;
  }
}
