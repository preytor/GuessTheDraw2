import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUser = {
    email: "",
    password: ""
  } 

  constructor(private AuthService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  signIn(){
    this.AuthService.signIn(this.loginUser)
    .subscribe(
      res => {
        console.log(res),
        localStorage.setItem('token', Object(res)["token"]);
        this.router.navigateByUrl('/register'); //just testing here a bit
      },
      err => console.log(err)
    );
  }
}
