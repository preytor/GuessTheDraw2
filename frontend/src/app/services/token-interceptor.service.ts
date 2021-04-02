import { Injectable } from '@angular/core';
import { HttpInterceptor} from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private AuthService: AuthService) { }

  intercept(req: any, next: any){
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.AuthService.getToken()}`
      }
    })
    return next.handle(tokenizedReq);
  }

}
