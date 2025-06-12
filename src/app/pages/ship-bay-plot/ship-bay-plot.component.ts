// // import { VesselBay } from './../../../../node_modules/@smuport/ngx-port-v/lib/model/vessel-bay.d';
// import {
//   AfterViewInit,
//   Component,
//   Input,
//   ViewChildren,
//   QueryList,
// } from '@angular/core';
// import {
//   AnimationObject,
//   CanvasProComponent,
//   Layer,
// } from '@smuport/ngx-canvas-pro';
// import { interval, timer } from 'rxjs';
// // import {
// //   BayCellsData,
// //   BayContainersData,
// //   ctnGroupList,
// // } from '../pre-stow/pre-stow.component';
// import { CommonModule } from '@angular/common';
// import { ChooseColorService } from '../../service/choose-color.service';
// import {VesselBay} from '@smuport/ngx-port-v';
// import { VesselBayComponent } from '@smuport/ngx-port-v';
// @Component({
//   selector: 'app-ship-bay-plot',
//   imports: [CanvasProComponent, CommonModule],
//   templateUrl: './ship-bay-plot.component.html',
//   styleUrl: './ship-bay-plot.component.css',
// })
// export class ShipBayPlotComponent implements AfterViewInit {
//   constructor(private chooseColorService: ChooseColorService) {}
//   @ViewChildren('shipbay') shipCanvases!: QueryList<CanvasProComponent>;
//   // @Input() bayData: BayContainersData[] = [];
//   // @Input() cellData: BayCellsData[] = [];
//   // @Input() ctnGroupList: ctnGroupList[] = [];

//   ngAfterViewInit() {
//     this.initializeCanvases();
//     this.shipCanvases.changes.subscribe(() => {
//       console.log('画布元素发生变化，重新初始化');
//       this.initializeCanvases();
//     });
//   }
//   private initializeCanvases() {
//     console.log('初始化画布，当前画布数量:', this.shipCanvases?.length);
//     if (this.shipCanvases && this.shipCanvases.length > 0) {
//       this.shipCanvases.forEach((canvas, index) => {
//         if (canvas) {
//           console.log(`初始化第 ${index + 1} 个画布`);
//           const shipLayer = this.getShipLayer(index);
//           const ctnLayer = this.getCtnLayer(index);
//           canvas.addLayer(shipLayer);
//           canvas.addLayer(ctnLayer);
//           canvas.startDataflow();
//           canvas.startListenEvent();
//           canvas.startAnimation();
//         }
//       });
//     }
//   }

//   public renderBayData(data: BayContainersData[]): void {
//     this.bayData = data;
//     // console.log('接收到箱子数据:', this.bayData);
//     // console.log('箱子数量=', this.bayData.length);
//     setTimeout(() => this.initializeCanvases(), 0);
//   }
//   public renderCtnGroupList(data: ctnGroupList[]): void {
//     this.ctnGroupList = data;
//     // console.log('接收到箱组数据:', this.ctnGroupList);
//     setTimeout(() => this.initializeCanvases(), 0);
//   }

//   public renderBayCellData(data: BayCellsData[]): void {
//     this.cellData = data;
//     console.log('接收到船贝数据:', this.cellData);
//     console.log('船贝数量=', this.cellData.length);
//     setTimeout(() => this.initializeCanvases(), 0);
//   }

