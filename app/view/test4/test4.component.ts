import { Component } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-test4',
  templateUrl: './test4.component.html',
  styleUrl: './test4.component.scss'
})
export class Test4Component {
  voList : any[]=[]
  
  constructor(){
    // this.generateResult(this.lineList, this.groupList, currentDsgId,currentIdx , [])
    // this.createVolist()
    // this.transformLists(this.lineList , this.groupList)
    // console.log( this.transformLists(this.lineList , this.groupList));
    // this.test1()
  //  this.createNewList(this.groupList , this.lineList)
  //  console.log(this.createNewList(this.groupList , this.lineList));
  this.mapGroupPaths(this.groupList, this.lineList)
  console.log(this.mapGroupPaths(this.groupList, this.lineList));
  
   
  }


  // mapGroupPaths(groups: any[], lines: any[]) {
  //   return groups.map(group => {
  //     let map_list: number[][] = [];
  //     if (group.standard_yn) {
  //       // standard_yn이 true인 경우 시작점입니다.
  //       map_list = this.findAllPaths(group, group, lines);
  //     } else {
  //       // 각 그룹에 대해 시작점에서 현재 그룹까지의 모든 경로를 찾습니다.
  //       const startingGroups = groups.filter(g => g.standard_yn);
  //       for (const startingGroup of startingGroups) {
  //         const newPaths = this.findAllPaths(startingGroup, group, lines);
  //         map_list = [...map_list, ...newPaths];
  //       }
  //     }
  //     // 중복 경로를 제거합니다.
  //     const uniquePaths = map_list
  //     .filter(path => path != null) // null이거나 undefined인 경로를 제거합니다.
  //     .map(path => JSON.stringify(path)) // 경로를 문자열로 변환합니다.
  //     .filter((v, i, a) => a.indexOf(v) === i) // 중복을 제거합니다.
  //     .map(str => JSON.parse(str)); // 문자열을 다시 배열로 변환합니다.
    
  //   return { ...group, map_list: uniquePaths };
  //   });
  // }


  // findAllPaths(sourceGroup: any, targetGroup: any, lines: any[], path: number[] = [], visited: Set<string> = new Set()): number[][] {
  //   visited.add(sourceGroup.dsg_id); // 현재 그룹을 방문한 것으로 표시합니다.
  //   const currentPath = [...path];
  //   const outgoingLines = lines.filter(line => line.source_group_id === sourceGroup.dsg_id);
  //   const paths: number[][] = [];
  
  //   for (const line of outgoingLines) {
  //     if (line.target_group_id === targetGroup.dsg_id) {
  //       paths.push([...currentPath, line.line_index]);
  //     } else if (!visited.has(line.target_group_id)) { // 아직 방문하지 않은 그룹만을 대상으로 합니다.
  //       const nextSourceGroup = this.groupList.find(group => group.dsg_id === line.target_group_id);
  //       if (nextSourceGroup) {
  //         const newPaths = this.findAllPaths(nextSourceGroup, targetGroup, lines, [...currentPath, line.line_index], new Set(visited));
  //         paths.push(...newPaths);
  //       }
  //     }
  //   }
  //   return paths;
  // }

  

  // findAllPaths(sourceGroup: any, targetGroup: any, lines: any[], path: number[] = []): number[][] {
  //   // 경로의 복사본을 만듭니다.
  //   const currentPath = [...path];
  
  //   // 해당 sourceGroup에서 출발하는 모든 line을 찾습니다.
  //   const outgoingLines = lines.filter(line => line.source_group_id === sourceGroup.dsg_id);
  
  //   // 모든 경로를 저장할 배열입니다.
  //   const paths: number[][] = [];
  
  //   for (const line of outgoingLines) {
  //     if (line.target_group_id === targetGroup.dsg_id) {
  //       // 목표 그룹에 도달했을 경우, 현재 경로를 저장합니다.
  //       paths.push([...currentPath, line.line_index]);
  //     } else {
  //       // 아직 목표에 도달하지 않았다면, 다음 그룹으로 경로 탐색을 계속합니다.
  //       const nextSourceGroup = this.groupList.find(group => group.dsg_id === line.target_group_id);
  //       if (nextSourceGroup) {
  //         const newPaths = this.findAllPaths(nextSourceGroup, targetGroup, lines, [...currentPath, line.line_index]);
  //         for (const newPath of newPaths) {
  //           paths.push(newPath);
  //         }
  //       }
  //     }
  //   }
  //   return paths;
  // }

  
  


