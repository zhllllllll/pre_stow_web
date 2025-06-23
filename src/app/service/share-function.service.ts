import { Injectable } from '@angular/core';
import { pIdList } from '../interface/container_pid_ctngroup';

@Injectable({
  providedIn: 'root',
})
export class ShareFunctionService {
  isError: boolean = false;
  error!: string;
  allPIdList: pIdList[] = [];

  constructor() {}
  resloveErrorCase(error: any) {
    this.isError = true;
    this.error = error.message;
    console.error('获取失败', error);
  }
  checkPidInList(inputValue: string) {
    if (!inputValue || inputValue.trim() === '') {
      return true;
    }
    return this.allPIdList.some((item) => item.p_id === inputValue);
  }
}
