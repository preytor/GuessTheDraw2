import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
//  {path: '', redirectTo: '/auth', pathMatch: 'full'}, //I don't want this tbh
  {path: '', loadChildren: () => import('src/app/auth/auth.module').then(m => m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
