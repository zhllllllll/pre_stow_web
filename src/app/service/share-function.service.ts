import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareFunctionService {
  isError: boolean=false;
  error!: string;

  constructor() { }
  resloveErrorCase(error: any) {
    this.isError = true;
    this.error = error.message;
    console.error('获取失败', error);
  }
}
