import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardPage } from './pages/citizen/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { TabsPage } from './pages/citizen/tabs/tabs.page';
import { ViewComplainPage } from './pages/citizen/Complain/view-complain/view-complain.page';
import { AddComplainPage } from './pages/citizen/Complain/add-complain/add-complain.page';
import { ProfilePage } from './pages/citizen/profile/profile.page';
import { OtpVerificationPage } from './pages/otp-verification/otp-verification.page';
import { ResetPasswordPage } from './pages/citizen/profile/reset-password/reset-password.page';
import { ViewProfilePage } from './pages/citizen/profile/view-profile/view-profile.page';
import { EditComplaintPage } from './pages/citizen/Complain/edit-complaint/edit-complaint.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'user'] }
  },
  {
    path: 'otp-verification',
   component:OtpVerificationPage,
   canActivate:[AuthGuard]
  },
  {
    path: 'citizen-tabs',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardPage,
      },
      {
        path: 'view-complain',
        component: ViewComplainPage,
      },
      {
        path: 'add-complain',
        component: AddComplainPage,
      },
      {
        path: 'profile',
        component: ProfilePage,
      },
      {
        path: 'view-profile',
        component: ViewProfilePage,
      },
      {
        path: 'reset-password',
        component: ResetPasswordPage,
      },
      {
        path: '',
        redirectTo: 'citizen-tabs/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'edit-complaint/:id',
        component:EditComplaintPage
      },
    ],
  },
  {
    path: 'forgot-password',
    component:ForgotPasswordPage
  },
 

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
