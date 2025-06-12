import { ShareFunctionService } from './../../service/share-function.service';
import { BayPlotComponent } from './../bay-plot/bay-plot.component';
import {
  Component,
  OnInit,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { PreStorageServiceService } from '../../service/pre-storage-service.service';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { VesselBayComponent } from '@smuport/ngx-port-v';
import { ResizableColumnDirective } from '../../directive/resize-table.driective';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  delay,
  finalize,
  Observable,
  startWith,
  Subject,
  switchMap,
  Subscription,
  interval,
  tap,
  catchError,
  of,
  timer,
} from 'rxjs';
//箱信息的interface
import {
  preStow,
  pIdList,
  ctnGroupList,
} from '../../interface/container_pid_ctngroup';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pre-stow',
  imports: [
    NzInputModule,
    NzTableModule,
    ReactiveFormsModule,
    NzButtonModule,
    CommonModule,
    NzDrawerModule,
    NzSpaceModule,
    NzSpinModule,
    NzModalModule,
    NzAlertModule,
    ResizableColumnDirective,
    BayPlotComponent,
  ],
  templateUrl: './pre-stow.component.html',
  styleUrls: ['./pre-stow.component.css'],
})
export class PreStowComponent implements OnInit {
  constructor(
    private service: PreStorageServiceService,
    private ShareFunctionService: ShareFunctionService
  ) {
    this.textInputDebounce$ = this.search$.pipe(
      debounceTime(300),
    );
    const refreshTimer$ = timer(0).pipe(
      tap(() => {
        console.log('定时器触发');
      })
    );
    this.searchSubscription = combineLatest([
      this.textInputDebounce$,
      this.allDataPageIndex$,
      this.allDataPageSize$,
      refreshTimer$
    ])
      .pipe(
        takeUntilDestroyed(this.DestroyRef),
        switchMap(([searchInput, index, size]) => {
          console.log('combineLatest triggered:', { searchInput, index, size });

          this.allDataPageSize = size;
          if (this.searchValue != searchInput) {
            this.allDataPageIndex = 1;
            this.isSearched = true;
          } else {
            this.allDataPageIndex = index;
          }
          this.searchValue = searchInput;
          // console.log(this.searchValue)
          this.isPidInList = this.checkPidInList(searchInput);
          this.isLoading = true;
          return this.service
            .preStowSearch(
              this.allDataPageIndex,
              this.allDataPageSize,
              searchInput
            )
            .pipe(finalize(() => (this.isLoading = false)));
        }),
        catchError((error) => {
          this.ShareFunctionService.resloveErrorCase(error);
          return of({ results: [], all_count: 0 });
        })
      )
      .subscribe(
        (r) => {
          this.listOfData = r.results;
          this.count = r.all_count;
        },
        (error) => {
          this.ShareFunctionService.resloveErrorCase(error);
        },
        () => {
          console.log('combineLatest completed');
        }
      );
  }
  @ViewChild(VesselBayComponent)
  vesselBayComponent!: VesselBayComponent;
  allDataPageIndex$ = new BehaviorSubject<number>(1);
  allDataPageSize$ = new BehaviorSubject<number>(10);
  search$ = new BehaviorSubject<string>('');
  textInputDebounce$!: Observable<string>;
  DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    console.log('pre-stow component initialized');
  }
  ngOnDestroy(): void {}
  listOfData: preStow[] = [];
  ctnGroupList: ctnGroupList[] = [];
  allDataPageIndex = 1;
  allDataPageSize = 10;
  count!: number;
  isLoading: boolean = false;
  isSearched: boolean = false;
  isPidInList: boolean = true;
  pIdsearchedVailid: boolean = false;
  textInput: FormControl = new FormControl();
  searchValue: string = '';
  searchSubscription?: Subscription;
  allPIdList: pIdList[] = [];
  checkPidInList(inputValue: string) {
    if (!inputValue || inputValue.trim() === '') {
      return true;
    }
    return this.allPIdList.some((item) => item.p_id === inputValue);
  }
  reFreash() {
    this.textInput.reset();
    this.search$.next('');
    this.allDataPageIndex$.next(1);
    this.allDataPageSize$.next(10);
    this.isSearched = false;
  }
  ctnPageIndexChange(index:number) {
    this.allDataPageIndex$.next(this.allDataPageIndex);
  }
  ctnPageSizeChange(size:number) {
    this.allDataPageSize$.next(this.allDataPageSize);
  }
  search(textInput: FormControl) {
    // console.log(textInput.value)
    this.search$.next(textInput.value);
  }
}
