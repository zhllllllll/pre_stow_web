import { ShareFunctionService } from './../../service/share-function.service';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { Vescell, VesselBayComponent } from '@smuport/ngx-port-v';
import { VesselBay } from '@smuport/ngx-port-v';
import { ResizableColumnDirective } from '../../directive/resize-table.driective';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  switchMap,
  finalize,
  timer,
  catchError,
  of,
  debounce,
} from 'rxjs';
import { pIdList, ctnGroupList, pIdAllList } from '../../interface/container_pid_ctngroup';
import { PreStorageServiceService } from '../../service/pre-storage-service.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import containerTypeStyles, {
  generateColor,
} from '../../service/choose-color-mode';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pid-message',
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
    NzSegmentedModule,
    NzCardModule,
    NzTagModule,
    RouterModule
  ],
  templateUrl: './pid-message.component.html',
  styleUrl: './pid-message.component.css',
})
export class PIDMessageComponent {
  constructor(
    private service: PreStorageServiceService,
    private ShareFunctionService: ShareFunctionService,
    private destoryRef: DestroyRef
  ) {
    const deboucnePIdInput$ = this.pidInput$.pipe(debounceTime(300));
    const timeRef$ = timer(0);
    combineLatest([
      deboucnePIdInput$,
      this.pIdPageIndex$,
      this.pIdPageSize$,
      timeRef$,
    ])
      .pipe(
        takeUntilDestroyed(destoryRef),
        switchMap(([input, index, size]) => {
          this.pIdPageSize = size;
          console.log('pidcombineLatest triggered:', { input, index, size });
          if (input == this.searchInput.trim()) {
            // console.log('input=', input);
            // console.log('输入框=', this.searchInput);
            this.pIdPageIndex = index;
          } else {
            this.isSearched = true;
            this.pIdPageIndex = 1;
          }
          this.searchInput = input;
          this.isPidInList = this.ShareFunctionService.checkPidInList(input);
          this.isPIDTableLoading = true;
          return this.service
            .PreStowPIDGet(this.pIdPageIndex, this.pIdPageSize, input)
            .pipe(finalize(() => (this.isPIDTableLoading = false)));
        }),
        catchError((error) => {
          this.ShareFunctionService.resloveErrorCase(error);
          return of({ results: [], all_count: 0 });
        })
      )
      .subscribe(
        (r) => {
          // console.log(r);
          this.pIdList = r.p_id_list;
          this.pIdCount = r.total_pids;
        },
        (error) => {
          this.ShareFunctionService.resloveErrorCase(error);
        },
        () => {
          console.log('combineLatest completed');
        }
      );
  }
  // 用于pid的搜索
  pIdInput: FormControl = new FormControl();
  searchInput: string = '';
  isPidInList: boolean = false;
  pIdPageIndex$ = new BehaviorSubject<number>(1);
  pIdPageSize$ = new BehaviorSubject<number>(10);
  pidInput$ = new BehaviorSubject<string>('');

  // 用于pidtable的信息展示
  isPIDTableLoading: boolean = false;
  pIdList: pIdList[] = [];
  pIdCount!: number;
  pIdPageSize: number = 10;
  pIdPageIndex: number = 1;
  isSearched: boolean = false;

  //处理错误
  isError: boolean = false;
  error!: string;

  // 搜索事件绑定
  pIdSearch(pIdInput: FormControl) {
    this.pidInput$.next(pIdInput.value);
    // console.log(pIdInput.value)
  }
  //换页
  onPIdPageIndexChange() {
    this.pIdPageIndex$.next(this.pIdPageIndex);
  }
  onPIdPageSizeChange() {
    this.pIdPageSize$.next(this.pIdPageSize);
  }
}
