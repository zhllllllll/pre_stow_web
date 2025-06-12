import {
  Injectable,
  EventEmitter
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DargTableService {
  constructor() {}
  //当前正在调整的列
  private resizingColumn:{columnKey:string;thElement:HTMLElement;} | null = null;
  private startX:number=0
  private startWidth:number=0

  //列宽变化事件
  columnWidthChanged=new EventEmitter<{columnKey:string;newWidth:number;}>()
  resizeStarted=new EventEmitter<void>()
  resizeEnded=new EventEmitter<void>()

  //开始调整列宽
  startResizing(columnKey:string,thElement:HTMLElement,event:MouseEvent){
    this.resizingColumn={columnKey,thElement}
    // console.log('event=',event)
    this.startX=event.pageX
    this.startWidth=thElement.offsetWidth

    //添加全局事件监听
    document.addEventListener('mousemove',this.onMouseMove)
    document.addEventListener('mouseup',this.onMouseUp)
    //触发调整开始事件
    this.resizeStarted.emit()
  }
  private onMouseMove=(event:MouseEvent)=>{
    if(!this.resizingColumn) return
    const{thElement,columnKey}=this.resizingColumn
    const width=Math.max(50,this.startWidth+(event.pageX-this.startX))
    thElement.style.width=`${width}px`
    thElement.style.minWidth=`${width}px`
    //事件触发通知
    this.columnWidthChanged.emit({columnKey,newWidth:width})
  }
  private onMouseUp=()=>{
    if(!this.resizingColumn) return
    this.resizingColumn=null
    //移除全局事件监听
    document.removeEventListener('mousemove',this.onMouseMove)
    document.removeEventListener('mouseup',this.onMouseUp)
    //触发调整结束事件
    this.resizeEnded.emit()
  }

}
