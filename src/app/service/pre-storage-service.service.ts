import { preStow } from './../interface/container_pid_ctngroup';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { preStowCtnGetAllUrls, preStowCtnGetUrls,preStowPIDSearchUrls } from '../urls/baseUrls';

@Injectable({
  providedIn: 'root',
})
export class PreStorageServiceService {
  constructor(private http: HttpClient) {}
  PreStowPIDGet(
    pageIndex: number,
    pageSize: number,
    Pid: string,
  ) {
    let params = new HttpParams();
    params = params.set('pageIndex', pageIndex);
    params = params.set('pageSize', pageSize);
    params =
      Pid !== null && Pid !== '' && Pid !== undefined
        ? params.set('Pid', Pid)
        : params;
    return this.http.get<any>(preStowPIDSearchUrls, { params });
  }

  preStowSearch(pageIndex: number, pageSize: number, search: string) {
    let params = new HttpParams();
    params =
      search !== null && search !== undefined && search !== ''
        ? params.set('p_id', search)
        : params;
    params = params.set('pageIndex', pageIndex);
    params = params.set('pageSize', pageSize);
    return this.http.get<any>(preStowCtnGetUrls, { params });
  }
  preStowCtnGetAll(pid: string) {
    let params = new HttpParams();
    params = params.set('p_id', pid);
    return this.http.get<any>(preStowCtnGetAllUrls, { params });
  }
}
