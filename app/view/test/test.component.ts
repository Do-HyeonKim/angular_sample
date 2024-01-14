import { Component } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts-gl';
import { TestService } from '../../service/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  chartOptions?: any;
  constructor(
    private testService : TestService
  ){

    this.setOption()
    let data:any []=[]
    
    this.initList.forEach(e=>{
      data.push(e.x, e.y, e.z , e.voltage)
    })
  }
 

  test(){
    console.log(this.initList)
  }


  setOption(){
    let data:any [] = []

    let minValue = this.initList[0].voltage 
    let maxValue = this.initList[this.initList.length - 1].voltage


    console.log(minValue)
    console.log(maxValue)
    // this.resultList.forEach((e , idx)=>{
    //   data.push([e.x, e.y, e.z , e.voltage])
    // })

    //0113 시도했으나 사용 안함
    // let extendedInitList:any [] = [];
    // for (let i = 0; i < this.initList.length - 1; i++) {
    //  extendedInitList.push(this.initList[i]);
    //  extendedInitList.push(this.interpolate(this.initList[i], this.initList[i + 1], 10));
    // }
    // extendedInitList.push(this.initList[this.initList.length - 1]);
    // console.log(extendedInitList)
    // for (let item of extendedInitList) {
    //   if (Array.isArray(item)) {
    //     for (let subItem of item) {
    //       let x = subItem["x"];
    //       let y = subItem["y"];
    //       let z = subItem["z"];
    //       let voltage = subItem["voltage"];
    //       data.push([x, y, z, voltage]);
    //     }
    //   } else if (typeof item === 'object') {
    //     let x = item["x"];
    //     let y = item["y"];
    //     let z = item["z"];
    //     let voltage = item["voltage"];
    //     data.push([x, y, z, voltage]);
    //   }
    //  }


    //이 코드 사용함
  let steps = 150; // 원하는 보간 단계
  let interpolatedList = this.interpolateZLevels4(this.initList, steps);

  console.log(interpolatedList)
interpolatedList.forEach(e=>{
  data.push([e.x, e.y, e.z, e.voltage])
})

console.log(data)
    this.chartOptions = {
      // backgroundColor : '#000000',
      visualMap: {
        show: true,
        min: minValue,
        max: maxValue,
        inRange: {
          symbolSize: [30, 30],
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
      xAxis3D: {
        type: 'value'
      },
      yAxis3D: {
        type: 'value'
      },
      zAxis3D: {
        type: 'value'
      },
      grid3D: {
        axisLine: {
          lineStyle: { color: '#fff' }
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
    };
   }



  interpolate(point1: any, point2: any, steps: number): any[] {
    let interpolatedPoints = [];
    for (let i = 1; i < steps; i++) {
      let t = i / steps;
      let x = point1.x + t * (point2.x - point1.x);
      let y = point1.y + t * (point2.y - point1.y);
      let z = point1.z + t * (point2.z - point1.z);
      let voltage = point1.voltage + t * (point2.voltage - point1.voltage);
      interpolatedPoints.push({x: x, y: y, z: z, voltage: voltage});
    }
    return interpolatedPoints;
   }



   interpolateZLevels(initList : any[], steps:any) : any[] {
    let extendedInitList:any[] = [];
    
    // 먼저 z 값에 따라 데이터를 정렬합니다.
    let sortedByZ = initList.slice().sort((a:any, b:any) => a.z - b.z);
  
    // z 값이 같은 포인트들끼리 그룹으로 묶습니다.
    let groupsByZ = sortedByZ.reduce((groups:any, item:any) => {
      let lastGroup = groups[groups.length - 1];
      if (!lastGroup || lastGroup[0].z !== item.z) {
        groups.push([item]);
      } else {
        lastGroup.push(item);
      }
      return groups;
    }, []);
  
    // 각 z 그룹 내에서 보간을 수행합니다.
    groupsByZ.forEach((group:any) => {
      // x 값을 기준으로 그룹을 정렬합니다.
      group.sort((a:any, b:any) => a.x - b.x);
  
      // 그룹 내의 포인트들 사이에 보간을 수행합니다.
      for (let i = 0; i < group.length - 1; i++) {
        extendedInitList.push(group[i
  ]);
  let interpolatedPointsBetweenXY = this.interpolate(group[i], group[i + 1], steps);
  extendedInitList = extendedInitList.concat(interpolatedPointsBetweenXY);
  }
  extendedInitList.push(group[group.length - 1]); // 마지막 포인트를 추가합니다.
  });
  
  // 마지막으로, extendedInitList에 있는 모든 포인트를 z값에 따라 정렬합니다.
  extendedInitList.sort((a, b) => a.z - b.z || a.x - b.x || a.y - b.y);
  
  return extendedInitList;
  }


   interpolateAllPoints(initList: any[], steps: number): any[] {
    let extendedInitList: any[] = [];
    
    // 데이터를 z 값에 따라 정렬합니다.
    initList.sort((a, b) => a.z - b.z);
    
    // z 값을 기준으로 보간을 수행합니다.
    for (let i = 0; i < initList.length - 1; i++) {
    // z 값이 바뀌는 지점에서만 보간을 수행합니다.
    if (initList[i].z !== initList[i + 1].z) {
    let zInterpolatedPoints = this.interpolate(initList[i], initList[i + 1], steps);
    extendedInitList = extendedInitList.concat(zInterpolatedPoints);
    }
    }
    
    // 이제 extendedInitList에는 z 축을 따라 보간된 모든 포인트들이 있습니다.
    // 다음 단계는 x와 y를 기준으로 각 z 레벨에서 보간하는 것입니다.
    // z 레벨별로 그룹화된 포인트들을 가져와서 각 그룹 내에서 보간을 수행합니다.
    let groupedByZ:any = {};
    extendedInitList.forEach(point => {
    if (!groupedByZ[point.z]) {
    groupedByZ[point.z] = [];
    }
    groupedByZ[point.z].push(point);
    });
    
    Object.values(groupedByZ).forEach((group: any) => {
    group.sort((a:any, b:any) => a.x - b.x || a.y - b.y); // x, y

    for (let i = 0; i < group.length - 1; i++) {
    // x 값이 같을 때만 y에 대해 보간을 수행합니다.
    if (group[i].x === group[i + 1].x) {
    let yInterpolatedPoints = this.interpolate(group[i], group[i + 1], steps);
    extendedInitList = extendedInitList.concat(yInterpolatedPoints);
    }
    }
    });
    
    // 마지막으로, extendedInitList를 다시 z 값에 따라 정렬하여 최종 배열을 구성합니다.
    extendedInitList.sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);
    return extendedInitList;
    }


   interpolateAllPoints2(initList: any[], steps: number): any[] {
      let extendedInitList : any[] = [];
  
  // 먼저 z 값에 따라 데이터를 정렬합니다.
  let sortedByZ = initList.slice().sort((a, b) => a.z - b.z);
  
  // z 값이 같은 포인트들끼리 그룹으로 묶습니다.
  let groupsByZ = sortedByZ.reduce((groups, item) => {
    let lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup[0].z !== item.z) {
      groups.push([item]);
    } else {
      lastGroup.push(item);
    }
    return groups;
  }, []);

  // 각 z 그룹 내에서 보간을 수행합니다.
  groupsByZ.forEach((group:any, index:any) => {
    // x 값을 기준으로 그룹을 정렬합니다.
    group.sort((a:any, b:any) => a.x - b.x);

    // 그룹내의 포인트들 사이에 보간을 수행합니다.
for (let i = 0; i < group.length - 1; i++) {
extendedInitList.push(group[i]);
let interpolatedPointsBetweenXY = this.interpolate(group[i], group[i + 1], steps);
extendedInitList = extendedInitList.concat(interpolatedPointsBetweenXY);
}
extendedInitList.push(group[group.length - 1]); // 마지막 포인트를 추가합니다.

// 이제 각 z 레벨 사이를 채웁니다.
if (index < groupsByZ.length - 1) {
  let nextGroup = groupsByZ[index + 1];
  let zDistance = nextGroup[0].z - group[0].z; // z 레벨 사이의 거리
  let zStep = zDistance / steps; // z 거리를 보간 단계 수로 나눔

  for (let step = 1; step < steps; step++) {
    group.forEach((point:any) => {
      let interpolatedZ = point.z + zStep * step;
      // x와 y는 현재 그룹의 값을 사용하고, z만 새로운 값을 사용합니다.
      let interpolatedPoint = {
        x: point.x,
        y: point.y,
        z: interpolatedZ,
        voltage: point.voltage // 보간이 필요하면 이 부분도 수정합니다.
      };
      extendedInitList.push(interpolatedPoint);
    });
  }
}
});

// 마지막으로, extendedInitList에 있는 모든 포인트를 z값에 따라 정렬합니다.
extendedInitList.sort((a, b) => a.z - b.z || a.x - b.x || a.y - b.y);

return extendedInitList;
}

interpolateZLevels3(initList: any[], steps: number): any[] {
  let extendedInitList: any[] = [];
  
  // 먼저 z 값에 따라 데이터를 정렬합니다.
  let sortedByZ = initList.slice().sort((a, b) => a.z - b.z);
  
  // z 값이 같은 포인트들끼리 그룹으로 묶습니다.
  let groupsByZ = sortedByZ.reduce((groups, item) => {
    let lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup[0].z !== item.z) {
      groups.push([item]);
    } else {
      lastGroup.push(item);
    }
    return groups;
  }, []);

  // 각 z 그룹 내에서 x와 y에 대해 보간을 수행합니다.
  groupsByZ.forEach((group:any) => {
    // x, y 값을 기준으로 그룹을 정렬합니다.
    group.sort((a:any, b:any) => a.x - b.x || a.y - b.y);
  
    // 그룹 내의 포인트들 사이에 x축 보간을 수행합니다.
    for (let i = 0; i < group.length - 1; i++) {
      extendedInitList.push(group[i]);
      let interpolatedPointsX = this.interpolate(group[i], group[i + 1], steps);
      extendedInitList = extendedInitList.concat(interpolatedPointsX);
    }
    extendedInitList.push(group[group.length - 1]); // 마지막 포인트를 추가합니다.
  });

  // y축 보간을 추가합니다.
  let finalList = [];
  extendedInitList.sort((a, b) => a.y - b.y); // y축에 따라 정렬합니다.
  for (let i = 0; i < extendedInitList.length - 1; i++) {
    // y 값이 같을 때만 x축 보간을 수행합니다.
    if (extendedInitList[i].y !== extendedInitList[i + 1].y) {
      finalList.push(extendedInitList[i]);
     
let interpolatedPointsY = this.interpolate(extendedInitList[i], extendedInitList[i + 1], steps);
finalList = finalList.concat(interpolatedPointsY);
}
}
finalList.push(extendedInitList[extendedInitList.length - 1]); // 마지막 포인트를 추가합니다.

// 마지막으로, finalList에 있는 모든 포인트를 z, y, x 값에 따라 정렬합니다.
finalList.sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);

return finalList;
}


