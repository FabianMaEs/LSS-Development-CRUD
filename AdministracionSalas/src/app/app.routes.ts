import { Routes } from '@angular/router';
import { SalasComponent } from './salas/salas.component';

export const routes: Routes = [
    // Rutas de la aplicación
    { path: 'salas', component: SalasComponent },
    { path: '', redirectTo: '/salas', pathMatch: 'full' }
];
