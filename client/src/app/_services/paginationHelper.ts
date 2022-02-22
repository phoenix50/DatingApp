import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaiginatedResult } from "../_models/pagination";


export function getPaginatedResult<T>(url, params: HttpParams, http: HttpClient) {
    const paginaedResult: PaiginatedResult<T> = new PaiginatedResult<T>();

    return http.get<T>(url, { observe: 'response', params }).pipe(
      map(rep => {
        paginaedResult.result = rep.body;
        if (rep.headers.get('pagination') !== null) {
          paginaedResult.pagination = JSON.parse(rep.headers.get('pagination'));
        }
        return paginaedResult;
      })
    );
  }

  export function getPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    params = params.append('pageNumber',pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    
    return params;
  }