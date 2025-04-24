import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { PushNotifications } from '@capacitor/push-notifications';
import { Geolocation } from '@capacitor/geolocation';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  isLoggedIn = false;
  userType:string | null = null;
  userCode:any;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  constructor(private router:Router,private authService: AuthService,private platform: Platform,private cdr: ChangeDetectorRef,  
    private diagnostic: Diagnostic, 
    private navCtrl: NavController,  private toastController: ToastController
  ) {
   
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    if (Capacitor.isNativePlatform()) {
      this.platform.ready().then(() => {
        this.setStatusBar();
        this.initPushNotifications();
      });
      this.initializeApp();
    }
   // this.initPushNotifications();

    this.checkLoginStatus();
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      this.handleBackButton();
    });
  }
  handleBackButton() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      // Handle based on route
      const currentUrl = this.router.url;

      if (currentUrl === '/admin-tabs/viewcomplain'||currentUrl === '/otp-verification'||currentUrl === '/citizen-tabs/dashboard') {
        // Double press to exit
        const currentTime = new Date().getTime();

        if (currentTime - this.lastTimeBackPress < this.timePeriodToExit) {
          App.exitApp();; // Cordova only
        } else {
          this.presentToast('Press back again to exit');
          this.lastTimeBackPress = currentTime;
        }
      } else {
        // Navigate back if not on home
        this.navCtrl.back();
      }
    });
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  async setStatusBar() {
    if (Capacitor.getPlatform() !== 'web') {
      try {
       await StatusBar.setOverlaysWebView({ overlay: false });

        await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#f7f7f7' });
      await StatusBar.show();
      } catch (error) {
        console.warn('StatusBar error:', error);
      }
    }
  }
  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token'); // Check if token exists
  }
  async initPushNotifications() {
    if (Capacitor.getPlatform() !== 'web') {
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
      }

      PushNotifications.addListener('registration', (token:any) => {
        console.log('FCM Token:', token.value);
        localStorage.setItem('FCMToken',token.value)
      });

      PushNotifications.addListener('pushNotificationReceived', (notification:any) => {
        console.log('Push received:', notification);

        if (notification.data) {
          // ✅ Handle `data` messages from Firebase
          console.log('Data Message:', notification.data);
          alert(`${notification.data.title}\n\n${notification.data.body}`);
        } else {
          // ✅ Handle normal FCM notifications
          alert(` ${notification.title}\n\n${notification.body}`);
        }
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (action:any) => {
        console.log('Notification Clicked:', action);
      });
    }
  }
  async requestLocation() {
    try {
      const permission = await Geolocation.requestPermissions();
      const status = await Geolocation.checkPermissions();

      if (status.location === 'granted') {
        const position = await Geolocation.getCurrentPosition();
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
      } else if (status.location === 'denied') {
        alert('Location permission denied. Please enable it in settings.');
        const openSettings = confirm('Would you like to open app settings to enable location?');
        if (openSettings) {
          this.diagnostic.switchToSettings();
        }
      }
    } catch (error: any) {
      if (error.code === 1) {
        console.log('User denied the request for Geolocation.');
      } else {
        console.log('Error getting location:', error.message);
      }
    }
  }
}
