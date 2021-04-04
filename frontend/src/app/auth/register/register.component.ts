import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registeringUser = {
    username: "",
    email: "",
    password: "",
    repassword: ""
  }

  constructor(private AuthService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  
  //add some verification of both passwords being the same, user or mail not in use, etc...
  signUp(){
    this.AuthService.signUp(this.registeringUser)
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
