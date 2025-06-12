import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { Container } from '../container.model';
import { CaseService } from '../../../../service/case.service';
import { Pagination, Result } from '../../../../types/result';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  delay,
  EMPTY,
  finalize,
  interval,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError
} from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-container-list',
  imports: [
    CommonModule, 
    FormsModule,
    NzTableModule, 
    NzInputModule,
    NzDividerModule
  ],
  templateUrl: './container-list.component.html',
  styleUrl: './container-list.component.scss'
})
export class ContainerListComponent implements OnInit, OnDestroy {
  containers: Container[] = [];
  size = 20;
  page = 1;
  total = 0;
  loading = false;
  searchValue = '';

  search$ = new Subject<string>();
  page$ = new Subject<{ page: number; size: number }>();

  // search$ = new BehaviorSubject<string>('');
  // page$ = new BehaviorSubject<{ page: number; size: number }>({
  //   page: this.page,
  //   size: this.size
  // });
  

  caseService = inject(CaseService);
  message = inject(NzMessageService);
  destroyRef = inject(DestroyRef);

  constructor() {
    // 基础版本：组件初始化时的逻辑
    // this.loadContainers();

    // 响应式编程版本：组件初始化时的逻辑
    // this.setupQueryStream();

    const deboundedSearch$ = this.search$
    .pipe(
      debounceTime(300), // 防抖处理，避免频繁请求
      // tap(() => {
      //   console.log('search...');
      // }),
    )


    // 定时刷新
    const refreshTimer$ = interval(1000).pipe(
      tap(() => {
        console.log('Refreshing containers...');
      }),
    );
        // this.loadContainers();
        // 触发搜索流，重新加载数据
    
    combineLatest([deboundedSearch$, this.page$, refreshTimer$])
    .pipe(
      tap(([searchValue, pageInfo, timer]) => {
        console.log('combineLatest');
      }),
      // takeUntil(this.destroy$), // 确保在组件销毁时取消订阅
      takeUntilDestroyed(this.destroyRef),
      switchMap(([searchValue, pageInfo]) => {
        console.log('switchMap trigger:', searchValue);
        this.size = pageInfo.size;
        if (this.searchValue !== searchValue) {
          this.page = 1; // 重置页码
        } else {
          this.page = pageInfo.page; // 保持当前页码
        }
        this.searchValue = searchValue;
      this.loading = true; // 开始加载数据
        return this.caseService.getCaseContainers(
          'P0522041205',
          this.page,
          this.size,
          this.searchValue
        ).pipe(

          //  takeUntilDestroyed(this.destroyRef),
          finalize(() => (this.loading = false))
        )
      }),
      catchError((error, caught) => {
        console.error('Error loading containers:', error);
        this.message.error('Error loading containers: ' + error.message);
        return EMPTY;

        // 提供1个回退值
        // return of({
        //   code: 200,
        //   message: 'Error loading containers: ' + error.message,
        //   data: {
        //     items: [],
        //     totalItems: 0,
        //     hasNext: false,
        //     hasPrev: false,
        //     totalPages: 0
        //   }
        // });

        // return caught; // caught 值的是原始流本身，此处即为combineLatest的流
      }),
    ).subscribe((response: Result<Pagination<Container[]>>) => {
       console.log('Containers loaded:', this);
        if (response.code === 200) {
          this.containers = response.data.items;
          this.total = response.data.totalItems;
        } else {
          console.error('Error loading containers:', response.message);
        }
    },
    (err) => { console.error('Error:', err); },
    () => { console.log('Container loading completed'); }
    );

    


    // combineLatest([deboundedSearch$, this.page$])
    // .subscribe(([searchValue, pageInfo]) => {
    //   console.log('Search value changed:', searchValue);
    //   this.size = pageInfo.size;
    //   if (this.searchValue !== searchValue) {
    //     this.page = 1; // 重置页码
    //   } else {
    //     this.page = pageInfo.page; // 保持当前页码
    //   }
    //   this.searchValue = searchValue;
    //   // this.page = 1; // 重置页码
    //   this.loadContainers();
    // });



    // .pipe(
    //   tap(([searchValue, pageInfo]) => {
    //        console.log('Search value changed:', searchValue);
    //         this.size = pageInfo.size;
    //         console.log('old searchValue:', this.searchValue);
    //         console.log('new searchValue:', searchValue);
    //         if (this.searchValue !== searchValue) {
    //           this.page = 1; // 重置页码
    //         } else {
    //           this.page = pageInfo.page; // 保持当前页码
    //         }
    //         this.searchValue = searchValue;
    //   }),
    //   switchMap(([searchValue, pageInfo]) => {
    //     this.loading = true; // 开始加载数据
    //     return this.caseService.getCaseContainers('P0522041205', this.page, this.size, this.searchValue)
    //     .pipe(
    //       finalize(() => (this.loading = false))
    //     )
    //   })
    // ).subscribe((response) => {
    //   console.log('Containers loaded:', response);
    //   if (response.code === 200) {
    //     this.containers = response.data.items;
    //     this.total = response.data.totalItems;
    //   } else {
    //     console.error('Error loading containers:', response.message);
    //   }
    // })
    // .subscribe(([searchValue, pageInfo]) => {
    //   console.log('Search value changed:', searchValue);
    //   this.size = pageInfo.size;
    //   if (this.searchValue !== searchValue) {
    //     this.page = 1; // 重置页码
    //   } else {
    //     this.page = pageInfo.page; // 保持当前页码
    //   }
    //   this.searchValue = searchValue;
    //   // this.page = 1; // 重置页码
    //   this.loadContainers();
    // });
  }

