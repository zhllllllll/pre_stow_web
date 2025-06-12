import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { DargTableService } from "../service/darg-table.service";
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appResizableColumn]',
})
export class ResizableColumnDirective implements OnInit, OnDestroy {
  @Input('appResizableColumn') columnKey!: string;
  @Input() minWidth = 10;

  private resizeHandle!: HTMLElement;
  private subscription!: Subscription;

  constructor(
    private el: ElementRef,
    private resizeService: DargTableService
  ) {}

  ngOnInit() {
    this.createResizeHandle();
    // 订阅列宽变化事件并保存订阅引用
    this.subscription = this.resizeService.columnWidthChanged.subscribe(({ columnKey, newWidth }) => {
      if (columnKey === this.columnKey) {
        this.setColumnWidth(newWidth);
      }
    });
  }

  ngOnDestroy() {
    // 清理订阅以防止内存泄漏
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private createResizeHandle() {
    const th = this.el.nativeElement as HTMLElement;


    // 检查是否已存在调整手柄，避免重复创建
    if (th.querySelector('.resize-handle')) {
      return;
    }

    this.resizeHandle = document.createElement('div');
    this.resizeHandle.className = 'resize-handle';

    // 添加样式使手柄更易于使用
    this.resizeHandle.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      width: 5px;
      height: 100%;
      cursor: col-resize;
      background: transparent;
      z-index: 1;
    `;

    // 确保父元素有相对定位
    if (getComputedStyle(th).position === 'static') {
      th.style.position = 'relative';
    }

    th.appendChild(this.resizeHandle);
  }
// @HostListener('事件名称', ['传递给方法的参数'])
// 方法名(参数: 类型) {
//   // 事件处理逻辑
// }
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    // 判断是否点击了调整手柄或其子元素 如果是子元素的话用closest方法来判断
    if (event.target === this.resizeHandle ||
        (event.target as HTMLElement)?.closest('.resize-handle')) {
      event.preventDefault();
      event.stopPropagation();
      this.resizeService.startResizing(this.columnKey, this.el.nativeElement, event);
    }
  }

  private setColumnWidth(width: number) {
    const th = this.el.nativeElement as HTMLElement;
    const finalWidth = Math.max(width, this.minWidth);

    th.style.width = `${finalWidth}px`;
    th.style.minWidth = `${finalWidth}px`;
    th.style.maxWidth = `${finalWidth}px`; // 添加最大宽度限制
  }
}
