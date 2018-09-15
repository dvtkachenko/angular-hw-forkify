import { User } from './../../models/user.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  public errorMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isAuth()) {
      this.router.navigate(['/']);      
    }
  }

  onLogin(): void {

    this.errorMessage = null;
    
    const user: User = { 
      email: this.email, 
      password: this.password 
    };

    this.authService.login(user)
      .then(res => {
        this.router.navigate(['/']); 
      })
      .catch(error => {
        this.errorMessage = error;
      });
  }
}