interpolateAllPoints3(initList: any[], steps: number): any[] {
  let extendedInitList: any[] = [];
  
  // 먼저 z 값에 따라 데이터를 정렬합니다.
  let sortedByZ = initList.slice().sort((a, b) => a.z - b.z);
  
  // z 값이 같은 포인트들끼리 그룹으로 묶습니다.
  let groupsByZ = sortedByZ.reduce((groups, item) => {
    let lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup[0].z !== item.z) {
      groups.push([item]);
    } else {
      lastGroup.push(item);
    }
    return groups;
  }, []);

  // 각 z 그룹 내에서 x와 y에 대해 보간을 수행합니다.
  groupsByZ.forEach((group: any, index: number) => {
    // 먼저 x, y 값을 기준으로 그룹을 정렬합니다.
    group.sort((a: any, b: any) => a.x - b.x || a.y - b.y);

    // 그룹 내의 포인트들 사이에 x축 보간을 수행합니다.
    for (let i = 0; i < group.length - 1; i++) {
      extendedInitList.push(group[i]);
      let interpolatedPointsX = this.interpolate(group[i], group[i + 1], steps);
      extendedInitList = extendedInitList.concat(interpolatedPointsX);
    }
    extendedInitList.push(group[group.length - 1]); // 마지막 포인트를 추가합니다.

    // y축 보간을 추가합니다.
    // 해당 로직은 x값이 같을 때만 y축 보간을 수행합니다.
    let uniqueXValues = [...new Set(group.map((p: any) => p.x))];
    uniqueXValues.forEach(xValue => {
      let pointsAtXValue = group.filter((p: any) => p.x === xValue).sort((a: any, b: any) => a.y - b.y);
      for (let i = 0; i < pointsAtXValue.length - 1; i++) {
        let interpolatedPointsY = this.interpolate(pointsAtXValue[i], pointsAtXValue[i + 1], steps);
        extendedInitList = extendedInitList.concat(interpolatedPointsY);
      }
    });

    // z축 보간을 추가합니다.
    if (index < groupsByZ.length - 1) {
      let nextGroup = groupsByZ[index + 1];
      let zDistance = nextGroup[0].z - group[0].z;
      let zStep = zDistance / (steps - 1);

      for (let step = 1; step < steps; step++) {
        group.forEach((point: any) => {
          let interpolatedZ = point.z + zStep * step;
          let interpolatedPoint = {
            x: point.x,
            y: point.y,
            z: interpolatedZ,
            voltage: point.voltage
          };
          extendedInitList.push(interpolatedPoint);
        });
      }
    }
  });

  // 최종적으로, 모든 포인트를 z, y, x 값에 따라 정렬합니다.
  extendedInitList.sort((a: any, b: any) => a.z - b.z || a.y - b.y || a.x - b.x);

  return extendedInitList;
}


