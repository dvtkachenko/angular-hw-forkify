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

  constructor(
    public resetDialog: MatDialog, 
    private fb: FormBuilder,
    private router: Router, 
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.errorMatcher = new ResetPasswordErrorStateMatcher()
    this.resetPasswordForm = this.creatResetPasswordForm();
  }

  onResetPassword(): void {
    this.showResetDialog();
    // this.authService.resetPassword(this.resetPasswordForm.value.email)
    //   .then(res => console.log(res));
  }

  private showResetDialog(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.resetDialog.open(ConfirmDialogComponent, dialogConfig);

//     const dialogRef = this.resetDialog.open(ConfirmDialogComponent, {
//       width: '250px',
      
// //      data: {name: this.name, animal: this.animal}
// //      data: "Reset password email was sent"
//     });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
//      this.animal = result;
    });    
  }

  private creatResetPasswordForm(): FormGroup {
    return this.fb.group({
      email: ['', [ Validators.required, Validators.email ]]
    });    
  }
}
