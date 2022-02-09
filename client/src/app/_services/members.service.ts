import { HttpClient, HttpHeaders, HttpParams, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaiginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer' + JSON.parse(localStorage.getItem('user'))?.token
  })
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user : User;
  userParams: UserParams;
  

  constructor(private http : HttpClient, private accountService: AccountService) { 
    accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user
      this.userParams = new UserParams(user);
    });
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams : UserParams){
    // if(this.members.length > 0) return of(this.members);
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response){
      return of(response);
    }
    
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge',userParams.minAge.toString());
    params = params.append('maxAge',userParams.maxAge.toString());
    params = params.append('gender',userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.baseUrl, params).pipe(map(response => {
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }))
  }

  getMember(username: string){
    const member = [...this.memberCache.values()]
      .reduce((arr,elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users/', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/'+ photoId,{});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/'+ photoId);
  }

  private getPaginatedResult<T>(url, params: HttpParams) {
    const paginaedResult: PaiginatedResult<T> = new PaiginatedResult<T>();

    return this.http.get<T>(url + 'users', { observe: 'response', params }).pipe(
      map(rep => {
        paginaedResult.result = rep.body;
        if (rep.headers.get('pagination') !== null) {
          paginaedResult.pagination = JSON.parse(rep.headers.get('pagination'));
        }
        return paginaedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    params = params.append('pageNumber',pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    
    return params;
  }
  
}
