import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}
  //1 loggedIn: boolean = false;
  //2 currentUser$: Observable<User> | undefined;
  
  constructor(public accountService: AccountService, private router: Router,
     private toastr: ToastrService) { }

  ngOnInit(): void {
    //2 this.currentUser$ = this.accountService.currentUser$;
    //1 this.getCurrentUser();
  }

  login(){
    this.accountService.login(this.model).subscribe(respone =>{
      this.router.navigateByUrl('/members');
      //1 this.loggedIn = true;
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/')
    //1 this.loggedIn = false;
  }

  //1 getCurrentUser(){
  //   this.accountService.currentUser$.subscribe(user=>{
  //     this.loggedIn = !!user;
  //   },error =>{
  //     console.log(error);
  //   })
  // }

}
