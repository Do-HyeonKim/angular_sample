import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './view/test/test.component';
import { Test2Component } from './view/test2/test2.component';

const routes: Routes = [ 
  // { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'test', component: TestComponent },
  { path: 'test2', component: Test2Component }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
