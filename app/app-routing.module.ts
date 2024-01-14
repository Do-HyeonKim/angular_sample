import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './view/test/test.component';

const routes: Routes = [ 
  // { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'test', component: TestComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