//   getBayNumber(cellData: BayCellsData) {
//     if (cellData.bays) {
//       for (const bay of Object.keys(cellData.bays)) {
//         return bay;
//       }
//     }
//     return '';
//   }
//   getCtnLayer(index: number) {
//     const ctnLayer = new Layer('ctn');
//     ctnLayer.updateSize(1000, 1200);
//     const currentCtnData = this.bayData[index];
//     console.log('设置箱子的数据源:', currentCtnData);
//     ctnLayer.setDataSource(currentCtnData);
//     ctnLayer.trigger = timer(0, 1000);
//     ctnLayer.setRenderer((ctx, data) => {
//       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//       const ctn_height = 24;
//       const ctn_width = 48;
//       const offsetX = 50;
//       const offsetY = 50;
//       for (const bayNumber of Object.keys(data.bays)) {
//         const bayData = data.bays[bayNumber];
//         for (const pod of Object.keys(bayData)) {
//           const podData = bayData[pod];
//           for (const ctnGroup of Object.keys(podData)) {
//             const containers = podData[ctnGroup];
//             containers.forEach((container: any) => {
//               const ctnVesselCell = container.ves_cell;
//               if (
//                 container &&
//                 typeof container.x === 'number' &&
//                 typeof container.y === 'number'
//               ) {
//                 // 设置集装箱样式 - 根据目的港或箱组设置不同颜色
//                 ctx.fillStyle = this.chooseColorService.ctnGroupChooseColor(ctnGroup, this.ctnGroupList);
//                 // ctx.fillStyle = '#E4BD4C';
//                 ctx.strokeStyle = '#000000';
//                 ctx.lineWidth = 1;
//                 let x = offsetX + container.x;
//                 let y = offsetY + container.y;
//                 if (container.location_type === 'Hold') {
//                   // if(container.x!==)
//                   y += 16;
//                   x += 5;
//                 }
//                 if (container.location_type === 'Deck') {
//                   y += 10;
//                   x += 5;
//                 }
//                 if (container.location_type === 'Hold') {
//                   x += this.calculateHoldDifferenceX(this.cellData[index]);
//                 }
//                 ctx.fillRect(x, y, ctn_width, ctn_height);
//                 ctx.strokeRect(x, y, ctn_width, ctn_height);
//                 ctx.fillStyle = '#FFFFFF';
//               }
//             });
//           }
//         }
//       }
//     });

//     return ctnLayer;
//   }

//   private getShipLayer(index: number): Layer {
//     const shipLayer = new Layer('ship');
//     shipLayer.updateSize(1000, 1200);

//     const currentCellData = this.cellData[index];
//     console.log('设置数据源:', currentCellData);
//     shipLayer.setDataSource(currentCellData);
//     shipLayer.trigger = timer(0, 1000);

//     shipLayer.setRenderer((ctx, data) => {
//       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//       const ctn_height = 24;
//       const ctn_width = 48;
//       const offsetX = 50;
//       const offsetY = 50;
//       // ctx.fillStyle = '#f0f0f0';
//       // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//       // const isPaired = data.is_paired;
//       const bayNumber = this.getBayNumber(data);
//       if (!bayNumber) return;
//       ctx.fillStyle = '#000000';
//       ctx.font = 'bold 24px Arial';
//       ctx.fillText(`贝号: ${bayNumber}`, offsetX, offsetY - 10);
//       ctx.strokeStyle = '#999999';
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.stroke();

//       const columns = new Set<string>();
//       const tiers = new Set<string>();
//       const holdTiers = new Set<string>();
//       const deckTiers = new Set<string>();

//       if (
//         data.bays &&
//         data.bays[bayNumber] &&
//         Array.isArray(data.bays[bayNumber])
//       ) {
//         // 第一次遍历收集所有列号和层号
//         data.bays[bayNumber].forEach((cell: any) => {
//           if (cell.column) columns.add(cell.column);
//           if (cell.tier) {
//             tiers.add(cell.tier);
//             if (cell.location_type === 'Hold') {
//               holdTiers.add(cell.tier);
//             } else if (cell.location_type === 'Deck') {
//               deckTiers.add(cell.tier);
//             }
//           }
//         });

//         // 第二次遍历绘制单元格
//         data.bays[bayNumber].forEach((cell: any) => {
//           ctx.fillStyle = '#fff';
//           ctx.strokeStyle = '#000000';
//           ctx.lineWidth = 1;
//           let x = offsetX + cell.x;
//           const y = offsetY + cell.y;
//           if (cell.location_type === 'Hold') {
//             x += this.calculateHoldDifferenceX(data);
//           }
//           const width = cell.width || ctn_width;
//           const height = cell.height || ctn_height;
//           ctx.fillRect(x, y, width, height);
//           ctx.strokeRect(x, y, width, height);
//         });

//         const sortedColumns = Array.from(columns).sort();
//         ctx.fillStyle = '#000000';
//         ctx.font = 'bold 14px Arial';

