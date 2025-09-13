import { Routes } from '@angular/router';
import { HomeComponent } from './features/product/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: HomeComponent },
];