  mapGroupPaths(groupList: any[], lineList: any[]){
    const mappedGroups: any[] = groupList.map(group => ({
      ...group,
      map_list: [] as number[] // 배열 타입을 number 배열로 변경
    }));
  
    for (const line of lineList) {
      const sourceGroup = mappedGroups.find(g => g.dsg_id === line.source_group_id && g.idx === line.source_group_idx);
      const targetGroup = mappedGroups.find(g => g.dsg_id === line.target_group_id && g.idx === line.target_group_idx);
      
      if (sourceGroup && targetGroup) {
        if (sourceGroup.standard_yn) {
          // 시작점에서 바로 도달하는 경우
          targetGroup.map_list.push(line.line_index);
        } else {
          // 중간 경로를 포함하는 경우
        const sourcePath = [...sourceGroup.map_list];
        const newPath = sourcePath.map(value => typeof value === 'number' ? [value] : value).flat(); 
        targetGroup.map_list.push([...newPath, line.line_index]);
          console.log(targetGroup.map_list);
        }
      }
    }
    
    return mappedGroups.sort((a, b) => a.idx - b.idx); // idx 기준으로 정렬
  }

  



  createNewList(groups: any[], lines: any[]): any[] {
    let newGroups: any[] = [];
    
    // 모든 그룹을 순회
    groups.forEach(group => {
      let mapList: number[] = [];
      if (group.standard_yn) {
        // standard_yn이 true인 그룹부터 시작
        this.calculatePath(group, lines, mapList);
      }
      
      newGroups.push({
        map_id: group.map_id,
        dsg_id: group.dsg_id,
        idx: group.idx,
        map_list: mapList
      });
    });
    
    return newGroups;
  }
  
  // 경로를 계산하는 보조 함수
 calculatePath(currentGroup: any, lines: any[], mapList: number[]) {
    // 현재 그룹에서 출발하는 라인 찾기
    let outgoingLines = lines.filter(line => line.source_group_id== currentGroup.dsg_id && line.source_group_idx == currentGroup.idx);
    console.log(outgoingLines);
    
    outgoingLines.forEach(line => {
      // 타겟 그룹을 찾고 mapList에 추가
      let targetGroup = this.groupList.find(group => group.dsg_id == line.target_group_id && group.idx == line.target_group_idx);
      if (targetGroup && !mapList.includes(line.line_index)) {
        let newGroups: any[] = [];
        
        newGroups.push({
          map_id: currentGroup.map_id,
          dsg_id: currentGroup.dsg_id,
          idx: currentGroup.idx,
          map_list: mapList
        });


        mapList.push(line.line_index);
        // 타겟 그룹에서 계속 경로 탐색
        this.calculatePath(targetGroup, lines, mapList);
      }
    });
  }

  

test1(){
  const startIndex = this.groupList.findIndex(group => group.standard_yn);

  // Initialize the new list
const newList = [];

// Iterate over groups from the starting index to the end
for (let i = startIndex; i < this.groupList.length; i++) {
 const group = this.groupList[i];
 const newGroup = {
    ...group,
    map_list: []
 };

 // Find all line_index values related to the current group
 const relatedLines = this.lineList.filter(line => line.source_group_id === group.dsg_id && line.source_group_idx === group.idx);

 // Add line_index values to map_list
 relatedLines.forEach(line => {
    const targetIndex = this.groupList.findIndex(g => g.dsg_id === line.target_group_id && g.idx === line.target_group_idx);
    if (targetIndex !== -1) {
      newGroup.map_list.push(targetIndex);
    }
 });

 // Check for multiple paths to the same group
 const paths = newGroup.map_list.reduce((acc : any, curr : any) => {
    const path = acc.find((p :any)=> p.includes(curr));
    if (path) {
      path.push(curr);
    } else {
      acc.push([curr]);
    }
    return acc;
 }, []);

 // Update map_list with paths
 newGroup.map_list = paths;

 // Add the new group to the new list
 newList.push(newGroup);
}

console.log(newList);

}








