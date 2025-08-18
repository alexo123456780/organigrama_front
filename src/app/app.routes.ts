import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './features/auth/models/usuario';

export const routes: Routes = [

    {
        path: '',
        redirectTo: '/landing',
        pathMatch: 'full'
    },
    {
        path: 'landing',
        loadComponent: () => import('./landing/components/landing-pague.component/landing-pague.component').then(m => m.LandingPagueComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Administrador, UserRole.Editor] }
    },
    {
        path: 'demo',
        loadComponent: () => import('./features/organigrama/components/demo-view/demo-view.component').then(m => m.DemoViewComponent),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Viewer] }
    },
    {
        path: 'organigrama',
        loadComponent: () => import('./features/organigrama/organigrama.component').then(m => m.OrganigramaComponent),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Administrador, UserRole.Editor, UserRole.Viewer] }
    },


    {
        path: '**',
        redirectTo: '/landing'
    }

];
