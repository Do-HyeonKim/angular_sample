import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './view/test/test.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { Test2Component } from './view/test2/test2.component';
import { Test3Component } from './view/test3/test3.component';
import { Test4Component } from './view/test4/test4.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    Test2Component,
    Test3Component,
    Test4Component
 
  ],
  exports: [
    TestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
