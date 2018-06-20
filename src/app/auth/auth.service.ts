import {Injectable } from "@angular/core";
import {HttpClient} from"@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
const BACKEND_URL = environment.apiURL+/users/;
@Injectable({providedIn:"root"})
export class AuthService{
  private isAuthenticated=false;
  private token: string;
  private authSatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient,private router:Router){}
  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated
  }
  getAuthStatusListener(){
    return this.authSatusListener.asObservable();
  }
  getUserId(){
    return this.userId;
  }
  createUser(email:string, password: string){
    const authData: AuthData ={email:email, password:password};
    this.http.post(BACKEND_URL+"signup",authData).subscribe(()=>{
        this.router.navigate(['/']);
    }, error=>{
      //this.isLoading=false;
      this.authSatusListener.next(false);
    });

    };
  login(email:string,password:string){
    const authData: AuthData ={email:email, password:password};
    this.http.post<{token: string, expiresIn: number, userId:string}>(BACKEND_URL+"login",authData).subscribe(response=>{
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated=true;
        this.userId=response.userId;
        this.authSatusListener.next(true);
        const now = new Date();
        const expirationDate= new Date(now.getTime()+expiresInDuration*1000);
        this.saveAuthData(token,expirationDate,this.userId);
        this.router.navigate(['/']);
      }

    },error=>{
      this.authSatusListener.next(false);
    });
  }
  autoAuthUser(){
    const authInformation=this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn= authInformation.expirationDate.getTime()-now.getTime();
    if(expiresIn>0){
      this.token= authInformation.token;
      this.isAuthenticated=true;
      this.userId=authInformation.userId;
      this.setAuthTimer(expiresIn/1000);
      this.authSatusListener.next(true);
    }
  }
  logout(){
    this.token= null;
    this.isAuthenticated= false;
    this.authSatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.userId=null;
    this.router.navigate(['/']);


  }
  private setAuthTimer(duration:number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    },duration*1000);
  }
  private saveAuthData(token:string,expirationDate:Date,userId:string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId',userId);
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
  private getAuthData(){
    const token= localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId= localStorage.getItem("userId");
    if(!token || !expirationDate){
      return;
    }
    return{token: token, expirationDate: new Date(expirationDate), userId:userId}
  }
}
