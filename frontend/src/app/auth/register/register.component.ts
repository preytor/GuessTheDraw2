import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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

  registerForm: FormGroup | undefined;

  constructor(private AuthService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(this.registeringUser.username, [Validators.required, Validators.minLength(1)]),
      email: new FormControl(this.registeringUser.email, [Validators.required, Validators.minLength(1)]),
      password: new FormControl(this.registeringUser.password, [Validators.required, Validators.minLength(1)]),
      repassword: new FormControl(this.registeringUser.repassword, [Validators.required, Validators.minLength(1), repeatPassword]),
    });
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

function repeatPassword(control: AbstractControl){
  if(control && (control.value !== null || control.value !== undefined)){
    const cnfpassValue = control.value;
    const passControl = control.root.get("password");
    if(passControl){
      const passValue = passControl.value;
      if(passValue !== cnfpassValue){
        return { isError: true };
      }
    }
  }
  return null;
}
