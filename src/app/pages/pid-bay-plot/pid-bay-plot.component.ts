import { CommonModule } from '@angular/common';
import { Component, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  finalize,
  of,
  switchMap,
  timer,
} from 'rxjs';
import { ctnGroupList, preStow } from '../../interface/container_pid_ctngroup';
import { PreStorageServiceService } from '../../service/pre-storage-service.service';
import { ShareFunctionService } from './../../service/share-function.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { Vescell } from '@smuport/ngx-port-v';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { VesselBayComponent } from '@smuport/ngx-port-v';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import containerTypeStyles, {
  generateColor,
} from '../../service/choose-color-mode';

@Component({
  selector: 'app-pid-bay-plot',
  imports: [
    NzAlertModule,
    NzSpinModule,
    NzTableModule,
    CommonModule,
    NzDrawerModule,
    NzSegmentedModule,
    NzCardModule,
    NzTagModule,
    VesselBayComponent,
    NzModalComponent,
    NzModalModule,
  ],
  templateUrl: './pid-bay-plot.component.html',
  styleUrl: './pid-bay-plot.component.css',
})
export class PidBayPlotComponent implements OnInit {
  // 获取从pid-message页面传回来的pid
  queryParams!: string;
  pidId!: string;
  // 调路由获取当前pid对应的ctn信息
  ctnPageIndex$ = new BehaviorSubject<number>(1);
  ctnPageSize$ = new BehaviorSubject<number>(10);
  // ctnQueryPid$ = new Subject<string>();
  ctnQueryPid$ = new BehaviorSubject<string>('');
  //ctn信息展示
  isCtnMesLoading: boolean = false;
  ctnList: preStow[] = [];
  ctnPageIndex: number = 1;
  ctnPageSize: number = 10;
  ctnCount!: number;
  //错误情况
  isError: boolean = false;
  error!: string;
  //drawer 和传入drawer的数据
  drawerVisible: boolean = false;
  title: string = '船贝图';
  size: 'large' | 'default' = 'default';
  colorMode: string = 'pod';
  options = ['卸货港', '箱类型'];
  podColorDict: { [key: string]: string } = {};
  isVesCellVisible: boolean = false;
  vesCell?: Vescell<any>;
  vesselBayDatas: any[] = [];
  ctnGroupList: ctnGroupList[] = [];
  constructor(
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private service: PreStorageServiceService,
    private ShareFunctionService: ShareFunctionService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.pidId = params['pid'];
      console.log(this.pidId);
      this.ctnQueryPid$.next(this.pidId);
    });
    const timeRef$ = timer(0);
    combineLatest([
      this.ctnQueryPid$,
      this.ctnPageIndex$,
      this.ctnPageSize$,
      timeRef$,
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(([Pid, index, size]) => {
          if (!Pid) {
            console.log('pid不存在');
            return of({ results: [], all_count: 0 });
          }
          // console.log('pid=',Pid,'index=',index,'size=',size)
          this.isCtnMesLoading = true;
          return this.service
            .preStowSearch(index, size, Pid)
            .pipe(finalize(() => (this.isCtnMesLoading = false)));
        })
      )
      .subscribe(
        (r) => {
          this.ctnList = r.results;
          this.ctnCount = r.all_count;
          // console.log(r);
        },
        (error) => {
          this.ShareFunctionService.resloveErrorCase(error);
        }
      );
  }

  ngOnInit(): void {}
  onCtnPageIndexChange() {
    this.ctnPageIndex$.next(this.ctnPageIndex);
  }
  onCtnPageSizeChange() {
    this.ctnPageSize$.next(this.ctnPageSize);
  }
  //控制drawer
  drawerShow(): void {
    this.drawerVisible = true;
    this.service.preStowCtnGetAll(this.pidId).subscribe((r) => {
      this.vesselBayDatas = r.real_final_result;
      // console.log(this.vesselBayDatas)
      this.ctnGroupList = r.ctn_group_list;
    });
  }
  drawerClose() {
    this.drawerVisible = false;
  }
  handleValueChange($event: string | number) {
    if ($event == '卸货港') {
      $event = 'pod';
    } else {
      $event = 'ctnType';
    }
    this.colorMode = $event;
    this.switchMode();
  }
  switchMode() {
    const newBayDatas = this.vesselBayDatas.map((vesselBayData) =>
      vesselBayData.map((bay: any) => {
        return { ...bay };
      })
    );
    this.vesselBayDatas = newBayDatas;
  }
  fillVesselBayContainer = (item: Vescell<any>) => {
    let color = 'white';
    if (this.colorMode == 'pod') {
      const key = item.data.ctn_group.slice(0, 4);
      if (key == '') {
        color = 'white';
      } else {
        color = generateColor(key);
      }

      if (!(key in this.podColorDict)) {
        this.podColorDict[key] = color;
      }
    } else if (this.colorMode == 'ctnType') {
      // console.log(item.data.equip_type);
      const key = item.data.equipType.slice(0, 3);
      color = containerTypeStyles[key]?.color;
    }
    // console.log(this.podColorDict);
    return color;
  };
  textVesselBayContainer = (item: Vescell<any>) => {
    let text = '';
    if (this.colorMode == 'pod') {
      text = item.data.ctn_group.slice(0, 4);
    } else if (this.colorMode == 'ctnType') {
      text = item.data.equipType.slice(0, 3);
    }
    return text;
  };
  onVesselBayDbClick(vescell: any) {
    if (vescell.data.containerID) {
      this.vesCell = vescell;
      this.isVesCellVisible = true;
    }
  }
  handleVesCellCancel() {
    this.isVesCellVisible = false;
  }
}
