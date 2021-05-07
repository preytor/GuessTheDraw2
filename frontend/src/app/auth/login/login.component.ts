import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  _loginUser = {
    email: "",
    password: ""
  } 

  loginForm: FormGroup | undefined;

  constructor(private AuthService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(this._loginUser.email, [Validators.required, Validators.minLength(1)]),
      password: new FormControl(this._loginUser.password, [Validators.required, Validators.minLength(1)])
    });
  }

  signIn(){
    this.AuthService.signIn(this._loginUser)
    .subscribe(
      res => {
        console.log(res),
        localStorage.setItem('token', Object(res)["token"]);
        this.router.navigateByUrl('/'); //just testing here a bit
      },
      err => console.log(err)
    );
  }
}