   transformLists(groupList: any[], lineList: any[]) {
    // Step 1: Create a mapping function
    const transformedList: any[] = groupList.map(item => ({
       ...item,
       map_list: []
    }));
   
    // Step 2: Populate `map_list`
    lineList.forEach(line => {
       const sourceIndex = transformedList.findIndex(item => item.dsg_id === line.source_group_id);
       const targetIndex = transformedList.findIndex(item => item.dsg_id === line.target_group_id);
   
       if (sourceIndex !== -1) {
         const sourceItem = transformedList[sourceIndex];
         const targetItem = transformedList[targetIndex];
   
         // Check if `map_list` is already an array (nested structure)
         if (Array.isArray(sourceItem.map_list[0])) {
           // Find the correct nested array to append to
           const nestedArray = sourceItem.map_list.find((arr:any) => arr.includes(line.source_group_idx));
           if (nestedArray) {
             nestedArray.push(line.target_group_idx);
           } else {
             // If no matching nested array found, create a new one
             sourceItem.map_list.push([line.source_group_idx, line.target_group_idx]);
           }
         } else {
           // If `map_list` is not an array, initialize it as one
           sourceItem.map_list = [[line.source_group_idx, line.target_group_idx]];
         }
       }
    });
   
    return transformedList;
   }












  generateResult(mapData : any[], dsgData : any[] , currentDsgId: string, currentIdx: number,  currentMapList:number[]){

    const result: any[] = [];

    for (const mapEntry of mapData) {
      if (mapEntry.source_group_id === currentDsgId && mapEntry.source_group_idx === currentIdx) {
          const nextDsgId = mapEntry.target_group_id;
          const nextIdx = mapEntry.target_group_idx;
          const nextMapList = [...currentMapList, nextIdx];
          result.push(...this.generateResult(mapData, dsgData, nextDsgId, nextIdx, nextMapList));
      }
  }

  for (const dsgEntry of dsgData) {
      if (dsgEntry.dsg_id === currentDsgId && dsgEntry.idx === currentIdx) {
          const newMapEntry = {
              map_id: dsgEntry.map_id,
              dsg_id: currentDsgId,
              idx: currentIdx,
              map_list: currentMapList,
          };
          result.push(newMapEntry);
          break;
      }
  }

    console.log(result);
    
    return result;
    

  }
  
createVolist(){

  const voList: any[] = [];
 const startGroup = this.groupList.find(item => item.standard_yn === true);

 if (startGroup) {
    const obj = {
      map_id: startGroup.map_id,
      dsg_id: startGroup.dsg_id,
      idx: startGroup.idx,
      map_list: []
    };
    voList.push(obj);
 }

 this.groupList.forEach(group => {
    const filterLine1 = this.lineList.filter(item => item.source_group_id === group.dsg_id && item.source_group_idx === group.idx);

    if (filterLine1.length > 0) {
      filterLine1.forEach(line => {
        const obj = {
          map_id: line.map_id,
          dsg_id: line.target_group_id,
          idx: line.target_group_idx,
          map_list: [line.line_index]
        };
        voList.push(obj);

        const filterLine2 = this.lineList.filter(item => item.source_group_id === line.target_group_id && item.source_group_idx === line.target_group_idx);
        if (filterLine2.length > 0) {
          filterLine2.forEach(line2 => {
            const existingObj = voList.find(vo => vo.dsg_id === line2.target_group_id && vo.idx === line2.target_group_idx);
            if (existingObj) {
              existingObj.map_list.push(line2.line_index);
            } else {
              const newObj = {
                map_id: line2.map_id,
                dsg_id: line2.target_group_id,
                idx: line2.target_group_idx,
                map_list: [line2.line_index]
              };
              voList.push(newObj);
            }
          });
        }
      });
    }
 });

 console.log(JSON.stringify(voList));

 

// const voList : any[] = []
// const startGroup = this.groupList.find(item => item.standard_yn =true)



// if(startGroup){
//   const obj = {
//     map_id: startGroup.map_id,
//     dsg_id: startGroup.dsg_id,
//     idx: startGroup.idx,
//     map_list: []
//   }

//   voList.push(obj)
// }

// this.groupList.forEach(e=>{
//   const filterLine1 = this.lineList.filter(item => item.source_group_id == e.dsg_id 
//     && item.source_group_idx == e.idx)

//     console.log(filterLine1);
    
//     if(filterLine1.length>0){
//        if (filterLine1.length>1){
//         filterLine1.forEach((line,idx: any)=>{
//           const obj = {
//             map_id: filterLine1[idx].map_id,
//             dsg_id: filterLine1[idx].target_group_id,
//             idx: filterLine1[idx].target_group_idx,
//             map_list: [filterLine1[idx].line_index]
//           }
//           voList.push(obj)
//           const filterLine2 = this.lineList.filter(item => item.source_group_id == line.target_group_id 
//             && item.source_group_idx == line.target_group_idx)

//             console.log(filterLine2);
            
//         })
        
//       }else{

//         filterLine1.forEach(line=>{
//           const filterLine2 = this.lineList.filter(item => item.source_group_id == line.target_group_id 
//             && item.source_group_idx == line.target_group_idx)


//             console.log(filterLine2);
            
//         })
//       }
//     }
// })

// console.log(voList);

}


