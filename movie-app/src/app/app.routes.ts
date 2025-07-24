import { Routes } from '@angular/router';
import { ListComponent } from './components/list.component';
import { DetailsComponent } from './components/details.component';

export const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'item/:id', component: DetailsComponent },
  { path: '**', redirectTo: '' }
];
