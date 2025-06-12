import { ShareFunctionService } from './../../service/share-function.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VesselBayComponent } from '@smuport/ngx-port-v';
import { VesselBay } from '@smuport/ngx-port-v';
import { ResizableColumnDirective } from '../../directive/resize-table.driective';
import {
  Subject,
  Observable,
  BehaviorSubject,
  combineLatest,
  debounceTime,
  startWith,
  delay,
  switchMap,
  finalize,
  Subscription,
} from 'rxjs';
import {
  preStow,
  pIdList,
  ctnGroupList,
} from '../../interface/container_pid_ctngroup';
import { PreStorageServiceService } from '../../service/pre-storage-service.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-bay-plot',
  imports: [
    CommonModule,
    VesselBayComponent,
    NzModalModule,
    NzSpinModule,
    NzAlertModule,
    NzDrawerModule,
    NzSpaceModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzInputModule,
  ],
  templateUrl: './bay-plot.component.html',
  styleUrl: './bay-plot.component.css',
})
export class BayPlotComponent {
  pIdPageIndex$ = new BehaviorSubject<number>(1);
  pIdPageSize$ = new BehaviorSubject<number>(10);
  pIdSearch$ = new Subject<string>();
  pIdInputDebounce$!: Observable<string>;
  constructor(private service: PreStorageServiceService,private ShareFunctionService:ShareFunctionService) {
    this.pIdInputDebounce$ = this.pIdSearch$.pipe(debounceTime(300));
  }
  error!: string;
  isError: boolean = false;
  bayPlotIsVisible: boolean = false;
  pIdInput: FormControl = new FormControl();
  pIdSearchValue: string = '';
  isLoading: boolean = false;
  PidisVisible: boolean = false;
  allPIdList: pIdList[] = [];
  pIdCount!: number;
  pIdPageIndex = 1;
  pIdPageSize = 10;
  drawerVisible: boolean = false;
  pIdList: pIdList[] = [];
  vesselBay: VesselBay[] = [];
  vesselBayDatas: any[] = [];
  ctnGroupList: ctnGroupList[] = [];
  title: string = '船贝图';
  size: 'large' | 'default' = 'default';
  DrawerShow(): void {
    this.drawerVisible = true;
    const inputValue = this.pIdInput.value;
    if (inputValue) {
      this.fetchBayDataByPId(inputValue);
    }
  }
  drawerClose(): void {
    this.drawerVisible = false;
  }
  // getAllPidList() {
  //   this.service.PreStowGet(1, 1000,true).subscribe((r) => {
  //     this.allPIdList = r.p_id_counts;
  //   });
  // }
  modelhandleCancel() {
    this.PidisVisible = false;
    this.pIdInput.reset();
  }
  modelhandleOk() {
    this.PidisVisible = false;
  }
  bayPlotShowModal() {
    this.bayPlotIsVisible = true;
  }
  bayPlotHandleCancel() {
    this.bayPlotIsVisible = false;
  }
  bayPlotHandleOk() {
    this.bayPlotIsVisible = false;
  }
  pIdShowModal() {
    this.PidisVisible = true;
    this.isLoading = true;

    this.service
      .PreStowGet(1, 1000,true)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (r) => {
          this.allPIdList = r.p_id_counts;
          this.allPIdList.sort((a, b) => b.count - a.count);
          console.log(this.allPIdList);
          this.pIdCount = this.allPIdList.length;
          this.updatePIdList();
        },
        (error) => {
          this.ShareFunctionService.resloveErrorCase(error);
        }
      );
  }
  onPIdPageSizeChange() {
    this.updatePIdList();
  }
  onPIdPageIndexChange() {
    this.updatePIdList();
  }
  updatePIdList() {
    const startIndex = (this.pIdPageIndex - 1) * this.pIdPageSize;
    const endIndex = startIndex + this.pIdPageSize;
    this.pIdList = this.allPIdList.slice(startIndex, endIndex);
  }
  fetchBayDataByPId(pId: string) {

    this.service.preStowSearch(1, 99999, pId).subscribe(
      (r) => {
        this.vesselBayDatas = r.real_final_result;
        this.ctnGroupList = r.ctn_group_list;
      },
      (error) => {
        this.ShareFunctionService.resloveErrorCase(error);
      }
    );
  }

}