  groupList : any[]=
  
[
  {
  "map_id":"id_1",
  "dsg_id": "dsg_1",
  "idx" : 0, 
  "standard_yn": true
  },
  {
  "map_id":"id_1",
  "dsg_id": "dsg_1",
  "idx" : 1, 
  "standard_yn": false
  },
  {
  "map_id":"id_1",
  "dsg_id": "dsg_2",
  "idx" : 2, 
  "standard_yn": false
  },
  {
  "map_id":"id_1",
  "dsg_id": "dsg_2",
  "idx" : 3, 
  "standard_yn": false
  },
  {
  "map_id":"id_1",
  "dsg_id": "dsg_3",
  "idx" : 4, 
  "standard_yn": false
  },
  {
  "map_id":"id_1",
  "dsg_id": "dsg_4",
  "idx" : 5, 
  "standard_yn": false
  },
  {
  "map_id":"id_1",
  "dsg_id": "dsg_5",
  "idx" : 6, 
  "standard_yn": false
  },
{
  "map_id":"id_1",
  "dsg_id": "dsg_6",
  "idx" : 7, 
  "standard_yn": false
  },
{
  "map_id":"id_1",
  "dsg_id": "dsg_7",
  "idx" : 8, 
  "standard_yn": false
  },
{
  "map_id":"id_1",
  "dsg_id": "dsg_8",
  "idx" : 9, 
  "standard_yn": false
  }
  ]
  // [
  //   {
  //   "map_id":"id_1",
  //   "dsg_id": "dsg_1",
  //   "idx" : 0, 
  //   "standard_yn": true
  //   },
  //   {
  //   "map_id":"id_1",
  //   "dsg_id": "dsg_1",
  //   "idx" : 1, 
  //   "standard_yn": false
  //   },
  //   {
  //   "map_id":"id_1",
  //   "dsg_id": "dsg_2",
  //   "idx" : 2, 
  //   "standard_yn": false
  //   },
  //   {
  //   "map_id":"id_1",
  //   "dsg_id": "dsg_2",
  //   "idx" : 3, 
  //   "standard_yn": false
  //   },
  //   {
  //   "map_id":"id_1",
  //   "dsg_id": "dsg_3",
  //   "idx" : 4, 
  //   "standard_yn": false
  //   },
  //   {
  //   "map_id":"id_1",
  //   "dsg_id": "dsg_4",
  //   "idx" : 5, 
  //   "standard_yn": false
  //   },
  //   {
  //   "map_id":"id_1",
  //   "dsg_id": "dsg_5",
  //   "idx" : 6, 
  //   "standard_yn": false
  //   }
  //   ]

