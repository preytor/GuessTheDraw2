import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrivateSitesGuard } from './private-sites.guard';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TokenInterceptorService } from './services/token-interceptor.service';
import { AuthModule } from './auth/auth.module';
import { SocketService } from './services/socket.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoutesModule } from './routes/routes.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RoutesModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    PrivateSitesGuard, {
      provide: HTTP_INTERCEPTORS, 
      useClass: TokenInterceptorService,
      multi: true
    },
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
