import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TestService } from '../../../service/test.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table-dialog',
  templateUrl: './table-dialog.component.html',
  styleUrl: './table-dialog.component.scss',
 
})
export class TableDialogComponent {

  form!: FormGroup;
  displayedColumns: string[] = ['key1', 'key2', 'key3', 'key4', 'key5'];
  keyData ?: any[]=[]
  dataSource = [...this.keyData!]
  constructor(
    private test : TestService,
    private fb: FormBuilder
  ){
    this.form = this.fb.group({
      rows: this.fb.array([])
    });

  }

  selectedFile?: File;
  onFileSelected(event : any){
    this.selectedFile = event.target.files[0]

    if(this.selectedFile){
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.test.getParseFile(formData).subscribe(x=>{
      this.keyData = x
      this.dataSource  = this.keyData
    })
    
    }
  }

  editingRowIndex: number | null = null;
  editingColumn: string | null = null;
 
  startEditing(rowIndex: number, column: string) {
     this.editingRowIndex = rowIndex;
     this.editingColumn = column;
  }
  stopEditing(rowIndex: number, column: string) {
     this.editingRowIndex = null;
     this.editingColumn = null;
  }
 
  isEditing(rowIndex: number, column: string): boolean {
     return this.editingRowIndex === rowIndex && this.editingColumn === column;
  }
 



  addRow(){

    const newRow = {
      key1: '0',
      key2: '0',
      key3: '0',
      key4: '0',
      key5: '0'
  };

  this.dataSource.push(newRow);
  this.dataSource = [...this.dataSource];

  this.editingRowIndex = this.dataSource.length - 1; 

  console.log(this.dataSource);
  
}


onSubmit(){
  console.log(this.dataSource);

  this.test.write(this.dataSource).subscribe(x=>{
      console.log(x);
      
  })
  
}

}

