import { Component } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts-gl';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrl: './test2.component.scss'
})
export class Test2Component {
  chartOptions?: any;
  constructor(){
    this.setOption()
    let data:any []=[]
    
    console.log( this.interpolateVoltages() )
    // this.initList.forEach(e=>{
    //   data.push(e.x, e.y, e.z , e.voltage)
    // })
  }


  setOption(){
    let data:any [] = []


    
    let finalList:any[] = []
    finalList = this.interpolateVoltages()

    let minValue = this.initList[0].voltage 
    let maxValue = this.initList[this.initList.length - 1].voltage

console.log(minValue);
console.log(maxValue);



    finalList.forEach(e=>{
      // this.initList.forEach(e=>{
      data.push([e.x, e.y, e.z, e.voltage])
    })

console.log(data)
    this.chartOptions = {
      // backgroundColor : '#000000',
      tooltip: {
        formatter: (params: any) => {
          const value = params.value;
          return `
            <div style="color: #fff; background-color: #222; border-radius: 4px; padding: 10px;">
              <strong style="font-size: 14px;">Data Point Details</strong>
              <hr style="border-color: #777; margin: 5px 0;">
              <div style="font-size: 12px; margin-top: 5px;">
                <span style="color: #ee6666;">x: <strong>${value[0]}</strong></span><br>
                <span style="color: #3ba272;">y: <strong>${value[1]}</strong></span><br>
                <span style="color: #5470c6;">z: <strong>${value[2]}</strong></span><br>
                <span style="color: #fac858;">voltage: <strong>${value[3]}</strong></span>
              </div>
            </div>
          `;
        }
      },
      visualMap: {
        show: true,
        min: minValue,
        max: maxValue,
        inRange: {
          symbolSize: [10, 10],
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026'
          ],
          colorAlpha: [0.2, 1]
        }
      },
      xAxis3D: {type: 'value'},
      yAxis3D: {type: 'value'},
      zAxis3D: {type: 'value'},
      // xAxis3D: {
      //   type: 'value',
      //   min: this.initList[this.initList.length -1].x,
      //   max: this.initList[0].x ,
      //   axisLabel: {
      //     formatter: (value: number) => {
      //       if (value === this.initList[this.initList.length -1].x || value === this.initList[0].x) {
      //         return value.toString();
      //       }
      //       return '';
      //     }
      //   }
      // },
      // yAxis3D: {
      //   type: 'value',
      //   min: this.initList[this.initList.length -1].y,
      //   max: this.initList[0].y ,
      //   axisLabel: {
      //     formatter: (value: number) => {
      //       if (value === this.initList[this.initList.length -1].y || value === this.initList[0].y) {
      //         return value.toString();
      //       }
      //       return '';
      //     }
      //   }
      // },
      // zAxis3D: {
      //   type: 'value',
      //   min: this.initList[this.initList.length -1].z,
      //   max: this.initList[0].z ,
      //   axisLabel: {
      //     formatter: (value: number) => {
      //       if (value === this.initList[this.initList.length -1].z || value === this.initList[0].z) {
      //         return value.toString();
      //       }
      //       return '';
      //     }
      //   }
      // },
      grid3D: {
        axisLine: {
          lineStyle: { color: '#000000' }
        },
        axisPointer: {
          lineStyle: { color: '#fff' }
        },
        viewControl: {
          projection: 'orthographic'
        }
      },
      series: [
        {
          type: 'scatter3D',
          data: data
        }
      ]
    }
    };



   calculateWeightedAverage(x: number, y: number, z: number, knownPoints: any[]) {
    let weights = 0;
    let weightedVoltageSum = 0;
  
    knownPoints.forEach(point => {
      const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2) + Math.pow(z - point.z, 2));
      const weight = 1 / (distance || 1);
      weights += weight;
      weightedVoltageSum += weight * point.voltage;
    });
  
    return weightedVoltageSum / weights;
  }
  

 interpolateVoltages() {
  const interpolatedData: any[] = [];
  const maxValue = this.initList[0].x;
  const minXvalue = this.initList[this.initList.length -1].x
  const maxYValue = this.initList[0].y
  const minYvalue = this.initList[this.initList.length -1].y
  const maxZalue = this.initList[0].z
  const minZvalue = this.initList[this.initList.length -1].z

  // x, y, z 범위를 기준으로 for 루프 실행 (maxValue - minXvalue) / 20)
  for (let x = minXvalue; x <= maxValue; x += 0.01) { 
for (let y = minYvalue; y <= maxYValue; y += 0.001) {
for (let z = minZvalue; z <= maxZalue; z += 0.001) {
const voltage = this.calculateWeightedAverage(x, y, z, this.initList);
interpolatedData.push({ x, y, z, voltage });
}
}
}

interpolatedData.sort((a, b) => {
  if (a.x !== b.x) {
    return b.x - a.x; // x가 다르면 x를 기준으로 내림차순 정렬
  } else if (a.y !== b.y) {
    return b.y - a.y; // x가 같으면 y를 기준으로 내림차순 정렬
  } else {
    return b.z - a.z; // x와 y가 같으면 z를 기준으로 내림차순 정렬
  }
});



return interpolatedData;
}











  initList:any[]=[
    {"no":"point28","x":0.1,"y":0.04478,"z":-0.01,"voltage":4.9012236516645595},{"no":"point29","x":0.1,"y":0.03478,"z":-0.01,"voltage":4.911223651664559},{"no":"point30","x":0.1,"y":0.02477,"z":-0.01,"voltage":4.921223651664559},{"no":"point31","x":0.0,"y":0.04478,"z":-0.01,"voltage":4.931223651664559},{"no":"point32","x":0.0,"y":0.03478,"z":-0.01,"voltage":4.941223651664559},{"no":"point33","x":0.0,"y":0.02477,"z":-0.01,"voltage":4.9512236516645585},{"no":"point34","x":-0.1,"y":0.04478,"z":-0.01,"voltage":4.961223651664558},{"no":"point35","x":-0.1,"y":0.03478,"z":-0.01,"voltage":4.971223651664558},{"no":"point36","x":-0.1,"y":0.02477,"z":-0.01,"voltage":4.981223651664558},{"no":"point37","x":0.1,"y":0.04478,"z":-0.05500000000000001,"voltage":4.991223651664558},{"no":"point38","x":0.1,"y":0.03478,"z":-0.05500000000000001,"voltage":5.001223651664557},{"no":"point39","x":0.1,"y":0.02477,"z":-0.05500000000000001,"voltage":5.011223651664557},{"no":"point40","x":0.0,"y":0.04478,"z":-0.05500000000000001,"voltage":5.021223651664557},{"no":"point41","x":0.0,"y":0.03478,"z":-0.05500000000000001,"voltage":5.031223651664557},{"no":"point42","x":0.0,"y":0.02477,"z":-0.05500000000000001,"voltage":5.0412236516645565},{"no":"point43","x":-0.1,"y":0.04478,"z":-0.05500000000000001,"voltage":5.051223651664556},{"no":"point44","x":-0.1,"y":0.03478,"z":-0.05500000000000001,"voltage":5.061223651664556},{"no":"point45","x":-0.1,"y":0.02477,"z":-0.05500000000000001,"voltage":5.071223651664556},{"no":"point46","x":0.1,"y":0.04478,"z":-0.1,"voltage":5.081223651664556},{"no":"point47","x":0.1,"y":0.03478,"z":-0.1,"voltage":5.0912236516645555},{"no":"point48","x":0.1,"y":0.02477,"z":-0.1,"voltage":5.101223651664555},{"no":"point49","x":0.0,"y":0.04478,"z":-0.1,"voltage":5.111223651664555},{"no":"point50","x":0.0,"y":0.03478,"z":-0.1,"voltage":5.121223651664555},{"no":"point51","x":0.0,"y":0.02477,"z":-0.1,"voltage":5.131223651664555},{"no":"point52","x":-0.1,"y":0.04478,"z":-0.1,"voltage":5.141223651664554},{"no":"point53","x":-0.1,"y":0.03478,"z":-0.1,"voltage":5.151223651664554},{"no":"point54","x":-0.1,"y":0.02477,"z":-0.1,"voltage":5.161223651664554}
  ];
}
