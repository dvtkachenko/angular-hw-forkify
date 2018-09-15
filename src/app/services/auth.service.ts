import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private httpClient: HttpClient) { }

  public isAuth(): boolean {
    if (this.afAuth.auth.currentUser) {
      return true;
    } 
    return false;
  }

  public login(user: User): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  public signup(user: User): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  public resetPassword(resetEmail: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(resetEmail);
  }
  
  public logout(): void {
    this.afAuth.auth.signOut();
  }
}
