import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  
})
export class UploadComponent {


  constructor(
    private router: Router
  ){

  }


  openProfile(){
    this.router.navigate(['/table']);
  }
}
