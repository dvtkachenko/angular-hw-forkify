import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorStateMatcher } from '@angular/material';

export class SignupErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup;

  public errorMessage: string;
  
  public errorMatcher: ErrorStateMatcher;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isAuth()) {
      this.router.navigate(['/']);
    }
    this.errorMatcher = new SignupErrorStateMatcher();
    this.signupForm = this.createSignupForm();
  }

  public onSignup(): void {
    
    this.errorMessage = null;

    if (this.signupForm.invalid) {
      return;
    }

    const newUser: User = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    this.authService.signup(newUser)
      .then(res => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.errorMessage = error;
      });
  }

  public onCancel(): void {
    this.router.navigate(['login']);
  }

  private passwordValidator(control: FormControl): ValidationErrors {

    const value = control.value;

    const isNotEmpty: boolean = value ? value.length > 0 : false;
    const hasNumber: boolean = /[0-9]/.test(value);
    const hasCapitalLetter: boolean = /[A-Z]/.test(value);
    const isLengthValid: boolean = value ? value.length > 7 : false;

    const passwordValid = isNotEmpty && hasNumber && hasCapitalLetter && isLengthValid;

    if (!passwordValid) {

      let errors = {};

      if (!isNotEmpty) {
        errors['isNotEmpty'] = "Password can not be empty !";
      }

      if (!hasNumber) {
        errors['hasNoNumber'] = "Password should consist at least 1 number !";
      }

      if (!hasCapitalLetter) {
        errors['hasNoCapitalLetter'] = "Password should consist at least 1 capital letter !";
      }

      if (!isLengthValid) {
        errors['lengthInvalid'] = "Password should consist at least 8 symbols !";
      }

      return errors;
    }
    return null;
  }

  private createSignupForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [this.passwordValidator]]
    });
  }
}
