import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEventPattern } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private AuthService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(form: { value: any; }): void {
    this.AuthService.login(form.value).subscribe(res => {
      this.router.navigateByUrl('');
    })
  }
}
