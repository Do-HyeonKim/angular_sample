import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-test3',
  templateUrl: './test3.component.html',
  styleUrl: './test3.component.scss'
})


export class Test3Component {


  entities: { x: number; y: number }[] = [];
  lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  selectedEntityIndex: number | null = null;

  
  connectTables() {
    const svgElement: SVGElement | null = document.querySelector('svg');
    const table1 = document.getElementById('table1');
    const table2 = document.getElementById('table2');

   
    if (svgElement && table1 && table2) {
      // 첫 번째 테이블의 끝 좌표 계산
      const x1 = parseFloat(table1.getAttribute('x') || '0') + parseFloat(table1.getAttribute('width') || '0');
      const y1 = parseFloat(table1.getAttribute('y') || '0') + parseFloat(table1.getAttribute('height') || '0') / 2;

      // 선 생성 및 속성 설정
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toString());
      line.setAttribute('y1', y1.toString());
      line.setAttribute('x2', table2.getAttribute('x') || '0');
      line.setAttribute('y2', (parseFloat(table2.getAttribute('y') || '0') + parseFloat(table2.getAttribute('height') || '0') / 2).toString());
      line.setAttribute('stroke', '#000');

      // 선을 SVG에 추가
      svgElement.appendChild(line);
    }
  }


 



}
