import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { preStowGetUrls } from '../urls/baseUrls';

@Injectable({
  providedIn: 'root'
})
export class PreStorageServiceService {

  constructor(private http :HttpClient) { }
  PreStowGet(pageIndex:number,pageSize:number,groupPid?:boolean){
    let params = new HttpParams()
    params = params.set('pageIndex',pageIndex)
    params = params.set('pageSize',pageSize)
    params = groupPid?params.set('groupPid',groupPid):params.set('groupPid',false)
    return this.http.get<any>(preStowGetUrls,{params})
  }
  preStowSearch(pageIndex:number,pageSize:number,search:string){
  let params = new HttpParams()
  params =
  search!==null&&search!==undefined&&search!==''
  ?params.set('p_id',search)
  :params;
  params = params.set('pageIndex',pageIndex)
  params = params.set('pageSize',pageSize)
  return this.http.get<any>(preStowGetUrls,{params})
}
}