interpolateZLevels4(initList: any[], steps: number): any[] {
  let extendedInitList: any[] = [];
  
  // 먼저 z 값에 따라 데이터를 정렬합니다.
  let sortedByZ = initList.slice().sort((a, b) => a.z - b.z);
  
  // z 값이 같은 포인트들끼리 그룹으로 묶습니다.
  let groupsByZ = sortedByZ.reduce((groups, item) => {
    let lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup[0].z !== item.z) {
      groups.push([item]);
    } else {
      lastGroup.push(item);
    }
    return groups;
  }, []);

  // 각 z 그룹 내에서 x와 y에 대해 보간을 수행합니다.
  groupsByZ.forEach((group:any) => {
    // x, y, z 값을 내림차순으로 정렬합니다.
    group.sort((a:any, b:any) => b.z - a.z || b.y - a.y || b.x - a.x);
  
    // 그룹 내의 포인트들 사이에 x축 보간을 수행합니다.
    for (let i = 0; i < group.length - 1; i++) {
      extendedInitList.push(group[i]);
      let interpolatedPointsX = this.interpolate(group[i], group[i + 1], steps);
      extendedInitList = extendedInitList.concat(interpolatedPointsX);
    }
    extendedInitList.push(group[group.length - 1]); // 마지막 포인트를 추가합니다.
  });

  // y축 보간을 추가합니다.
  let finalList = [];
  extendedInitList.sort((a, b) => a.y - b.y); // y축에 따라 정렬합니다.
  for (let i = 0; i < extendedInitList.length - 1; i++) {
    // y 값이 같을 때만 x축 보간을 수행합니다.
    if (extendedInitList[i].y !== extendedInitList[i + 1].y) {
      finalList.push(extendedInitList[i]);
     
let interpolatedPointsY = this.interpolate(extendedInitList[i], extendedInitList[i + 1], steps);
finalList = finalList.concat(interpolatedPointsY);
}
}
finalList.push(extendedInitList[extendedInitList.length - 1]); // 마지막 포인트를 추가합니다.

