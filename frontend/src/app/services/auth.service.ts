import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  //current user keeps being empty, but only shows in the logs
  private current_user: string | undefined;

  constructor(private httpClient: HttpClient, private Router: Router) { }

  signIn(loginUser: loginUser){
    return this.httpClient.post(`${this.AUTH_SERVER}/login`, loginUser)
    .pipe(
      tap(
        (res) => {
          if(res){
            let us: string = Object(res)["username"];
            console.log("username sign in is: "+us)
            this.setUser(us);
          }
        }
      )
    );
  }

  signUp(registerUser: registerUser){
    return this.httpClient.post(`${this.AUTH_SERVER}/register`, registerUser)
    .pipe(
      tap(
        (res) => {
          if(res){
            console.log("username sign up is: "+Object(res)["username"])
            this.setUser(Object(res)["username"]);
          }
        }
      )
    );
  }

  isLogged(): boolean{  //ask the server for the token of the user and return the token, then compare it with the one at local storage
    return (localStorage.getItem('token') ? true : false);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  setUser(_user:string){
    this.current_user = _user;//doesnt work
    console.log("set user user: "+_user);
    //this.current_user = _user;//but this doesnt seem to work :thinking:
    localStorage.setItem('user', _user);
  }

  getUser(){
    //return this.current_user;
    return localStorage.getItem('user');
  }

  logOut(){
    localStorage.removeItem('token');
    this.current_user = "";
    this.Router.navigate(['/']);
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

  logoutOld(): void{
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
    localStorage.setItem("EXPIRES_IN", expiresIn);
    this.token = token;
  }

  private getTokenOld(): string {
    if(!this.token){
      this.token = localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token!;
  }
}
