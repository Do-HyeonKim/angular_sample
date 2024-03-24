import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './view/test/test.component';
import { Test2Component } from './view/test2/test2.component';
import { Test3Component } from './view/test3/test3.component';
import { Test4Component } from './view/test4/test4.component';

const routes: Routes = [ 
  // { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'test', component: TestComponent },
  { path: 'test2', component: Test2Component },
  { path: 'test3', component: Test3Component },
  {path:'test4', component : Test4Component}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