// 최종적으로, finalList에 있는 모든 포인트를 z, y, x 값에 따라 내림차순으로 정렬합니다.
finalList.sort((a, b) => b.z - a.z || b.y - a.y || b.x - a.x);

return finalList;
}


interpolateZLevels5(initList: any[], steps: number): any[] {
  let extendedInitList: any[] = [];
  
  // 먼저 z 값에 따라 데이터를 정렬합니다.
  let sortedByZ = initList.slice().sort((a, b) => a.z - b.z);
  
  // z 값이 같은 포인트들끼리 그룹으로 묶습니다.
  let groupsByZ = sortedByZ.reduce((groups, item) => {
    let lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup[0].z !== item.z) {
      groups.push([item]);
    } else {
      lastGroup.push(item);
    }
    return groups;
  }, []);

  // 각 z 그룹 내에서 x와 y에 대해 보간을 수행합니다.
  groupsByZ.forEach((group:any) => {
    // x, y, z 값을 오름차순으로 정렬합니다.
    group.sort((a:any, b:any) => a.z - b.z || a.y - b.y || a.x - b.x);
  
    // 그룹 내의 포인트들 사이에 x축 보간을 수행합니다.
    for (let i = 0; i < group.length - 1; i++) {
      extendedInitList.push(group[i]);
      let interpolatedPointsX = this.interpolate(group[i], group[i + 1], steps);
      extendedInitList = extendedInitList.concat(interpolatedPointsX);
    }
    extendedInitList.push(group[group.length - 1]); // 마지막 포인트를 추가합니다.
  });

  // y축 보간을 추가합니다.
  let finalList = [];
  extendedInitList.sort((a, b) => a.y - b.y); // y축에 따라 정렬합니다.
  for (let i = 0; i < extendedInitList.length - 1; i++) {
    // y 값이 같을 때만 x축 보간을 수행합니다.
    if (extendedInitList[i].y !== extendedInitList[i + 1].y) {
      finalList.push(extendedInitList[i]);
     
let interpolatedPointsY = this.interpolate(extendedInitList[i], extendedInitList[i + 1], steps);
finalList = finalList.concat(interpolatedPointsY);
}
}
finalList.push(extendedInitList[extendedInitList.length - 1]); // 마지막 포인트를 추가합니다.