  lineList : any[]= 
  [
    {"map_id":"id_1",
    "source_col_en":"name",
    "source_group_id":"dsg_1",
    "source_group_idx":0,
    "target_col_en":"key",
    "target_group_id":"dsg_2",
    "target_group_idx":2,
    "line_index":0},
    {"map_id":"id_1",
    "source_col_en":"name",
    "source_group_id":"dsg_1",
    "source_group_idx":0,
    "target_col_en":"id",
    "target_group_id":"dsg_1",
    "target_group_idx":1,
    "line_index":1},
    {"map_id":"id_1",
    "source_col_en":"id",
    "source_group_id":"dsg_1",
    "source_group_idx":1,
    "target_col_en":"reg_user",
    "target_group_id":"dsg_2",
    "target_group_idx":3,
    "line_index":2},
    {"map_id":"id_1",
    "source_col_en":"reg_user",
    "source_group_id":"dsg_2",
    "source_group_idx":3,
    "target_col_en":"title",
    "target_group_id":"dsg_5",
    "target_group_idx":6,
    "line_index":3},
    {"map_id":"id_1",
    "source_col_en":"key",
    "source_group_id":"dsg_2",
    "source_group_idx":2,
    "target_col_en":"udt_user",
    "target_group_id":"dsg_3",
    "target_group_idx":4,
    "line_index":4},
    {"map_id":"id_1",
    "source_col_en":"udt_user",
    "source_group_id":"dsg_3",
    "source_group_idx":4,
    "target_col_en":"name",
    "target_group_id":"dsg_4",
    "target_group_idx":5,
    "line_index":5},
    {"map_id":"id_1",
    "source_col_en":"reg_user",
    "source_group_id":"dsg_2",
    "source_group_idx":3,
    "target_col_en":"desc",
    "target_group_id":"dsg_4",
    "target_group_idx":5,
    "line_index":6},
    {"map_id":"id_1",
    "source_col_en":"name",
    "source_group_id":"dsg_1",
    "source_group_idx":0,
    "target_col_en":"code",
    "target_group_id":"dsg_6",
    "target_group_idx":7,
    "line_index":7},
    {"map_id":"id_1",
    "source_col_en":"code",
    "source_group_id":"dsg_6",
    "source_group_idx":7,
    "target_col_en":"key",
    "target_group_id":"dsg_7",
    "target_group_idx":8,
    "line_index":8},
    {"map_id":"id_1",
    "source_col_en":"key",
    "source_group_id":"dsg_7",
    "source_group_idx":8,
    "target_col_en":"user",
    "target_group_id":"dsg_8",
    "target_group_idx":9,
    "line_index":9},
    {"map_id":"id_1",
    "source_col_en":"udt_user",
    "source_group_id":"dsg_3",
    "source_group_idx":4,
    "target_col_en":"user",
    "target_group_id":"dsg_8",
    "target_group_idx":9,
    "line_index":10},
    {"map_id":"id_1",
    "source_col_en":"key",
    "source_group_id":"dsg_2",
    "source_group_idx":2,
    "target_col_en":"user",
    "target_group_id":"dsg_8",
    "target_group_idx":9,
    "line_index":11}
    ]    
  // [
  //   {"map_id":"id_1",
  //   "source_col_en":"name",
  //   "source_group_id":"dsg_1",
  //   "source_group_idx":0,
  //   "target_col_en":"key",
  //   "target_group_id":"dsg_2",
  //   "target_group_idx":2,
  //   "line_index":0},
  //   {"map_id":"id_1",
  //   "source_col_en":"name",
  //   "source_group_id":"dsg_1",
  //   "source_group_idx":0,
  //   "target_col_en":"id",
  //   "target_group_id":"dsg_1",
  //   "target_group_idx":1,
  //   "line_index":1},
  //   {"map_id":"id_1",
  //   "source_col_en":"id",
  //   "source_group_id":"dsg_1",
  //   "source_group_idx":1,
  //   "target_col_en":"reg_user",
  //   "target_group_id":"dsg_2",
  //   "target_group_idx":3,
  //   "line_index":2},
  //   {"map_id":"id_1",
  //   "source_col_en":"reg_user",
  //   "source_group_id":"dsg_2",
  //   "source_group_idx":3,
  //   "target_col_en":"title",
  //   "target_group_id":"dsg_5",
  //   "target_group_idx":6,
  //   "line_index":3},
  //   {"map_id":"id_1",
  //   "source_col_en":"key",
  //   "source_group_id":"dsg_2",
  //   "source_group_idx":2,
  //   "target_col_en":"udt_user",
  //   "target_group_id":"dsg_3",
  //   "target_group_idx":4,
  //   "line_index":4},
  //   {"map_id":"id_1",
  //   "source_col_en":"udt_user",
  //   "source_group_id":"dsg_3",
  //   "source_group_idx":4,
  //   "target_col_en":"name",
  //   "target_group_id":"dsg_4",
  //   "target_group_idx":5,
  //   "line_index":5},
  //   {"map_id":"id_1",
  //   "source_col_en":"reg_user",
  //   "source_group_id":"dsg_2",
  //   "source_group_idx":3,
  //   "target_col_en":"desc",
  //   "target_group_id":"dsg_4",
  //   "target_group_idx":5,
  //   "line_index":6}
  //   ]
}
