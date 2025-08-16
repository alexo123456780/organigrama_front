import { Routes } from '@angular/router';
import { LandingPagueComponent } from './landing/components/landing-pague.component/landing-pague.component';
import { LoginComponent } from './features/auth/components/login/login.component';

export const routes: Routes = 
[

    {path: '' , redirectTo : '/landing' , pathMatch: 'full'},
    {path:'landing',component:LandingPagueComponent},
    {path:'login',component: LoginComponent},


];
