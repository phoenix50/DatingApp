import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private persence: PresenceService) { }

  login(model: any){
    // return this.http.post(this.baseUrl + 'account/login', model);
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response)=>{
        const user = response as User;
        console.log(user);
        if(user){
          this.setCurrentUser(user);
          this.persence.createHubConnection(user);
        }
      })
    )
  }

  register(model: any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((response)=> {
        const user = response as User;
        if(user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles); 
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
    this.persence.stopHubConnection();
  } 

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
