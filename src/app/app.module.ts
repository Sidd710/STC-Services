import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardPage } from './pages/citizen/dashboard/dashboard.component';
import { TabsPage } from './pages/citizen/tabs/tabs.page';
import { ViewComplainPage } from './pages/citizen/Complain/view-complain/view-complain.page';
import { AddComplainPage } from './pages/citizen/Complain/add-complain/add-complain.page';
import { ProfilePage } from './pages/citizen/profile/profile.page';
import { HttpClientModule } from '@angular/common/http';
import { OtpVerificationPage } from './pages/otp-verification/otp-verification.page';
import { ResetPasswordPage } from './pages/citizen/profile/reset-password/reset-password.page';
import { ViewProfilePage } from './pages/citizen/profile/view-profile/view-profile.page';
import { EditComplaintPage } from './pages/citizen/Complain/edit-complaint/edit-complaint.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { AwesomeCordovaNativePlugin } from '@awesome-cordova-plugins/core';
import { AdminTabsPage } from './pages/admin/admin-tabs/admin-tabs.page';
import { AdminViewComplainPage } from './pages/admin/admin-view-complain/admin-view-complain.page';
import { ComplaincloseComponent } from './pages/admin/complainclose/complainclose.component';
import { AdminProfilePage } from './pages/admin/profile/profile.page';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardPage,
    TabsPage,
    ViewComplainPage,
    AddComplainPage,
    ProfilePage,
    OtpVerificationPage,
    ResetPasswordPage,ViewProfilePage,ResetPasswordPage,EditComplaintPage,ForgotPasswordPage,AdminTabsPage,AdminViewComplainPage,ComplaincloseComponent,AdminProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule ,
    
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Diagnostic
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