//         // 找到甲板和舱内的参考位置
//         const deckCells = data.bays[bayNumber].filter((c: any) => c.location_type === 'Deck');
//         const holdCells = data.bays[bayNumber].filter((c: any) => c.location_type === 'Hold');

//         // 分别为甲板和舱内绘制列号
//         if (deckCells.length > 0) {
//           // 按列分组甲板单元格
//           const deckColumnMap = new Map();
//           deckCells.forEach(cell => {
//             if (!deckColumnMap.has(cell.column)) {
//               deckColumnMap.set(cell.column, []);
//             }
//             deckColumnMap.get(cell.column).push(cell);
//           });

//           // 绘制甲板列号
//           for (const [column, cells] of deckColumnMap.entries()) {
//             if (cells.length > 0) {
//               const cell = cells[0]; // 取每列的第一个单元格作为参考
//               const x = offsetX + cell.x + ctn_width / 2 - 5;
//               ctx.fillText(column, x, offsetY +50);
//             }
//           }
//         }

//         if (holdCells.length > 0) {
//           // 按列分组舱内单元格
//           const holdColumnMap = new Map();
//           holdCells.forEach(cell => {
//             if (!holdColumnMap.has(cell.column)) {
//               holdColumnMap.set(cell.column, []);
//             }
//             holdColumnMap.get(cell.column).push(cell);
//           });

//           // 绘制舱内列号
//           for (const [column, cells] of holdColumnMap.entries()) {
//             if (cells.length > 0) {
//               const cell = cells[0]; // 取每列的第一个单元格作为参考
//               let x = offsetX + cell.x;
//               x += this.calculateHoldDifferenceX(data);
//               x += ctn_width / 2 - 5;
//               // 舱内列号放在舱内单元格的顶部
//               const topHoldCell = cells.reduce((prev:any, curr:any) =>
//                 (prev.y < curr.y) ? prev : curr);
//               ctx.fillText(column, x, offsetY + topHoldCell.y + 350);
//             }
//           }
//         }

//         // 绘制层号标识（在左侧）
//         // 分别处理舱内和甲板的层号
//         const sortedHoldTiers = Array.from(holdTiers).sort(
//           (a, b) => parseInt(a) - parseInt(b)
//         );
//         const sortedDeckTiers = Array.from(deckTiers).sort(
//           (a, b) => parseInt(a) - parseInt(b)
//         );

//         // 绘制舱内层号
//         sortedHoldTiers.forEach((tier) => {
//           const cellsInTier = data.bays[bayNumber].filter(
//             (c: any) => c.tier === tier && c.location_type === 'Hold'
//           );
//           if (cellsInTier.length > 0) {
//             const cell = cellsInTier[0];
//             const y = offsetY + cell.y;
//             ctx.fillText(tier, offsetX - 25, y + ctn_height / 2 + 5);
//           }
//         });

//         // 绘制甲板层号
//         sortedDeckTiers.forEach((tier) => {
//           const cellsInTier = data.bays[bayNumber].filter(
//             (c: any) => c.tier === tier && c.location_type === 'Deck'
//           );
//           if (cellsInTier.length > 0) {
//             const cell = cellsInTier[0];
//             const y = offsetY + cell.y;
//             // 在左侧绘制层号
//             ctx.fillText(tier, offsetX - 25, y + ctn_height / 2 + 5);
//           }
//         });
//       }
//     });

//     return shipLayer;
//   }
// private calculateHoldDifferenceX(cellData: BayCellsData): number {
//     const bayNumber = this.getBayNumber(cellData);
//     const bayCellList = cellData.bays[bayNumber];
//     const holdCells = bayCellList.filter(cell => cell.location_type === 'Hold');
//     const deckCells = bayCellList.filter(cell => cell.location_type === 'Deck');
//     const holdAvgX = holdCells.reduce((sum, cell) => sum + cell.x, 0) / holdCells.length;
//     const deckAvgX = deckCells.reduce((sum, cell) => sum + cell.x, 0) / deckCells.length;
//     const difference = deckAvgX - holdAvgX;

//     return difference;
//   }

// }
