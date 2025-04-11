import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private googleApiKey = environment.googleMapsApiKey;

  constructor(private http: HttpClient,    private toastCtrl: ToastController) {}

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, error => {
        console.error('Geolocation error:', error);
        this.showToast('Location permission denied or not available.', 'danger');
        reject(error);
      }, {
        enableHighAccuracy: true,
        timeout: 10000
      });
    });
  }

  async getAddressFromCoords(lat: number, lng: number) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.googleApiKey}`;
    return await this.http.get<any>(url).toPromise();
  }
  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2500,
      color,
      position: 'top',
    });
    toast.present();
  }
}