  ngOnInit(): void {
    console.log('ContainerListComponent initialized');
    // this.search$.next(''); // 初始化时清空搜索值
    // this.loadContainers();

    // this.search$.next('');
    // 组件初始化时的逻辑
    // console.log('ContainerListComponent initialized');

    // 演示内存泄漏的情况
    // interval(1000).subscribe(() => {
    //   // 每秒钟重新加载容器数据
    //   this.loadContainers();
    // });
  }

  // setupQueryStream(): void {
  //   combineLatest([this.search$.pipe(tap((v)=> console.log(v) )), this.page$])
  //     .pipe(
  //       switchMap(([searchValue, pageParams]) => {
  //         this.loading = true; // 开始加载数据
  //         this.searchValue = searchValue;
  //         this.page = pageParams.page;
  //         this.size = pageParams.size;
  //         return this.caseService
  //           .getCaseContainers('P0522041205', this.page, this.size, searchValue)
  //           .pipe(
  //             finalize(() => (this.loading = false)),
  //             // catchError((error, caught) => {
  //             //   console.error('Error loading containers:', error);
  //             //   return EMPTY;

  //             // })
  //           );
  //       }),
  //       catchError((error, caught) => {
  //         console.error('Error loading containers:', error);
  //         return caught;

  //       })
  //     )
  //     .subscribe(
  //       response => {
  //         console.log('Containers loaded:', response);
  //         if (response.code === 200) {
  //           this.containers = response.data.items;
  //           this.total = response.data.totalItems;
  //         } else {
  //           console.error('Error loading containers:', response.message);
  //         }
  //       },
  //       // err => {
  //       //   console.log('Error');
  //       // },
  //       // () => {
  //       //   console.log('Container loading completed');
  //       // }
  //     );
  // }

    search(value: string): void {

    // // 基础版本
    // this.searchValue = value;
    // this.page = 1; // 重置页码
    // this.loadContainers();

    this.search$.next(value);
    // this.search$.next(value);
    // this.page = 1;

    
  }

  onQueryParamsChange(params: { pageIndex: number; pageSize: number }): void {

    // 基础版本
    console.log('Query params changed:', params);
    // this.page = params.pageIndex;
    // this.size = params.pageSize;
    // this.loadContainers();


    // 响应式编程版本
    this.page$.next({
      page: params.pageIndex,
      size: params.pageSize
    });
  }

  loadContainers(): void {
    // 模拟加载容器数据
    this.loading = true;
    this.caseService
      .getCaseContainers('P0522041205', this.page, this.size, this.searchValue)
      .pipe(
        // takeUntil(this.destory$), // 确保在组件销毁时取消订阅
        finalize(() => (this.loading = false))
      )
      .subscribe((response: Result<Pagination<Container[]>>) => {
        console.log('Containers loaded:', this);
        if (response.code === 200) {
          this.containers = response.data.items;
          this.total = response.data.totalItems;
        } else {
          console.error('Error loading containers:', response.message);
        }
      });
  }

  updateContainer(container: Container): void {
    this.caseService.updateContainer(container).subscribe((response) => {
      if (response.code === 200) {
        console.log('Container updated successfully:', response.data);
        // 更新成功后可以重新加载容器列表
        this.message.success('Container updated successfully');
        this.loadContainers();
      } else {
        this.message.error('Error updating container: ' + response.message);
        console.error('Error updating container:', response.message);
      }

    })
  }

  removeContainer(container: Container): void {
    // 模拟删除容器
    this.caseService.removeContainer(container).subscribe((response) => {
      if (response.code === 200) {
        console.log('Container removed successfully:', response.data);
        // 删除成功后可以重新加载容器列表
        this.message.success('Container removed successfully');
        this.loadContainers();
      } else {
        this.message.error('Error removing container: ' + response.message);
        console.error('Error removing container:', response.message);
      }
    });
  }



  ngOnDestroy(): void {
    
    console.log('ContainerListComponent destroyed');

    // // 响应式编程版本：组件销毁时的逻辑
  }
}
