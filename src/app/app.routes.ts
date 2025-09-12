// import { Routes } from '@angular/router';
// import { ImportTransListComponent } from './features/import-trans/components/import-trans-list/import-trans-list.component';

// import { HomeComponent } from './features/home/home.component';

// export const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'import-trans-list', component: ImportTransListComponent }
// ];
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/product/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: HomeComponent },
];
