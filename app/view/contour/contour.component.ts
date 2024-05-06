import { Component } from '@angular/core';
import * as echarts from 'echarts';
import { TestService } from '../../service/test.service';


@Component({
  selector: 'app-contour',
  templateUrl: './contour.component.html',
  styleUrl: './contour.component.scss'
})
export class ContourComponent {


  chartOptions?: any;


  constructor(
    private test : TestService
  ){

    this.test.readData({}).subscribe(result=>{
      console.log(result);
      this.drawContourPlot(result['xq'], result['yq'], result['zq'])
      
    })


 
  }


  drawContourPlot(xq: number[], yq: number[], zq: number[]) {
      // xq와 yq를 카테고리로 변환
      const xAxisData = xq.map(value => value.toString());
      const yAxisData = yq.map(value => value.toString());
  
      // xq, yq의 최솟값과 최댓값 계산
      const minX = Math.min(...xq);
      const maxX = Math.max(...xq);
      const minY = Math.min(...yq);
      const maxY = Math.max(...yq);
  
      // xq, yq의 간격 계산
      const intervalX = (maxX - minX) / xAxisData.length;
      const intervalY = (maxY - minY) / yAxisData.length;
    
      console.log( zq.map((value, index) => [xAxisData[index], yAxisData[index], value]));
      
      // 컨투어 플롯 옵션 설정
      this.chartOptions = {
          xAxis: {
              type: 'category',
              data: xAxisData,
              min: minX,
              max: maxX,
            //   axisLabel: {
            //       interval: Math.ceil(xAxisData.length / 10), // 간격을 조정하여 전체 영역에 골고루 분포되도록 함
            //       formatter: (value: string) => parseFloat(value).toFixed(2) // 소수점 자리수를 조정하여 표시
            //   }
          },
          yAxis: {
              type: 'category',
              data: yAxisData,
              min: minY,
              max: maxY,
            //   axisLabel: {
            //       interval: Math.ceil(yAxisData.length / 10), // 간격을 조정하여 전체 영역에 골고루 분포되도록 함
            //       formatter: (value: string) => parseFloat(value).toFixed(2) // 소수점 자리수를 조정하여 표시
            //   }
          },
          visualMap: {
              min: Math.min(...zq),
              max: Math.max(...zq),
              calculable: true,
              realtime: false,
              inRange: {
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
                  ]
              }
          },
          series: [
              {
                  name: 'Gaussian',
                  type: 'heatmap',
                  data: zq.map((value, index) => {
                    const yValue = yAxisData[index] !== undefined ? yAxisData[index] : yAxisData[0];
                    return [xAxisData[index], yValue, value];
                }),
                  emphasis: {
                      itemStyle: {
                          borderColor: '#333',
                          borderWidth: 1
                      }
                  },
                  progressive: 1000,
                  animation: false
              }
          ]
      };
  }






}