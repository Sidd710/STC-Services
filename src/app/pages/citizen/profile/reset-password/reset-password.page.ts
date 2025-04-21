import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/apiService';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone:false,
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  resetForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private apiService: ApiService,private authService:AuthService,private router:Router,private location:Location
  ) {
    this.resetForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
    }, {
      validators: this.passwordsMatch
    });
  }

  passwordsMatch(group: FormGroup) {
    const newPass = group.get('new_password')?.value;
    const confirmPass = group.get('confirm_password')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }
  goBack() {
    this.location.back();
  }
  async onSubmit() {
    this.submitted = true;

    if (this.resetForm.invalid) {
     
      this.showToast('Please enter correct password', 'danger');
      return;
    }

    const payload = {
      oldpassword: this.resetForm.value.old_password,
      newpassword: this.resetForm.value.new_password,
      type:this.authService.getUserType()
    };

    try {
      const res: any = await this.apiService.post('auth/resetpassword', payload).toPromise();
      if (!res.status) {
        this.showToast(res.msg || 'Failed to update password', 'danger');
        return;
      }

      this.showToast('Password updated successfully!', 'success');
      this.resetForm.reset();
      this.submitted = false;
      this.router.navigate(['/citizen-tabs/profile']);

    } catch (error) {
      console.error(error);
      this.showToast('Something went wrong.', 'danger');
    }
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