// 최종적으로, finalList에 있는 모든 포인트를 z, y, x 값에 따라 오름차순으로 정렬합니다.
finalList.sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);

return finalList;
}


initList:any[]=[
  {"no":"point28","x":0.1,"y":0.04478,"z":-0.01,"voltage":4.9012236516645595},{"no":"point29","x":0.1,"y":0.03478,"z":-0.01,"voltage":4.911223651664559},{"no":"point30","x":0.1,"y":0.02477,"z":-0.01,"voltage":4.921223651664559},{"no":"point31","x":0.0,"y":0.04478,"z":-0.01,"voltage":4.931223651664559},{"no":"point32","x":0.0,"y":0.03478,"z":-0.01,"voltage":4.941223651664559},{"no":"point33","x":0.0,"y":0.02477,"z":-0.01,"voltage":4.9512236516645585},{"no":"point34","x":-0.1,"y":0.04478,"z":-0.01,"voltage":4.961223651664558},{"no":"point35","x":-0.1,"y":0.03478,"z":-0.01,"voltage":4.971223651664558},{"no":"point36","x":-0.1,"y":0.02477,"z":-0.01,"voltage":4.981223651664558},{"no":"point37","x":0.1,"y":0.04478,"z":-0.05500000000000001,"voltage":4.991223651664558},{"no":"point38","x":0.1,"y":0.03478,"z":-0.05500000000000001,"voltage":5.001223651664557},{"no":"point39","x":0.1,"y":0.02477,"z":-0.05500000000000001,"voltage":5.011223651664557},{"no":"point40","x":0.0,"y":0.04478,"z":-0.05500000000000001,"voltage":5.021223651664557},{"no":"point41","x":0.0,"y":0.03478,"z":-0.05500000000000001,"voltage":5.031223651664557},{"no":"point42","x":0.0,"y":0.02477,"z":-0.05500000000000001,"voltage":5.0412236516645565},{"no":"point43","x":-0.1,"y":0.04478,"z":-0.05500000000000001,"voltage":5.051223651664556},{"no":"point44","x":-0.1,"y":0.03478,"z":-0.05500000000000001,"voltage":5.061223651664556},{"no":"point45","x":-0.1,"y":0.02477,"z":-0.05500000000000001,"voltage":5.071223651664556},{"no":"point46","x":0.1,"y":0.04478,"z":-0.1,"voltage":5.081223651664556},{"no":"point47","x":0.1,"y":0.03478,"z":-0.1,"voltage":5.0912236516645555},{"no":"point48","x":0.1,"y":0.02477,"z":-0.1,"voltage":5.101223651664555},{"no":"point49","x":0.0,"y":0.04478,"z":-0.1,"voltage":5.111223651664555},{"no":"point50","x":0.0,"y":0.03478,"z":-0.1,"voltage":5.121223651664555},{"no":"point51","x":0.0,"y":0.02477,"z":-0.1,"voltage":5.131223651664555},{"no":"point52","x":-0.1,"y":0.04478,"z":-0.1,"voltage":5.141223651664554},{"no":"point53","x":-0.1,"y":0.03478,"z":-0.1,"voltage":5.151223651664554},{"no":"point54","x":-0.1,"y":0.02477,"z":-0.1,"voltage":5.161223651664554}
];



}
