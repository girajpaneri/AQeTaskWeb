import { Routes } from '@angular/router';
import { TasksComponent } from './views/tasks/tasks.component';
import { AddEditComponent } from './views/tasks/add-edit/add-edit.component';

export const routes: Routes = [
    { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', component: TasksComponent },
  { path: 'tasks/add', component: AddEditComponent },
  { path: 'tasks/edit/:id', component: AddEditComponent }
];
