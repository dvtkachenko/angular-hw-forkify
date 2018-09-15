import { FormControl, FormGroupDirective, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

export class ResetPasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordForm: FormGroup;

  public errorMatcher: ErrorStateMatcher;
  
  public errorMessage: string;

  constructor(
    public resetDialog: MatDialog, 
    private fb: FormBuilder,
    private router: Router, 
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.isAuth()) {
      this.router.navigate(['/']);      
    }
    this.errorMatcher = new ResetPasswordErrorStateMatcher();
    this.resetPasswordForm = this.creatResetPasswordForm();
  }

  onResetPassword(): void {
    
    this.errorMessage = null;
 
    this.authService.resetPassword(this.resetPasswordForm.value.email)
    .then(res => {
      this.showResetDialog();
    })
    .catch(error => {
      this.errorMessage = error;
    });
  }

  private showResetDialog(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = "Reset password email was sent";

    const dialogRef = this.resetDialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
       this.router.navigate(['login']); 
    });    
  }

  private creatResetPasswordForm(): FormGroup {
    return this.fb.group({
      email: ['', [ Validators.required, Validators.email ]]
    });    
  }
}
